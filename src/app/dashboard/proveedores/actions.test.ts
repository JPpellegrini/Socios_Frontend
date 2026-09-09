import {
  obtenerProveedores,
  obtenerProveedorDetalle,
  crearProveedor,
  actualizarProveedor,
  darDeBajaProveedor,
  reactivarProveedor,
} from "./actions";

jest.mock("../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Proveedores Server Actions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("obtenerProveedores", () => {
    it("sin token devuelve array vacío", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerProveedores();
      expect(res).toEqual([]);
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it("con token consulta /proveedores y mapea los datos", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue([
        {
          id_Proveedor: 1,
          cuitCuil: "30712345678",
          razonSocial: "Emergencias Médicas S.A.",
          prestacion: "Servicio médico",
          estado: "ACTIVO",
          telefonos: ["3414201000"],
          emails: ["guardia@emergencias.com"],
        },
      ]);

      const res = await obtenerProveedores({ filtro: "Emergencias" });
      expect(res).toHaveLength(1);
      expect(res[0]?.id).toBe("1");
      expect(res[0]?.razonSocial).toBe("Emergencias Médicas S.A.");
      expect(res[0]?.estado).toBe("Activo");
      expect(fetchAPI).toHaveBeenCalledWith(
        "/proveedores?filtro=Emergencias",
        "tok"
      );
    });

    it("si fetchAPI falla devuelve array vacío", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error("500"));
      const res = await obtenerProveedores();
      expect(res).toEqual([]);
    });
  });

  describe("obtenerProveedorDetalle", () => {
    it("sin token devuelve null", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await obtenerProveedorDetalle("1");
      expect(res).toBeNull();
    });

    it("con token consulta /proveedores/:id y mapea los datos", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        id_Proveedor: 2,
        cuitCuil: "27254443334",
        razonSocial: "Dra. Marcela González",
        prestacion: "Clínica",
        estado: "ACTIVO",
        fechaNacimiento: "1978-09-20",
        ciudad: "Roldán",
        calle: "San Martín",
        altura: 420,
        telefonos: ["3413456789"],
        emails: ["marcela@gmail.com"],
      });

      const res = await obtenerProveedorDetalle("2");
      expect(res).not.toBeNull();
      expect(res?.id).toBe("2");
      expect(res?.razonSocial).toBe("Dra. Marcela González");
      expect(res?.ciudad).toBe("Roldán");
      expect(fetchAPI).toHaveBeenCalledWith("/proveedores/2", "tok");
    });
  });

  describe("crearProveedor", () => {
    const data = {
      cuitCuil: "30712345678",
      razonSocial: "Emergencias S.A.",
      prestacion: "Ambulancias",
      fechaNacimiento: "2010-01-01",
      ciudad: "Rosario",
      calle: "Córdoba",
      altura: "1500",
      telefonos: ["3414000000"],
      correos: ["contacto@emergencias.com"],
    };

    it("con token hace POST a /proveedores/crear", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ idProveedor: 10 });

      const res = await crearProveedor(data);
      expect(res).toEqual({ idProveedor: 10 });
      expect(fetchAPI).toHaveBeenCalledWith(
        "/proveedores/crear",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"razonSocial":"Emergencias S.A."'),
        })
      );
    });

    it("sin token no llama a fetchAPI", async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });
      const res = await crearProveedor(data);
      expect(res).toBeNull();
      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe("actualizarProveedor", () => {
    const data = {
      cuitCuil: "30712345678",
      razonSocial: "Emergencias S.A. Editado",
      prestacion: "Ambulancias 24hs",
      fechaNacimiento: "2010-01-01",
      ciudad: "Rosario",
      calle: "Córdoba",
      altura: "1500",
      telefonos: ["3414000000"],
      correos: [],
    };

    it("con token hace PUT a /proveedores/modificar", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      await actualizarProveedor("5", data);

      expect(fetchAPI).toHaveBeenCalledWith(
        "/proveedores/modificar",
        "tok",
        expect.objectContaining({
          method: "PUT",
          body: expect.stringContaining('"id_Proveedor":5'),
        })
      );
    });
  });

  describe("darDeBajaProveedor y reactivarProveedor", () => {
    it("darDeBajaProveedor hace POST a /proveedores/baja", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "ok" });

      const ok = await darDeBajaProveedor("3");
      expect(ok).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/proveedores/baja",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ idProveedor: 3 }),
        })
      );
    });

    it("reactivarProveedor hace POST a /proveedores/reactivar", async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ mensaje: "ok" });

      const ok = await reactivarProveedor("3");
      expect(ok).toBe(true);
      expect(fetchAPI).toHaveBeenCalledWith(
        "/proveedores/reactivar",
        "tok",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ idProveedor: 3 }),
        })
      );
    });
  });
});
