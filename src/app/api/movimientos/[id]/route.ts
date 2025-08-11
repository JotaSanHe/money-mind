import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db('controlgastos');
  const body = await req.json();
  await db.collection('movimientos').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: body }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db('controlgastos');
  await db.collection('movimientos').deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ ok: true });
}
