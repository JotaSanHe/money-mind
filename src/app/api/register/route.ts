import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db('controlgastos');

    const existe = await db.collection('usuarios').findOne({ email: email }); 
    if (existe) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection('usuarios').insertOne({
      name,
      email: email, 
      password: hashed
    });

    return NextResponse.json({ message: 'Usuario registrado' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
