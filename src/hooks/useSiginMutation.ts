import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { SignInFormInputs } from "@/schemas/siginSchema";
import { APIError } from "better-auth";

interface SignInResponse {
    redirect: boolean;
    token: string;
    url?: string;
    user: {
        id: string;
        email: string;
        name: string;
        image?: string | null;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}

export function useSignInMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<SignInResponse, APIError, SignInFormInputs>({
        mutationFn: async (credentials: SignInFormInputs): Promise<SignInResponse> => {
            // Llamamos al método de sign in del cliente
            const result = await authClient.signIn.email({
                email: credentials.email,
                password: credentials.password,
            });

            if (result.error) {
                throw result.error;
            }

            return result.data;
        },
        onSuccess() {
            // Invalida la query de sesión para que se actualice
            queryClient.invalidateQueries({ queryKey: ["session"] });
            router.push("/dashboard");
        },
        onError(error: Error) {
            console.error("Error al iniciar sesión:", error);
        },
    });
}
