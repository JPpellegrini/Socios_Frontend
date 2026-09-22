import { z } from "zod";

export interface ProveedorListItem {
  id: string;
  cuitCuil: string;
  razonSocial: string;
  prestacion: string;
  estado: "Activo" | "Inactivo";
  telefonos: string[];
  emails: string[];
}

export interface ProveedorDetalle {
  id: string;
  cuitCuil: string;
  razonSocial: string;
  prestacion: string;
  estado: "Activo" | "Inactivo";
  fechaNacimiento: string;
  ciudad: string;
  calle: string;
  altura: string;
  observaciones?: string;
  telefonos: string[];
  emails: string[];
}

export const proveedorSchema = z.object({
  cuitCuil: z
    .string()
    .regex(/^\d{7,11}$/, "Debe ser un DNI o CUIT/CUIL válido (7 a 11 dígitos)"),
  razonSocial: z
    .string()
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(150, "Máximo 150 caracteres"),
  prestacion: z
    .string()
    .min(3, "La prestación debe tener al menos 3 caracteres")
    .max(200, "Máximo 200 caracteres"),
  fechaNacimiento: z.string().min(1, "La fecha de inicio o nacimiento es obligatoria"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  calle: z.string().min(1, "La calle es obligatoria"),
  altura: z.string().min(1, "La altura es obligatoria"),
  observaciones: z.string().optional(),
  telefonos: z
    .array(z.union([z.string(), z.object({ value: z.string() })]))
    .min(1, "Debe ingresar al menos un teléfono"),
  correos: z
    .array(
      z.union([
        z.string(),
        z.object({ value: z.string().email("Correo inválido") }),
      ])
    )
    .optional(),
});

export type ProveedorFormData = z.infer<typeof proveedorSchema>;

export type ContactField = string | { value: string };

export function contactValue(field: ContactField): string {
  return typeof field === "string" ? field : field.value;
}

export function normalizeContacts(values: ContactField[] | undefined): string[] {
  return (values ?? []).map(contactValue).filter(Boolean);
}
