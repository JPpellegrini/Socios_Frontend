import {
  obtenerPrestaciones,
  crearPrestacion,
  modificarPrestacion,
  darDeBajaPrestacion,
  reactivarPrestacion,
} from "./actions";

jest.mock("../../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("../../../../lib/auth", () => ({
  getAuthToken: jest.fn(),
}));

import { fetchAPI } from "../../../../lib/apiClient";
import { getAuthToken } from "../../../../lib/auth";

describe("Prestaciones Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthToken as jest.Mock).mockResolvedValue("tok");
  });

  describe("obtenerPrestaciones", () => {
    it("consulta GET /prestaciones?estado=TODOS por defecto", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          idPrestacion: 1,
          nombre: "CARDIOLOGÍA",
          tipo: "COLABORACION",
          estado: "ACTIVA",
        },
      ]);

      const res = await obtenerPrestaciones();

      expect(fetchAPI).toHaveBeenCalledWith("/prestaciones?estado=TODOS", "tok");
      expect(res).toHaveLength(1);
      expect(res[0]).toEqual({
        id: "1",
        idPrestacion: 1,
        nombre: "CARDIOLOGÍA",
        tipo: "COLABORACION",
        estado: "ACTIVA",
      });
    });

    it("retorna array vacío si no hay token", async () => {
      (getAuthToken as jest.Mock).mockResolvedValue(null);
      const res = await obtenerPrestaciones();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe("crearPrestacion", () => {
    it("falla validación si nombre es menor a 3 caracteres", async () => {
      const res = await crearPrestacion({ nombre: "AB", tipo: "PRESTACION" });
      expect(res.success).toBe(false);
      expect(res.mensaje).toMatch(/entre 3 y 100 caracteres/i);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("envía POST a /prestaciones con éxito", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({
        idPrestacion: 10,
        nombre: "AMBULANCIA",
        tipo: "PRESTACION",
        estado: "ACTIVA",
      });

      const res = await crearPrestacion({ nombre: "Ambulancia", tipo: "PRESTACION" });

      expect(res.success).toBe(true);
      expect(res.prestacion?.idPrestacion).toBe(10);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/prestaciones",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ nombre: "Ambulancia", tipo: "PRESTACION" }),
        })
      );
    });
  });

  describe("modificarPrestacion", () => {
    it("envía PUT a /prestaciones/modificar/{id}", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({
        mensaje: "Prestación modificada correctamente.",
      });

      const res = await modificarPrestacion(1, {
        nombre: "Cardiología Infantil",
        tipo: "COLABORACION",
      });

      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/prestaciones/modificar/1",
        "tok",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            nombre: "Cardiología Infantil",
            tipo: "COLABORACION",
          }),
        })
      );
    });
  });

  describe("darDeBajaPrestacion", () => {
    it("envía POST a /prestaciones/baja/{id}", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({
        mensaje: "Prestación dada de baja correctamente.",
      });

      const res = await darDeBajaPrestacion(3);

      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/prestaciones/baja/3",
        "tok",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  describe("reactivarPrestacion", () => {
    it("envía POST a /prestaciones/reactivar/{id}", async () => {
      (fetchAPI as jest.Mock).mockResolvedValue({
        mensaje: "Prestación reactivada correctamente.",
      });

      const res = await reactivarPrestacion(3);

      expect(res.success).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/prestaciones/reactivar/3",
        "tok",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
