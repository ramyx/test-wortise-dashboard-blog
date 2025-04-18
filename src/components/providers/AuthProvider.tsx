import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authClient } from "@/lib/auth-client";


interface AuthProviderProps {
    children: ReactNode;
}

const publicPaths = ["/signin", "/signup"];

export default function AuthProvider({ children }: AuthProviderProps) {
    const { data: session, isPending, error } = authClient.useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (publicPaths.includes(router.pathname)) {
        return <>{children}</>;
    }

    if (isPending) return <div>Cargando...</div>;

    if (error) {
        return (
            <div>
                Error: {error.message || "Ocurrió un error inesperado al cargar la sesión."}
            </div>
        );
    }

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/signin");
        }
    }, [isPending, session, router]);

    return <>{children}</>;
}
