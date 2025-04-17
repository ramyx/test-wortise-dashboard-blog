import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
                headers.set(key, Array.isArray(value) ? value.join(',') : value);
            }
        }

        // Llamamos a la función de Better Auth para obtener la sesión
        const session = await auth.api.getSession({ headers });
        if (!session) {
            return res.status(401).json({ error: 'No session' });
        }
        return res.status(200).json(session);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
