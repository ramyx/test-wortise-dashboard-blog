// pages/signup.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpMutation } from "@/hooks/useSignUpMutation";
import { SignUpFormInputs, signUpSchema } from "@/schemas/signupSchema";

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signUpSchema),
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const signUpMutation = useSignUpMutation();

    const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
        setErrorMessage(null);
        signUpMutation.mutate(data, {
            onError(error: Error) {
                setErrorMessage(error.message || "Ocurrió un error al registrarse.");
            },
            onSuccess() {
                // La redirección se maneja dentro del hook pero también se puede redirigir aquí.
                router.push("/dashboard");
            },
        });
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

                <button type="submit" disabled={signUpMutation.status === 'pending'}>
                    {signUpMutation.status === 'pending' ? "Registrando..." : "Registrarse"}
                </button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
}
