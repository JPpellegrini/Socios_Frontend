import { z } from "zod";

export type TipoPrestacion = "PRESTACION" | "COLABORACION";
export type EstadoPrestacion = "ACTIVA" | "INACTIVA";

export interface PrestacionItem {
  id: string;
  idPrestacion: number;
  nombre: string;
  tipo: TipoPrestacion;
  estado: EstadoPrestacion;
}

export const prestacionSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener entre 3 y 100 caracteres.")
    .max(100, "El nombre debe tener entre 3 y 100 caracteres."),
  tipo: z.enum(["PRESTACION", "COLABORACION"], {
    message: "El tipo debe ser 'PRESTACION' o 'COLABORACION'.",
  }),
});

export type PrestacionFormData = z.infer<typeof prestacionSchema>;
