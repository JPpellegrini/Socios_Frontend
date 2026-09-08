"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import type {
  UsuarioListItem,
  CrearUsuarioDTO,
  ModificarRolDTO,
  ModificarPasswordDTO,
} from "@/lib/usuarios/types";

interface BackendUsuarioItem {
  id_Usuario: number;
  usuarioNombre?: string;
  usuario?: string;
  estado: string;
  id_Rol?: number;
  rolNombre?: string;
  rol?: string | { id_Rol?: number; rolNombre?: string; descripcion?: string };
  descripcion?: string;
}

interface BackendUsuarioResponse {
  id_Usuario: number;
  usuarioNombre: string;
  password?: string;
  estado: string;
  id_Rol: number;
  rol?: { id_Rol: number; rolNombre: string; descripcion?: string };
}

function rolToId(rol: string): number {
  const r = (rol || "").toUpperCase().trim();
  if (r === "CONSULTOR" || r === "2") return 2;
  // Secretaria / Administrador / default
  return 1;
}

export async function obtenerUsuarios(): Promise<UsuarioListItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return [];

  try {
    const raw = await fetchAPI<BackendUsuarioItem[]>("/usuarios/buscar", token);
    if (!Array.isArray(raw)) return [];

    return raw.map((u) => {
      const nombreUsuario = u.usuarioNombre || u.usuario || "";
      const rolStr =
        u.rolNombre ||
        (typeof u.rol === "object" && u.rol !== null ? u.rol.rolNombre : u.rol) ||
        "CONSULTOR";
      const estadoNorm =
        (u.estado || "").toUpperCase() === "ACTIVO" || (u.estado || "").toLowerCase() === "activo"
          ? "ACTIVO"
          : "BAJA";

      return {
        id_Usuario: u.id_Usuario,
        usuario: nombreUsuario,
        rol: rolStr.toUpperCase(),
        estado: estadoNorm,
      };
    });
  } catch {
    return [];
  }
}

export async function crearUsuario(data: CrearUsuarioDTO): Promise<UsuarioListItem | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const payload = {
      usuarioNombre: data.usuario,
      password: data.password,
      estado: "Activo",
      id_Rol: rolToId(data.rol),
    };

    const res = await fetchAPI<BackendUsuarioResponse>("/usuarios/alta", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const rolStr =
      res.rol?.rolNombre || (res.id_Rol === 2 ? "CONSULTOR" : "SECRETARIO");

    return {
      id_Usuario: res.id_Usuario,
      usuario: res.usuarioNombre || data.usuario,
      rol: rolStr.toUpperCase(),
      estado: "ACTIVO",
    };
  } catch {
    return null;
  }
}

export async function cambiarRolUsuario(data: ModificarRolDTO): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return false;

  try {
    await fetchAPI(`/usuarios/modificar/${data.id_Usuario}`, token, {
      method: "PUT",
      body: JSON.stringify({ id_Rol: rolToId(data.rol) }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function cambiarPasswordUsuario(data: ModificarPasswordDTO): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return false;

  try {
    await fetchAPI(`/usuarios/modificar/${data.id_Usuario}`, token, {
      method: "PUT",
      body: JSON.stringify({ password: data.password }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function cambiarEstadoUsuario(
  id_Usuario: number,
  nuevoEstado?: "ACTIVO" | "BAJA"
): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return false;

  try {
    if (nuevoEstado === "BAJA" || nuevoEstado === undefined) {
      await fetchAPI(`/usuarios/baja/${id_Usuario}`, token, {
        method: "POST",
      });
    } else {
      await fetchAPI(`/usuarios/modificar/${id_Usuario}`, token, {
        method: "PUT",
        body: JSON.stringify({ estado: "Activo" }),
      });
    }
    return true;
  } catch {
    return false;
  }
}
