import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error(
        "Por favor, define la variable de entorno MONGODB_URI en tu archivo .env.local"
    );
}

if (!process.env.MONGODB_DB) {
    throw new Error(
        "Por favor, define la variable de entorno MONGODB_DB en tu archivo .env.local"
    );
}

const uri: string = process.env.MONGODB_URI;
const dbName: string = process.env.MONGODB_DB;

const options = {};
const client = new MongoClient(uri, options);
await client.connect();
const db = client.db(dbName);

export { db };