import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SignUpFormInputs, signUpSchema } from "@/schemas/signupSchema";
import { useSignUpMutation } from "@/hooks/useSignUpMutation";
import type { APIError } from "better-auth";

declare global {
    interface Window {
        grecaptcha?: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

export default function SignUpPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const signUp = useSignUpMutation();

    const { register, handleSubmit, formState: { errors } } =
        useForm<SignUpFormInputs>({ resolver: zodResolver(signUpSchema) });

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        setErrorMessage(null);

        if (!window.grecaptcha) {
            setErrorMessage("reCAPTCHA no ha cargado aún.");
            return;
        }

        try {
            await new Promise<void>((resolve) => window.grecaptcha!.ready(resolve));
            const token = await window.grecaptcha!.execute(
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
                { action: "sign_up" }
            );

            await signUp.mutateAsync({
                ...data,
                captchaToken: token,
            });

            router.push("/dashboard");
        } catch (err: any) {
            const apiErr = err as APIError;
            setErrorMessage(
                apiErr.body?.message ?? err.message ??
                "Ocurrió un error al registrarse."
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--gradient-bottom-right)" }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="card w-full max-w-md shadow-xl p-8 space-y-6"
                style={{ backgroundColor: "var(--dun)" }}
            >
                <h1 className="text-2xl font-bold text-center" style={{ color: "var(--paynes-gray)" }}>
                    Registrarse
                </h1>

                {/* Nombre */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text" style={{ color: "var(--chamoisee)" }}>
                            Nombre
                        </span>
                    </label>
                    <input
                        type="text"
                        placeholder="Tu nombre completo"
                        className="input input-bordered w-full"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="label-text-alt text-error">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text" style={{ color: "var(--chamoisee)" }}>
                            Correo Electrónico
                        </span>
                    </label>
                    <input
                        type="email"
                        placeholder="tú@ejemplo.com"
                        className="input input-bordered w-full"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="label-text-alt text-error">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Contraseña */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text" style={{ color: "var(--chamoisee)" }}>
                            Contraseña
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="label-text-alt text-error">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Error servidor */}
                {errorMessage && (
                    <p className="text-center" style={{ color: "var(--earth-yellow)" }}>
                        {errorMessage}
                    </p>
                )}

                {/* Botón Registrar */}
                <div className="form-control mt-4">
                    <button
                        type="submit"
                        className={`btn w-full ${signUp.isPending ? "loading" : ""}`}
                        style={{ backgroundColor: "var(--paynes-gray)", color: "white" }}
                        disabled={signUp.isPending}
                    >
                        {signUp.isPending ? "Registrando..." : "Registrarse"}
                    </button>
                </div>

                {/* Link a SignIn */}
                <p className="text-center pt-4" style={{ color: "var(--cadet-gray)" }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/" className="link font-medium" style={{ color: "var(--chamoisee)" }}>
                        Iniciar Sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
