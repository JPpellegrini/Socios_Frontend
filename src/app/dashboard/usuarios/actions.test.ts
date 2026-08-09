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

    it("hace GET /usuarios cuando hay token", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "my-token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id_Usuario: 1, usuario: "TEST", rol: "ADMIN", estado: "ACTIVO" }],
      }) as jest.Mock;

      const res = await obtenerUsuarios();
      expect(res).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios",
        expect.objectContaining({ cache: "no-store" })
      );

    });
  });

  describe("crearUsuario", () => {
    it("devuelve null si no hay token", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await crearUsuario({
        usuario: "u1",
        rol: "ADMIN",
        password: "Pass123!",
        confirmPassword: "Pass123!",
      });
      expect(res).toBeNull();
    });

    it("hace POST /usuarios con el body adecuado", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id_Usuario: 10, usuario: "u1", rol: "ADMIN", estado: "ACTIVO" }),
      }) as jest.Mock;

      const dto = { usuario: "u1", rol: "ADMIN", password: "Pass123!", confirmPassword: "Pass123!" };
      const res = await crearUsuario(dto);

      expect(res?.id_Usuario).toBe(10);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(dto),
        })
      );
    });
  });

  describe("cambiarRolUsuario", () => {
    it("hace PATCH /usuarios/:id/rol", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => undefined }) as jest.Mock;

      const ok = await cambiarRolUsuario({ id_Usuario: 5, rol: "SUPERVISOR/A" });
      expect(ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/5/rol",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ rol: "SUPERVISOR/A" }),
        })
      );
    });
  });

  describe("cambiarPasswordUsuario", () => {
    it("hace PATCH /usuarios/:id/password", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => undefined }) as jest.Mock;

      const ok = await cambiarPasswordUsuario({
        id_Usuario: 5,
        password: "NewPass123!",
        confirmPassword: "NewPass123!",
      });
      expect(ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/5/password",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ password: "NewPass123!" }),
        })
      );
    });
  });

  describe("cambiarEstadoUsuario", () => {
    it("hace PATCH /usuarios/:id/estado", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "token" } : undefined),
      });
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => undefined }) as jest.Mock;

      const ok = await cambiarEstadoUsuario(5);
      expect(ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/usuarios/5/estado",
        expect.objectContaining({ method: "PATCH" })
      );
    });
  });
});
