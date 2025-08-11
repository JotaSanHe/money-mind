import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('controlgastos');
  const movimientos = await db.collection('movimientos').find({}).toArray();
  return NextResponse.json(movimientos);
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db('controlgastos');
  const body = await req.json();
  const result = await db.collection('movimientos').insertOne(body);
  return NextResponse.json({ insertedId: result.insertedId });
}
