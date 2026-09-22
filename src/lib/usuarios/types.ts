export type EstadoUsuario = "ACTIVO" | "BAJA";

export type RolUsuario = "SECRETARIO" | "CONSULTOR" | "ADMINISTRADOR";

export const ROLES_DISPONIBLES: RolUsuario[] = [
  "SECRETARIO",
  "CONSULTOR",
  "ADMINISTRADOR",
];

export interface UsuarioListItem {
  id_Usuario: number;
  usuario: string;
  rol: string;
  estado: EstadoUsuario;
}

export interface CrearUsuarioDTO {
  usuario: string;
  rol: string;
  password: string;
  confirmPassword: string;
}

export interface ModificarRolDTO {
  id_Usuario: number;
  rol: string;
}

export interface ModificarPasswordDTO {
  id_Usuario: number;
  password: string;
  confirmPassword: string;
}

export function validarPassword(password: string): { valido: boolean; mensaje?: string } {
  if (!password || password.trim().length === 0) {
    return { valido: false, mensaje: "La contraseña es requerida" };
  }
  if (password.length < 8) {
    return { valido: false, mensaje: "La contraseña debe tener al menos 8 caracteres" };
  }
  const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!tieneEspecial) {
    return { valido: false, mensaje: "La contraseña debe incluir al menos 1 carácter especial" };
  }
  return { valido: true };
}
