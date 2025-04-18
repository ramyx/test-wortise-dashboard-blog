// pages/api/blog/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const postsCol = db.collection('posts');

    if (req.method === 'GET') {
        const page = parseInt(String(req.query.page) || '1', 10);
        const limit = parseInt(String(req.query.limit) || '10', 10);
        const search = String(req.query.search || '').trim();
        const skip = (page - 1) * limit;

        // Lookup directly using ObjectId stored in `author`
        const lookupStage = {
            $lookup: {
                from: 'user',
                localField: 'author',
                foreignField: '_id',
                as: 'authorDoc'
            }
        };
        const unwindStage = { $unwind: { path: '$authorDoc', preserveNullAndEmptyArrays: true } };

        // Conditional match for search term
        const matchStage = search
            ? {
                $match: {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { content: { $regex: search, $options: 'i' } },
                        { 'authorDoc.name': { $regex: search, $options: 'i' } }
                    ]
                }
            }
            : null;

        // Build aggregation for counting
        const countPipeline: any[] = [lookupStage, unwindStage];
        if (matchStage) countPipeline.push(matchStage);
        countPipeline.push({ $count: 'count' });
        const countResult = await postsCol.aggregate(countPipeline).toArray();
        const total = countResult[0]?.count ?? 0;

        // Build main aggregation pipeline
        const pipeline: any[] = [lookupStage, unwindStage];
        if (matchStage) pipeline.push(matchStage);
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
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
                        name: '$authorDoc.name'
                    }
                }
            }
        );

        const posts = await postsCol.aggregate(pipeline).toArray();

        return res.status(200).json({
            posts,
            page,
            total,
            totalPages: Math.ceil(total / limit)
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
            author: new ObjectId(author as string),
            createdAt: new Date(createdAt),
            updatedAt: now
        };
        const result = await postsCol.insertOne(postDoc as any);
        const fresh = await postsCol.findOne({ _id: result.insertedId });
        if (!fresh) return res.status(500).json({ error: 'No se pudo crear el post.' });

        const authorData = await db.collection('users').findOne(
            { _id: fresh.author as ObjectId },
            { projection: { name: 1 } }
        );

        return res.status(201).json({
            _id: fresh._id.toString(),
            title: fresh.title,
            content: fresh.content,
            coverImage: fresh.coverImage,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
            author: {
                id: (fresh.author as ObjectId).toString(),
                name: authorData?.name || ''
            }
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
