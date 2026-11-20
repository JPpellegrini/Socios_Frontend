"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import {
  type PrestacionItem,
  type PrestacionFormData,
  type TipoPrestacion,
  type EstadoPrestacion,
  prestacionSchema,
} from "./schema";

interface BackendPrestacionDto {
  idPrestacion?: number;
  id_Prestacion?: number;
  nombre?: string;
  tipo?: string;
  estado?: string;
}

function mapPrestacion(raw: BackendPrestacionDto): PrestacionItem {
  const idNum = Number(raw.idPrestacion ?? raw.id_Prestacion ?? 0);
  const tipoNorm: TipoPrestacion =
    raw.tipo?.toUpperCase() === "COLABORACION" ? "COLABORACION" : "PRESTACION";
  const estadoNorm: EstadoPrestacion =
    raw.estado?.toUpperCase() === "INACTIVA" ? "INACTIVA" : "ACTIVA";

  return {
    id: String(idNum),
    idPrestacion: idNum,
    nombre: raw.nombre || "",
    tipo: tipoNorm,
    estado: estadoNorm,
  };
}

export async function obtenerPrestaciones(filtros?: {
  estado?: "ACTIVA" | "INACTIVA" | "TODOS";
  tipo?: TipoPrestacion;
  nombre?: string;
}): Promise<PrestacionItem[]> {
  const token = await getAuthToken();
  if (!token) return [];

  const params = new URLSearchParams();
  params.set("estado", filtros?.estado || "TODOS");
  if (filtros?.tipo) params.set("tipo", filtros.tipo);
  if (filtros?.nombre?.trim()) params.set("nombre", filtros.nombre.trim());

  try {
    const raw = await fetchAPI<BackendPrestacionDto[]>(
      `/prestaciones?${params.toString()}`,
      token
    );
    if (!Array.isArray(raw)) return [];
    return raw.map(mapPrestacion);
  } catch {
    return [];
  }
}

export async function crearPrestacion(
  data: PrestacionFormData
): Promise<{ success: boolean; prestacion?: PrestacionItem; mensaje?: string }> {
  const parsed = prestacionSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos.",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<BackendPrestacionDto>("/prestaciones", token, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return {
      success: true,
      prestacion: mapPrestacion(res),
    };
  } catch (err: unknown) {
    const mensaje =
      err instanceof Error ? err.message : "Error al crear la prestación.";
    return { success: false, mensaje };
  }
}

export async function modificarPrestacion(
  idPrestacion: number,
  data: PrestacionFormData
): Promise<{ success: boolean; mensaje?: string }> {
  if (!idPrestacion || idPrestacion <= 0) {
    return { success: false, mensaje: "Id de prestación inválido." };
  }

  const parsed = prestacionSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos.",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje?: string }>(
      `/prestaciones/modificar/${idPrestacion}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje =
      err instanceof Error ? err.message : "Error al modificar la prestación.";
    return { success: false, mensaje };
  }
}

export async function darDeBajaPrestacion(
  idPrestacion: number
): Promise<{ success: boolean; mensaje?: string }> {
  if (!idPrestacion || idPrestacion <= 0) {
    return { success: false, mensaje: "Id de prestación inválido." };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje?: string }>(
      `/prestaciones/baja/${idPrestacion}`,
      token,
      { method: "POST" }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje =
      err instanceof Error ? err.message : "Error al dar de baja la prestación.";
    return { success: false, mensaje };
  }
}

export async function reactivarPrestacion(
  idPrestacion: number
): Promise<{ success: boolean; mensaje?: string }> {
  if (!idPrestacion || idPrestacion <= 0) {
    return { success: false, mensaje: "Id de prestación inválido." };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje?: string }>(
      `/prestaciones/reactivar/${idPrestacion}`,
      token,
      { method: "POST" }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje =
      err instanceof Error ? err.message : "Error al reactivar la prestación.";
    return { success: false, mensaje };
  }
}
