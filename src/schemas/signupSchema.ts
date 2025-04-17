import * as z from "zod";

export const signUpSchema = z.object({
    name: z.string({ required_error: "El nombre es requerido" }).nonempty({ message: "El nombre es requerido" }),
    email: z
        .string({ required_error: "El correo es requerido" })
        .nonempty({ message: "El correo es requerido" })
        .email({ message: "Debe ser un correo válido" }),
    password: z
        .string({ required_error: "La contraseña es requerida" })
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type SignUpFormInputs = z.infer<typeof signUpSchema>;
