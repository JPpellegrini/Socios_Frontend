"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import { SocioFormData, CodeudorFormData, normalizeContacts } from "./schema";
import { findCiudadIdByName } from "@/lib/ciudades";
import { findObraSocialIdByName } from "@/lib/obras-sociales";

interface BackendEntidadResponse {
  id_Entidad?: number;
  cuitCuil?: string;
  nombre?: string;
  apellido?: string;
  razonSocial?: string | null;
  sexo?: string;
  nacimiento?: string;
  fechaNacimiento?: string;
  ciudad?: { id_Ciudad?: number; nombre?: string } | string;
  calle?: string;
  altura?: number | string;
  observacion?: string | null;
}

export async function buscarSocioPorDocumento(
  nroDocumento: string
): Promise<(SocioFormData & { id?: string }) | null> {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendEntidadResponse | (SocioFormData & { id?: string })>(
      "/buscarentidad",
      token,
      {
        method: "GET",
        body: JSON.stringify({ dni: nroDocumento }),
      }
    );

    if (!raw) return null;

    // Si ya viene con formato SocioFormData (por ejemplo en tests / mocks directos)
    if ("plan" in raw && "cobrador" in raw) {
      return raw as (SocioFormData & { id?: string });
    }

    const entidad = raw as BackendEntidadResponse;
    const ciudadNombre =
      typeof entidad.ciudad === "object" && entidad.ciudad !== null
        ? entidad.ciudad.nombre || ""
        : typeof entidad.ciudad === "string"
        ? entidad.ciudad
        : "";

    return {
      id: entidad.id_Entidad ? String(entidad.id_Entidad) : undefined,
      nroDocumento,
      nombre: entidad.nombre || "",
      apellido: entidad.apellido || "",
      fechaNacimiento: entidad.nacimiento
        ? (entidad.nacimiento.split("T")[0] ?? "")
        : entidad.fechaNacimiento
        ? (entidad.fechaNacimiento.split("T")[0] ?? "")
        : "",
      sexo: entidad.sexo || "",
      ciudad: ciudadNombre,
      calle: entidad.calle || "",
      altura: String(entidad.altura ?? ""),
      fechaAlta: new Date().toISOString().substring(0, 10),
      plan: "",
      sepelio: "NO",
      cobrador: "NO",
      observaciones: entidad.observacion || undefined,
      telefonos: [],
      correos: [],
      codeudores: [],
    };
  } catch {
    return null;
  }
}

export async function guardarSocio(data: SocioFormData): Promise<void> {
  const token = await getAuthToken();

  if (!token) return;

  const payload = {
    dni: data.nroDocumento,
    nombre: data.nombre,
    apellido: data.apellido,
    fechaNacimiento: data.fechaNacimiento,
    idCiudad: findCiudadIdByName(data.ciudad),
    calle: data.calle,
    altura: parseInt(data.altura, 10) || 0,
    observaciones: data.observaciones || undefined,
    idObraSocial: findObraSocialIdByName(data.obraSocial),
    numeroAfiliado: data.nroAfiliadoObraSocial || undefined,
    plan: data.plan || undefined,
    sepelio: data.sepelio || undefined,
    cobrador: data.cobrador || undefined,
    telefonos: normalizeContacts(data.telefonos),
    emails: normalizeContacts(data.correos),
    codeudores: (data.codeudores || [])
      .map((c) => Number(c.id))
      .filter((n) => !isNaN(n) && n > 0),
  };

  await fetchAPI("/socios/crear", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function actualizarSocio(id: string, data: SocioFormData): Promise<void> {
  const token = await getAuthToken();

  if (!token) return;

  const payload = {
    idSocio: Number(id),
    idCiudad: findCiudadIdByName(data.ciudad),
    calle: data.calle,
    altura: parseInt(data.altura, 10) || 0,
    observaciones: data.observaciones || undefined,
    idObraSocial: findObraSocialIdByName(data.obraSocial),
    numeroAfiliado: data.nroAfiliadoObraSocial || undefined,
    plan: data.plan || undefined,
    sepelio: data.sepelio || undefined,
    cobrador: data.cobrador || undefined,
    telefonos: normalizeContacts(data.telefonos),
    emails: normalizeContacts(data.correos),
  };

  await fetchAPI("/socios/modificar", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function crearCodeudor(
  data: CodeudorFormData
): Promise<{ idEntidad: number } | null> {
  const token = await getAuthToken();

  if (!token) return null;

  const payload = {
    dni: data.dni,
    nombre: data.nombre,
    apellido: data.apellido,
    fechaNacimiento: data.fechaNacimiento,
    sexo: data.sexo || undefined,
    idCiudad: findCiudadIdByName(data.ciudad),
    calle: data.calle,
    altura: parseInt(data.altura, 10) || 0,
    observaciones: data.observaciones || undefined,
    telefonos: normalizeContacts(data.telefonos),
    emails: normalizeContacts(data.correos),
  };

  return await fetchAPI<{ idEntidad: number }>("/codeudores/crear", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
