import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { SignUpFormInputs } from "@/schemas/signupSchema";
import type { APIError } from "better-auth";

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

export type SignUpWithCaptcha = SignUpFormInputs & {
    captchaToken: string;
};

export function useSignUpMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<SignUpResponse, APIError, SignUpWithCaptcha>({
        mutationFn: async ({ name, email, password, captchaToken }) => {
            // Llamas al cliente, pasando header directamente en el 2° argumento:
            const { data, error } = await authClient.signUp.email(
                { name, email, password },
                {
                    headers: {
                        "x-captcha-response": captchaToken,
                    },
                }
            );

            if (error) throw error;
            return data;
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            router.push("/dashboard");
        },
        onError(error) {
            console.error("Error al registrarse:", error);
        },
    });
}
