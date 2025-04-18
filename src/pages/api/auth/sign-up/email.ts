import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value) {
                headers.set(key, Array.isArray(value) ? value.join(",") : value);
            }
        });

        const result = await auth.api.signUpEmail({
            body: req.body,
            headers,
        });

        if (result.token === null) {
            return res.status(400).json({ error: "Error desconocido al registrarse." });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en sign-up email:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
