import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AsignarNichoDialog } from "./asignar-nicho-dialog";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  buscarSociosAsignablesNicho: jest.fn(),
  asignarNicho: jest.fn(),
  simularCuotasNicho: jest.fn(),
}));

const mockNicho = {
  id: "2",
  nroNicho: "46",
  sector: "A",
  ocupado: false,
  conLapida: false,
  valorNicho: 50000,
  valorLapida: 0,
  cuotas: 0,
  interes: 0,
  socio: null,
};

const mockSocios = [
  {
    idSocio: 1,
    idEntidad: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
  },
];

describe("AsignarNichoDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (actions.buscarSociosAsignablesNicho as jest.Mock).mockResolvedValue(mockSocios);
  });

  it("renderiza y lista socios elegibles", async () => {
    render(
      <AsignarNichoDialog
        open={true}
        nicho={mockNicho}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Asignar Nicho #46/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Pérez, Juan")).toBeInTheDocument();
      expect(screen.getByText("DNI: 12345678")).toBeInTheDocument();
    });
  });

  it("usa valores por defecto (1 cuota, 0% interés), muestra resumen previo y asigna nicho", async () => {
    (actions.simularCuotasNicho as jest.Mock).mockResolvedValue({
      success: true,
      simulacion: {
        totalAFinanciar: 50000,
        interesPorCuota: 0,
        cantidadCuotas: 1,
        montoCuota: 50000,
        totalAPagar: 50000,
        cuotas: [],
      },
    });
    (actions.asignarNicho as jest.Mock).mockResolvedValue({
      success: true,
      mensaje: "Asignado",
    });

    render(
      <AsignarNichoDialog
        open={true}
        nicho={mockNicho}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByLabelText("Cuotas")).toHaveValue(1);
    expect(screen.getByLabelText("Interés Mensual (%)")).toHaveValue(0);

    await waitFor(() => {
      expect(screen.getByText("Pérez, Juan")).toBeInTheDocument();
    });

    // Seleccionar socio
    fireEvent.click(screen.getByText("Pérez, Juan"));

    await waitFor(() => {
      expect(screen.getByText("Cambiar")).toBeInTheDocument();
    });

    // Paso 1 -> Revisar Resumen
    fireEvent.click(screen.getByRole("button", { name: /Revisar Resumen/i }));

    await waitFor(() => {
      expect(actions.simularCuotasNicho).toHaveBeenCalled();
      expect(screen.getByText(/Confirmar Asignación — Nicho #46/i)).toBeInTheDocument();
      expect(screen.getByText(/Valor de cada cuota \(con interés\)/i)).toBeInTheDocument();
    });

    // Paso 2 -> Confirmar Asignación
    fireEvent.click(screen.getByRole("button", { name: /Confirmar Asignación/i }));

    await waitFor(() => {
      expect(actions.asignarNicho).toHaveBeenCalledWith(
        expect.objectContaining({
          idNicho: 2,
          idEntidad: 1,
          valorTotal: 50000,
          cuotas: 1,
          interesPorCuota: 0,
          conLapida: "NO",
          valorLapida: 0,
        })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("muestra error si se intenta enviar sin seleccionar socio", async () => {
    render(
      <AsignarNichoDialog
        open={true}
        nicho={mockNicho}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Revisar Resumen/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Debe seleccionar un socio activo titular.")).toBeInTheDocument();
    });
  });
});
