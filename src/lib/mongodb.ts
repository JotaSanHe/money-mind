import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor define MONGODB_URI en .env.local');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // global para evitar nuevas conexiones en dev
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En producción, crea nueva conexión cada vez
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
