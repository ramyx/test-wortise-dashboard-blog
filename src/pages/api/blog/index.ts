import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
        const posts = await collection
            .aggregate([
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        let: { authorId: '$author' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$authorId' }] } } },
                            { $project: { _id: 1, name: 1 } }
                        ],
                        as: 'authorDoc',
                    },
                },
                { $unwind: { path: '$authorDoc', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: { $toString: '$_id' },
                        title: 1,
                        content: 1,
                        coverImage: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        author: {
                            id: { $toString: '$authorDoc._id' },
                            name: '$authorDoc.name',
                        },
                    },
                },
            ])
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
            return res.status(400).json({ error: 'Campos requeridos.' });
        }
        const now = new Date();
        const postDoc = {
            title,
            content,
            coverImage,
            author: new ObjectId(author),
            createdAt: new Date(createdAt),
            updatedAt: now,
        };
        const result = await collection.insertOne(postDoc);
        const fresh = await collection.findOne({ _id: result.insertedId });
        if (!fresh) return res.status(500).json({ error: 'No se pudo crear el post.' });

        // Devolver con autor poblado
        const authorData = await db
            .collection('users')
            .findOne({ _id: fresh.author }, { projection: { name: 1 } });

        return res.status(201).json({
            _id: fresh._id.toString(),
            title: fresh.title,
            content: fresh.content,
            coverImage: fresh.coverImage,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
            author: {
                id: authorData?._id.toString() || '',
                name: authorData?.name || '',
            },
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
