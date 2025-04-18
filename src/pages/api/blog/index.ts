import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const collection = db.collection('posts');

    if (req.method === 'GET') {
        const page = parseInt(String(req.query.page) || '1', 10);
        const limit = parseInt(String(req.query.limit) || '10', 10);
        const skip = (page - 1) * limit;

        const total = await collection.countDocuments();
        const posts = await collection.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return res.status(200).json({
            posts,
            page,
            total,
            totalPages: Math.ceil(total / limit),
        });
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
