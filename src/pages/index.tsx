import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { SignInFormInputs, signInSchema } from "@/schemas/siginSchema";
import { useSignInMutation } from "@/hooks/useSiginMutation";

export default function SignIn() {
    const { register, handleSubmit, formState: { errors } } =
        useForm<SignInFormInputs>({ resolver: zodResolver(signInSchema) });
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const signInMutation = useSignInMutation();

    const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
        setErrorMessage(null);
        signInMutation.mutate(data, {
            onError(error: Error) {
                setErrorMessage(error.message);
            },
            onSuccess() {
                router.push("/dashboard");
            },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--gradient-bottom-right)" }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="card w-full max-w-md shadow-xl p-8 space-y-6"
                style={{ backgroundColor: "var(--dun)" }}
            >
                <h1 className="text-2xl font-bold text-center" style={{ color: "var(--paynes-gray)" }}>Iniciar Sesión</h1>

                {/* Email */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text" style={{ color: "var(--chamoisee)" }}>Correo Electrónico</span>
                    </label>
                    <input
                        type="email"
                        placeholder="tú@ejemplo.com"
                        className="input input-bordered w-full"
                        {...register("email")}
                    />
                    {errors.email && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.email.message}
                            </span>
                        </label>
                    )}
                </div>

                {/* Contraseña */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text" style={{ color: "var(--chamoisee)" }}>Contraseña</span>
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full"
                        {...register("password")}
                    />
                    {errors.password && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.password.message}
                            </span>
                        </label>
                    )}
                </div>

                {/* Error de servidor */}
                {errorMessage && (
                    <p className="text-center" style={{ color: "var(--earth-yellow)" }}>{errorMessage}</p>
                )}

                {/* Botón de enviar */}
                <div className="form-control mt-4">
                    <button
                        type="submit"
                        className={`btn w-full ${signInMutation.isPending && "loading"}`}
                        style={{ backgroundColor: "var(--paynes-gray)", color: "white" }}
                        disabled={signInMutation.isPending}
                    >
                        {signInMutation.isPending ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                </div>

                {/* Link a registro */}
                <div className="text-center pt-4">
                    <span className="text-sm" style={{ color: "var(--cadet-gray)" }}>
                        ¿No tienes cuenta?{" "}
                        <Link href="/signup" className="link font-medium" style={{ color: "var(--chamoisee)" }}>
                            Regístrate
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
}
