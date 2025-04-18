import { createAuthClient } from "better-auth/react";

const baseURL =
    process.env.NEXT_PUBLIC_AUTH_BASE_URL ||
    "http://localhost:3000/api/auth";

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        credentials: "include"
    }
});
