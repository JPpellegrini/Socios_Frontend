import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PrestacionesPage from "./page";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  obtenerPrestaciones: jest.fn(),
  crearPrestacion: jest.fn(),
  modificarPrestacion: jest.fn(),
  darDeBajaPrestacion: jest.fn(),
  reactivarPrestacion: jest.fn(),
}));

const mockPrestaciones = [
  {
    id: "1",
    idPrestacion: 1,
    nombre: "SERVICIO DE AMBULANCIA",
    tipo: "PRESTACION" as const,
    estado: "ACTIVA" as const,
  },
  {
    id: "2",
    idPrestacion: 2,
    nombre: "CARDIOLOGÍA",
    tipo: "COLABORACION" as const,
    estado: "INACTIVA" as const,
  },
];

describe("PrestacionesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (actions.obtenerPrestaciones as jest.Mock).mockResolvedValue(mockPrestaciones);
  });

  it("renderiza métricas, tabla y estilos de estado estándar", async () => {
    render(<PrestacionesPage />);

    expect(screen.getByText("Gestión de Prestaciones")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Total Prestaciones")).toBeInTheDocument();
      expect(screen.getByText("SERVICIO DE AMBULANCIA")).toBeInTheDocument();
      expect(screen.getByText("CARDIOLOGÍA")).toBeInTheDocument();
      const inactivaBadge = screen.getByText("Inactiva");
      expect(inactivaBadge).toHaveClass("bg-destructive text-white font-medium");
    });
  });

  it("permite crear una nueva prestación", async () => {
    (actions.crearPrestacion as jest.Mock).mockResolvedValue({
      success: true,
      prestacion: {
        id: "3",
        idPrestacion: 3,
        nombre: "KINESIOLOGÍA",
        tipo: "PRESTACION",
        estado: "ACTIVA",
      },
    });

    render(<PrestacionesPage />);

    await waitFor(() => {
      expect(screen.getByText("SERVICIO DE AMBULANCIA")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Nueva prestación/i }));
    expect(screen.getByText("Nueva Prestación")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Kinesiología" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Crear Prestación/i }));

    await waitFor(() => {
      expect(actions.crearPrestacion).toHaveBeenCalledWith({
        nombre: "Kinesiología",
        tipo: "PRESTACION",
      });
    });
  });

  it("permite editar una prestación existente", async () => {
    (actions.modificarPrestacion as jest.Mock).mockResolvedValue({ success: true });

    render(<PrestacionesPage />);

    await waitFor(() => {
      expect(screen.getByText("SERVICIO DE AMBULANCIA")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Editar prestación SERVICIO DE AMBULANCIA/i })
    );
    expect(screen.getByText("Editar Prestación")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ambulancia 24hs" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Guardar Cambios/i }));

    await waitFor(() => {
      expect(actions.modificarPrestacion).toHaveBeenCalledWith(1, {
        nombre: "Ambulancia 24hs",
        tipo: "PRESTACION",
      });
    });
  });

  it("permite dar de baja una prestación activa", async () => {
    (actions.darDeBajaPrestacion as jest.Mock).mockResolvedValue({ success: true });

    render(<PrestacionesPage />);

    await waitFor(() => {
      expect(screen.getByText("SERVICIO DE AMBULANCIA")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Dar de baja prestación SERVICIO DE AMBULANCIA/i })
    );
    expect(screen.getByText("Dar de baja prestación")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Dar de baja$/i }));

    await waitFor(() => {
      expect(actions.darDeBajaPrestacion).toHaveBeenCalledWith(1);
    });
  });

  it("permite reactivar una prestación inactiva", async () => {
    (actions.reactivarPrestacion as jest.Mock).mockResolvedValue({ success: true });

    render(<PrestacionesPage />);

    await waitFor(() => {
      expect(screen.getByText("CARDIOLOGÍA")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Reactivar prestación CARDIOLOGÍA/i })
    );
    expect(screen.getByText("Reactivar prestación")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Reactivar$/i }));

    await waitFor(() => {
      expect(actions.reactivarPrestacion).toHaveBeenCalledWith(2);
    });
  });
});
