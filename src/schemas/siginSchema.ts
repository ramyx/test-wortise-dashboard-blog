import * as z from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido" })
    .nonempty({ message: "El correo es requerido" })
    .email({ message: "Debe ser un correo válido" }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .nonempty({ message: "La contraseña es requerida" }),
});

export type SignInFormInputs = z.infer<typeof signInSchema>;
