import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mongodb';

// Handler para rutas GET (lista) y POST (crear)
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const collection = db.collection('posts');

    if (req.method === 'GET') {
        const posts = await collection.find().toArray();
        return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Título y contenido son requeridos.' });
        }
        const now = new Date();
        const result = await collection.insertOne({ title, content, createdAt: now, updatedAt: now });
        const post = await collection.findOne({ _id: result.insertedId });
        return res.status(201).json(post);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
