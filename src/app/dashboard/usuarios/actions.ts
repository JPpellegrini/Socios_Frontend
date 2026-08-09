"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import type {
  UsuarioListItem,
  CrearUsuarioDTO,
  ModificarRolDTO,
  ModificarPasswordDTO,
} from "@/lib/usuarios/types";

export async function obtenerUsuarios(): Promise<UsuarioListItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return [];

  try {
    return await fetchAPI<UsuarioListItem[]>("/usuarios", token);
  } catch {
    return [];
  }
}

export async function crearUsuario(data: CrearUsuarioDTO): Promise<UsuarioListItem | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    return await fetchAPI<UsuarioListItem>("/usuarios", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function cambiarRolUsuario(data: ModificarRolDTO): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return false;

  try {
    await fetchAPI(`/usuarios/${data.id_Usuario}/rol`, token, {
      method: "PATCH",
      body: JSON.stringify({ rol: data.rol }),
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
    await fetchAPI(`/usuarios/${data.id_Usuario}/password`, token, {
      method: "PATCH",
      body: JSON.stringify({ password: data.password }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function cambiarEstadoUsuario(id_Usuario: number): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return false;

  try {
    await fetchAPI(`/usuarios/${id_Usuario}/estado`, token, {
      method: "PATCH",
    });
    return true;
  } catch {
    return false;
  }
}
