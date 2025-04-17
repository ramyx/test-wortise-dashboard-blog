// pages/signin.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { SignInFormInputs, signInSchema } from "@/schemas/siginSchema";
import { useSignInMutation } from "@/hooks/useSiginMutation";

export default function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>({
        resolver: zodResolver(signInSchema)
    });
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const signInMutation = useSignInMutation();

    const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
        setErrorMessage(null);
        signInMutation.mutate(data, {
            onError(error: Error) {
                setErrorMessage(error.message || "Ocurrió un error al iniciar sesión.");
            },
            onSuccess() {
                // La redirección se maneja dentro del hook pero también se puede redirigir aquí.
            },
        });
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Correo Electrónico</label>
                    <input type="email" {...register("email")} />
                    {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
                </div>

                <div>
                    <label>Contraseña</label>
                    <input type="password" {...register("password")} />
                    {errors.password && <span style={{ color: "red" }}>{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={signInMutation.status === "pending"}>
                    {signInMutation.status === "pending" ? "Iniciando..." : "Iniciar Sesión"}
                </button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
}
