// hooks/useSignUpMutation.ts
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { SignUpFormInputs } from "@/schemas/signupSchema";

export interface SignUpResponse {
    token: string | null;
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

export function useSignUpMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<SignUpResponse, Error, SignUpFormInputs>({
        mutationFn: async (data: SignUpFormInputs): Promise<SignUpResponse> => {
            const result = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            // Accedemos a result.data.token
            if (!result.data?.token) {
                console.error("Resultado del signUp:", result);
                throw new Error("Error desconocido al registrarse.");
            }
            return result.data;
        },
        onSuccess() {
            // Invalida la query de sesión para refrescar la sesión
            queryClient.invalidateQueries({ queryKey: ["session"] });
            router.push("/dashboard");
        },
        onError(error: Error) {
            console.error("Error al registrarse:", error);
        },
    });
}
