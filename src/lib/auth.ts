import { cookies } from "next/headers";
import { fetchAPI } from "./apiClient";
import { isMockMode } from "./env";

import { MOCK_USUARIO } from "./mocks";

export interface Usuario {
  logueado: boolean;
  nombre: string;
  rol: string;
}

interface MeResponse {
  id_Usuario: number;
  usuarioNombre: string;
  estado: string;
  id_Rol: number;
  rolNombre: string;
}

export async function obtenerSesion(): Promise<Usuario | null> {
  if (isMockMode()) {
    return { logueado: true, nombre: MOCK_USUARIO.nombre, rol: MOCK_USUARIO.rol };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const me = await fetchAPI<MeResponse>("/me", token);
    return {
      logueado: true,
      nombre: me.usuarioNombre,
      rol: me.rolNombre,
    };
  } catch {
    return null;
  }
}

/**
 * Obtiene el token de autenticación para Server Actions.
 * - En modo 'develop' (isMockMode): si no existe cookie authToken en el navegador,
 *   proporciona un token simulado ('mock-token') para que fetchAPI proceda con los mocks.
 * - En 'stg' o 'prod': requiere estrictamente la presencia de la cookie authToken.
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token && isMockMode()) {
    return "mock-token";
  }
  return token;
}
