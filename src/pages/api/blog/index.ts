// pages/api/blog/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
        const { title, content, coverImage, author, createdAt } = req.body;
        if (!title || !content || !author || !createdAt) {
            return res
                .status(400)
                .json({ error: 'Título, contenido, autor y fecha son requeridos.' });
        }

        const now = new Date();
        const result = await collection.insertOne({
            title,
            content,
            coverImage,
            author,
            createdAt: new Date(createdAt),
            updatedAt: now,
        });
        const post = await collection.findOne({ _id: result.insertedId });
        return res.status(201).json(post);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
