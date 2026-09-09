import { obtenerNichos } from "./actions";

jest.mock("../../../lib/apiClient", () => ({
  fetchAPI: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from "../../../lib/apiClient";
import { cookies } from "next/headers";

describe("Nichos Server Actions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("sin token devuelve array vacío sin llamar a la API", async () => {
    (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

    const res = await obtenerNichos();
    expect(res).toEqual([]);
    expect(fetchAPI).not.toHaveBeenCalled();
  });

  it("con token consulta /nichos/buscar y mapea los nichos correctamente", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
    });
    (fetchAPI as jest.Mock).mockResolvedValue([
      {
        id_Nicho: 1,
        nroNicho: 45,
        sector: "A",
        ocupado: true,
        valorNicho: 50000,
        valorLapida: 15000,
        cuotas: 12,
        interes: 0.05,
        socio: {
          id_Socio: 1,
          nombre: "Luciano",
          apellido: "Oldan",
        },
      },
      {
        id_Nicho: 2,
        nroNicho: 46,
        sector: "A",
        ocupado: false,
        valorNicho: 50000,
        valorLapida: 15000,
        cuotas: 12,
        interes: 0.05,
        socio: null,
      },
    ]);

    const res = await obtenerNichos({ nombre: "Luciano" });

    expect(res).toHaveLength(2);
    expect(res[0]?.id).toBe("1");
    expect(res[0]?.nroNicho).toBe(45);
    expect(res[0]?.sector).toBe("A");
    expect(res[0]?.ocupado).toBe(true);
    expect(res[0]?.socio?.nombre).toBe("Luciano");
    expect(res[1]?.ocupado).toBe(false);
    expect(res[1]?.socio).toBeNull();
    expect(fetchAPI).toHaveBeenCalledWith("/nichos/buscar?nombre=Luciano", "tok");
  });

  it("si la API arroja un error devuelve array vacío sin explotar", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: (name: string) => (name === "authToken" ? { value: "tok" } : undefined),
    });
    (fetchAPI as jest.Mock).mockRejectedValue(new Error("500 Server Error"));

    const res = await obtenerNichos();
    expect(res).toEqual([]);
  });
});
