import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSignUpMutation } from "@/hooks/useSignUpMutation";
import { SignUpFormInputs, signUpSchema } from "@/schemas/signupSchema";
import type { APIError } from "better-auth";

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signUpSchema),
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const signUp = useSignUpMutation();

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        setErrorMessage(null);
        try {
            await signUp.mutateAsync(data);
        } catch (err: any) {
            if ((err as APIError).body?.message) {
                setErrorMessage((err as APIError).body?.message ?? "Ocurrió un error desconocido.");
            } else {
                setErrorMessage(err.message || "Ocurrió un error al registrarse.");
            }
        }
    };

    return (
        <div>
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Nombre</label>
                    <input type="text" {...register("name")} />
                    {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
                </div>
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
                <button type="submit" disabled={signUp.isPending}>
                    {signUp.isPending ? "Registrando..." : "Registrarse"}
                </button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
}
