import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    if (!ObjectId.isValid(String(id))) {
        return res.status(400).json({ error: 'ID inválido.' });
    }
    const _id = new ObjectId(String(id));
    const collection = db.collection('posts');

    if (req.method === 'GET') {
        const post = await collection.findOne({ _id });
        if (!post) return res.status(404).json({ error: 'Post no encontrado.' });
        return res.status(200).json(post);
    }

    if (req.method === 'PUT') {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Título y contenido son requeridos.' });
        }
        const now = new Date();
        const result = await collection.findOneAndUpdate(
            { _id },
            { $set: { title, content, updatedAt: now } },
            { returnDocument: 'after' }
        );
        if (!result?.value) return res.status(404).json({ error: 'Post no encontrado.' });
        return res.status(200).json(result.value);
    }

    if (req.method === 'DELETE') {
        const result = await collection.deleteOne({ _id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Post no encontrado.' });
        }
        return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
