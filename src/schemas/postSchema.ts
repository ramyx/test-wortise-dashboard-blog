import { z } from "zod";

// Definimos el esquema de validación con Zod
export const postSchema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    content: z.string().min(1, 'El contenido es requerido'),
    coverImage: z.string().url('Debe ser una URL válida').optional(),
    author: z.string().min(1, 'Autor no encontrado'),
    createdAt: z.string().min(1, 'Fecha es requerida'),
});