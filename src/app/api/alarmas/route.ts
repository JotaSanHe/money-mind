import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('controlgastos');
    const alarmas = await db.collection('alarmas').find({}).toArray();
    return NextResponse.json(alarmas);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener las alarmas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { categoria, importe } = await request.json();
    const client = await clientPromise;
    const db = client.db('controlgastos');
    const result = await db.collection('alarmas').insertOne({ categoria, importe });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al guardar la alarma' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db('controlgastos');
    const result = await db.collection('alarmas').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar la alarma' }, { status: 500 });
  }
}