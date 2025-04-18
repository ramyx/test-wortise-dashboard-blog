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
    const postsCol = db.collection('posts');

    switch (req.method) {
        case 'GET': {
            const pipeline = [
                { $match: { _id } },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'authorDoc'
                    }
                },
                {
                    $unwind: {
                        path: '$authorDoc',
                        preserveNullAndEmptyArrays: true
                    }
                },
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
            ];

            const [post] = await postsCol.aggregate(pipeline).toArray();
            if (!post) {
                return res.status(404).json({ error: 'Post no encontrado.' });
            }
            return res.status(200).json(post);
        }

        case 'PUT': {
            const { title, content, coverImage, createdAt } = req.body;

            if (!title || !content) {
                return res.status(400).json({ error: 'Título, contenido son requeridos.' });
            }
            const now = new Date();
            const updateDoc: any = {
                $set: {
                    title,
                    content,
                    updatedAt: now
                }
            };

            if (coverImage !== undefined) updateDoc.$set.coverImage = coverImage;

            const result = await postsCol.findOneAndUpdate(
                { _id },
                updateDoc,
                { returnDocument: 'after' }
            );

            const fresh = result?.value;
            if (!fresh) {
                return res.status(404).json({ error: 'Post no encontrado.' });
            }
            return res.status(200).json({
                _id: fresh._id.toString(),
                title: fresh.title,
                content: fresh.content,
                coverImage: fresh.coverImage,
                createdAt: fresh.createdAt,
                updatedAt: fresh.updatedAt,
                author: {
                    id: fresh.author.toString(),
                    name: fresh.authorName || ''
                }
            });
        }

        case 'DELETE': {
            const result = await postsCol.deleteOne({ _id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Post no encontrado.' });
            }
            return res.status(204).end();
        }

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}