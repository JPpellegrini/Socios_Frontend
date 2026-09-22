import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NichosPage from "./page";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  obtenerNichos: jest.fn(),
}));

const mockNichosData = [
  {
    id: "1",
    nroNicho: 45,
    sector: "A",
    ocupado: true,
    valorNicho: 50000,
    valorLapida: 15000,
    cuotas: 12,
    interes: 0.05,
    socio: {
      id: "1",
      nombre: "Luciano",
      apellido: "Oldan",
    },
  },
  {
    id: "2",
    nroNicho: 46,
    sector: "B",
    ocupado: false,
    valorNicho: 50000,
    valorLapida: 15000,
    cuotas: 12,
    interes: 0.05,
    socio: null,
  },
];

describe("NichosPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar y renderizar las métricas y la tabla de nichos", async () => {
    (actions.obtenerNichos as jest.Mock).mockResolvedValue(mockNichosData);

    render(<NichosPage />);

    expect(screen.getByText("Nichos y Panteón")).toBeInTheDocument();

    await waitFor(() => {
      // Métricas
      expect(screen.getByText("Total de Nichos")).toBeInTheDocument();
      expect(screen.getByText("Ocupados / Concesionados")).toBeInTheDocument();
      expect(screen.getByText("Disponibles")).toBeInTheDocument();

      // Filas
      expect(screen.getByText("Sector A")).toBeInTheDocument();
      expect(screen.getByText("Sector B")).toBeInTheDocument();
      expect(screen.getByText("#45")).toBeInTheDocument();
      expect(screen.getByText("#46")).toBeInTheDocument();
      expect(screen.getByText("Ocupado")).toBeInTheDocument();
      expect(screen.getByText("Disponible")).toBeInTheDocument();
      expect(screen.getByText("Oldan, Luciano")).toBeInTheDocument();
      expect(screen.getByText("Sin asignar")).toBeInTheDocument();
    });
  });

  it("debe mostrar mensaje cuando no hay nichos cargados", async () => {
    (actions.obtenerNichos as jest.Mock).mockResolvedValue([]);

    render(<NichosPage />);

    await waitFor(() => {
      expect(screen.getByText("No se encontraron nichos")).toBeInTheDocument();
    });
  });
});
