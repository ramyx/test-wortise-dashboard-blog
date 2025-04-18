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

    switch (req.method) {
        case 'GET': {
            const post = await collection.findOne({ _id });
            if (!post) return res.status(404).json({ error: 'Post no encontrado.' });
            return res.status(200).json(post);
        }

        case 'PUT': {
            const { title, content, coverImage, author, createdAt } = req.body;
            if (!title || !content || !author || !createdAt) {
                return res.status(400).json({ error: 'Todos los campos son requeridos.' });
            }
            const now = new Date();
            const updateDoc = {
                $set: {
                    title,
                    content,
                    ...(coverImage !== undefined && { coverImage }),
                    author,
                    createdAt: new Date(createdAt),
                    updatedAt: now,
                },
            };
            const result = await collection.findOneAndUpdate(
                { _id },
                updateDoc,
                { returnDocument: 'after' }
            );
            if (!result?.value) {
                return res.status(404).json({ error: 'Post no encontrado.' });
            }
            return res.status(200).json(result.value);
        }

        case 'DELETE': {
            const result = await collection.deleteOne({ _id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Post no encontrado.' });
            }
            return res.status(204).end();
        }

        default: {
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
}
