"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import { type NichoItem, type NichoFiltros } from "./schema";

interface BackendNichoItem {
  id_Nicho?: number;
  idNicho?: number;
  id?: number | string;
  nroNicho?: number;
  sector?: string;
  ocupado?: boolean;
  valorNicho?: number;
  valorLapida?: number;
  cuotas?: number;
  interes?: number;
  socio?: {
    id_Socio?: number;
    idSocio?: number;
    id?: number | string;
    nombre?: string;
    apellido?: string;
  } | null;
}

export async function obtenerNichos(
  filtros?: NichoFiltros
): Promise<NichoItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (filtros?.nombre) queryParams.set("nombre", filtros.nombre);
  if (filtros?.apellido) queryParams.set("apellido", filtros.apellido);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendNichoItem[]>(
      `/nichos/buscar${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((n) => {
      const idNicho = n.id_Nicho ?? n.idNicho ?? n.id ?? 0;
      let socioObj = null;

      if (n.socio && (n.socio.nombre || n.socio.apellido)) {
        const idSocio =
          n.socio.id_Socio ?? n.socio.idSocio ?? n.socio.id ?? "";
        socioObj = {
          id: String(idSocio),
          nombre: n.socio.nombre || "",
          apellido: n.socio.apellido || "",
        };
      }

      return {
        id: String(idNicho),
        nroNicho: n.nroNicho ?? 0,
        sector: n.sector || "-",
        ocupado: Boolean(n.ocupado),
        valorNicho: n.valorNicho ?? 0,
        valorLapida: n.valorLapida ?? 0,
        cuotas: n.cuotas ?? 0,
        interes: n.interes ?? 0,
        socio: socioObj,
      };
    });
  } catch {
    return [];
  }
}
