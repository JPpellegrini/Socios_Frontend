import {
  obtenerUsuarios,
  crearUsuario,
  cambiarRolUsuario,
  cambiarPasswordUsuario,
  cambiarEstadoUsuario,
} from "./actions";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";

describe("Server Actions - Usuarios", () => {
  const originalEnv = process.env.ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENV = "stg";
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000/api";
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  describe("obtenerUsuarios", () => {
    it("devuelve array vacío si no hay token", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      global.fetch = jest.fn();

      const res = await obtenerUsuarios();
      expect(res).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("hace GET /usuarios/buscar cuando hay token y mapea formato backend", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "my-token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify([
            {
              id_Usuario: 1,
              usuarioNombre: "CJR",
              estado: "Activo",
              rolNombre: "Consultor",
              descripcion: "Solo acceso a informes",
            },
          ]),
      }) as jest.Mock;

      const res = await obtenerUsuarios();
      expect(res).toHaveLength(1);
      expect(res[0]).toEqual({
        id_Usuario: 1,
        usuario: "CJR",
        rol: "CONSULTOR",
        estado: "ACTIVO",
      });
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/buscar",
        expect.objectContaining({ cache: "no-store" })
      );
    });
  });

  describe("crearUsuario", () => {
    it("devuelve null si no hay token", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await crearUsuario({
        usuario: "u1",
        rol: "SECRETARIO",
        password: "Pass123!",
        confirmPassword: "Pass123!",
      });
      expect(res).toBeNull();
    });

    it("hace POST /usuarios/alta con el payload adecuado para backend .NET", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({
            id_Usuario: 10,
            usuarioNombre: "u1",
            password: "$2a$11$hash",
            estado: "Activo",
            id_Rol: 1,
            rol: { id_Rol: 1, rolNombre: "Secretaria", descripcion: "Secretaria" },
          }),
      }) as jest.Mock;

      const dto = {
        usuario: "u1",
        rol: "SECRETARIO",
        password: "Pass123!",
        confirmPassword: "Pass123!",
      };
      const res = await crearUsuario(dto);

      expect(res?.id_Usuario).toBe(10);
      expect(res?.usuario).toBe("u1");
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/alta",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            usuarioNombre: "u1",
            password: "Pass123!",
            estado: "Activo",
            id_Rol: 1,
          }),
        })
      );
    });
  });

  describe("cambiarRolUsuario", () => {
    it("hace PUT /usuarios/modificar/:id", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ mensaje: "Usuario modificado correctamente" }),
      }) as jest.Mock;

      const ok = await cambiarRolUsuario({ id_Usuario: 5, rol: "CONSULTOR" });
      expect(ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/modificar/5",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ id_Rol: 2 }),
        })
      );
    });
  });

  describe("cambiarPasswordUsuario", () => {
    it("hace PUT /usuarios/modificar/:id", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ mensaje: "Usuario modificado correctamente" }),
      }) as jest.Mock;

      const ok = await cambiarPasswordUsuario({
        id_Usuario: 5,
        password: "NewPass123!",
        confirmPassword: "NewPass123!",
      });
      expect(ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/modificar/5",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ password: "NewPass123!" }),
        })
      );
    });
  });

  describe("cambiarEstadoUsuario", () => {
    it("hace POST /usuarios/baja/:id para dar de baja", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ mensaje: "Usuario dado de baja correctamente" }),
      }) as jest.Mock;

      const ok = await cambiarEstadoUsuario(5, "BAJA");
      expect(ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/baja/5",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
