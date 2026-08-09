import {
  devGetUsuarios,
  devAddUsuario,
  devUpdateUsuarioRol,
  devUpdateUsuarioPassword,
  devToggleUsuarioEstado,
} from "@/lib/dev-store";
import {
  obtenerUsuarios,
  crearUsuario,
  cambiarRolUsuario,
  cambiarPasswordUsuario,
  cambiarEstadoUsuario,
} from "@/app/dashboard/usuarios/actions";
import type {
  UsuarioListItem,
  CrearUsuarioDTO,
  ModificarRolDTO,
  ModificarPasswordDTO,
} from "./types";

export interface UsuariosService {
  list(): Promise<UsuarioListItem[]>;
  create(data: CrearUsuarioDTO): Promise<UsuarioListItem | null>;
  updateRol(data: ModificarRolDTO): Promise<boolean>;
  updatePassword(data: ModificarPasswordDTO): Promise<boolean>;
  toggleEstado(id_Usuario: number): Promise<boolean>;
}

export class MockUsuariosService implements UsuariosService {
  async list(): Promise<UsuarioListItem[]> {
    return devGetUsuarios();
  }
  async create(data: CrearUsuarioDTO): Promise<UsuarioListItem | null> {
    return devAddUsuario(data);
  }
  async updateRol(data: ModificarRolDTO): Promise<boolean> {
    return devUpdateUsuarioRol(data.id_Usuario, data.rol);
  }
  async updatePassword(data: ModificarPasswordDTO): Promise<boolean> {
    return devUpdateUsuarioPassword(data.id_Usuario, data.password);
  }
  async toggleEstado(id_Usuario: number): Promise<boolean> {
    return devToggleUsuarioEstado(id_Usuario);
  }
}

export class ApiUsuariosService implements UsuariosService {
  async list(): Promise<UsuarioListItem[]> {
    return obtenerUsuarios();
  }
  async create(data: CrearUsuarioDTO): Promise<UsuarioListItem | null> {
    return crearUsuario(data);
  }
  async updateRol(data: ModificarRolDTO): Promise<boolean> {
    return cambiarRolUsuario(data);
  }
  async updatePassword(data: ModificarPasswordDTO): Promise<boolean> {
    return cambiarPasswordUsuario(data);
  }
  async toggleEstado(id_Usuario: number): Promise<boolean> {
    return cambiarEstadoUsuario(id_Usuario);
  }
}

export function createUsuariosService(mockMode = false): UsuariosService {
  return mockMode ? new MockUsuariosService() : new ApiUsuariosService();
}
