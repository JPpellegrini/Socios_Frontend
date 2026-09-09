import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProveedorDetallePage from "./page";
import * as actions from "../actions";

const mockPush = jest.fn();
let mockParams = { id: "1" };

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => mockParams,
}));

jest.mock("../actions", () => ({
  obtenerProveedorDetalle: jest.fn(),
}));

const mockDetalle = {
  id: "1",
  cuitCuil: "30712345678",
  razonSocial: "Emergencias Médicas S.A.",
  prestacion: "Servicio de ambulancia",
  estado: "Activo" as const,
  fechaNacimiento: "2010-03-15",
  ciudad: "Rosario",
  calle: "Córdoba",
  altura: "1540",
  observaciones: "Convenio vigente",
  telefonos: ["3414201000"],
  emails: ["guardia@emergencias.com"],
};

describe("ProveedorDetallePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "1" };
  });

  it("debe renderizar el detalle del proveedor correctamente", async () => {
    (actions.obtenerProveedorDetalle as jest.Mock).mockResolvedValue(mockDetalle);

    render(<ProveedorDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Emergencias Médicas S.A.")).toBeInTheDocument();
      expect(screen.getByText("CUIT/CUIL: 30712345678")).toBeInTheDocument();
      expect(screen.getByText("Servicio de ambulancia")).toBeInTheDocument();
      expect(screen.getByText("Rosario")).toBeInTheDocument();
      expect(screen.getByText("Córdoba 1540")).toBeInTheDocument();
      expect(screen.getByText("3414201000")).toBeInTheDocument();
      expect(screen.getByText("guardia@emergencias.com")).toBeInTheDocument();
      expect(screen.getByText("Convenio vigente")).toBeInTheDocument();
    });
  });

  it("debe mostrar mensaje cuando el proveedor no existe", async () => {
    (actions.obtenerProveedorDetalle as jest.Mock).mockResolvedValue(null);

    render(<ProveedorDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Proveedor no encontrado")).toBeInTheDocument();
    });
  });

  it("debe navegar a la edición al presionar Editar Proveedor", async () => {
    (actions.obtenerProveedorDetalle as jest.Mock).mockResolvedValue(mockDetalle);

    render(<ProveedorDetallePage />);

    await waitFor(() => {
      expect(screen.getByText("Emergencias Médicas S.A.")).toBeInTheDocument();
    });

    const editBtn = screen.getByRole("button", { name: /Editar Proveedor/i });
    fireEvent.click(editBtn);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/proveedores/nuevo?edit=1");
  });
});
