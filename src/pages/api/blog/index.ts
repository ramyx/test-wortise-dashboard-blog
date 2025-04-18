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
        const search = String(req.query.search || '').trim();
        const skip = (page - 1) * limit;

        // Base lookup to populate authorDoc
        const lookupStage = {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'authorDoc',
            }
        };
        const unwindStage = { $unwind: { path: '$authorDoc', preserveNullAndEmptyArrays: true } };

        // Build match stage if searching by title, content, or author name
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

        // Count total matching documents
        let total = 0;
        if (matchStage) {
            const countAgg = await collection
                .aggregate([lookupStage, unwindStage, matchStage, { $count: 'count' }])
                .toArray();
            total = countAgg[0]?.count || 0;
        } else {
            total = await collection.countDocuments();
        }

        // Build aggregation pipeline for paginated results
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

        const posts = await collection.aggregate(pipeline).toArray();

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
            updatedAt: now
        };
        const result = await collection.insertOne(postDoc);
        const fresh = await collection.findOne({ _id: result.insertedId });
        if (!fresh) return res.status(500).json({ error: 'No se pudo crear el post.' });

        const authorData = await db.collection('users').findOne(
            { _id: fresh.author },
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
                id: authorData?._id.toString() || '',
                name: authorData?.name || ''
            }
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
