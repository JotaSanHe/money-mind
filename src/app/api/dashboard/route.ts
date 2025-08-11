import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mesSeleccionado = searchParams.get('mes') || new Date().toISOString().slice(0, 7);

    const client = await clientPromise;
    const db = client.db('controlgastos');

    const user = await db.collection('usuarios').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userId = new ObjectId(user._id);

    const movimientos = await db
      .collection('movimientos')
      .find({
        usuario_id: user.id,
        fecha: { $regex: `^${mesSeleccionado}` },
      })
      .toArray();

    const ingresos = movimientos
      .filter(m => m.categoria === 'Ingreso')
      .reduce((sum, m) => sum + m.monto, 0);

    const gastosFijos = movimientos
      .filter(m => m.es_fijo === '1')
      .reduce((sum, m) => sum + m.monto, 0);

    const gastos = movimientos
      .filter(m => m.categoria !== 'Ingreso' && m.es_fijo === '0')
      .reduce((acc, m) => {
        const categoria = m.categoria || 'Otros';
        const existing = acc.find(g => g.categoria === categoria);
        if (existing) {
          existing.total += m.monto;
        } else {
          acc.push({ categoria, total: m.monto });
        }
        return acc;
      }, [] as { categoria: string; total: number }[]);


    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const previsionMovimientos = await db
      .collection('movimientos')
      .find({
        usuario_id: user.id,
        fecha: { $regex: `^${lastYear}` }, 
        categoria: { $ne: 'Ingreso' }, 
      })
      .toArray();
      
    const prevision = previsionMovimientos.reduce((sum, m) => sum + m.monto, 0);

    return NextResponse.json({
      ingresos,
      gastosFijos,
      gastos,
      prevision,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}