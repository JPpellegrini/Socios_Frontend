import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProveedorFormPage from "./page";
import * as actions from "../actions";

const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock("../actions", () => ({
  obtenerProveedorDetalle: jest.fn(),
  crearProveedor: jest.fn(),
  actualizarProveedor: jest.fn(),
}));

describe("ProveedorFormPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("debe renderizar el formulario en modo de alta", () => {
    render(<ProveedorFormPage />);

    expect(screen.getByText("Nuevo Proveedor")).toBeInTheDocument();
    expect(screen.getByLabelText(/CUIT \/ CUIL \/ DNI/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Razón Social \/ Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prestación \/ Especialidad \/ Servicio/i)).toBeInTheDocument();
  });

  it("debe validar campos obligatorios al intentar enviar vacío", async () => {
    render(<ProveedorFormPage />);

    const submitBtn = screen.getByRole("button", { name: /Crear Proveedor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Debe ser un DNI o CUIT\/CUIL válido/i)).toBeInTheDocument();
      expect(screen.getByText(/La razón social debe tener al menos 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it("debe crear un proveedor exitosamente", async () => {
    (actions.crearProveedor as jest.Mock).mockResolvedValue({ idProveedor: 10 });

    render(<ProveedorFormPage />);

    fireEvent.change(screen.getByLabelText(/CUIT \/ CUIL \/ DNI/i), { target: { value: "30712345678" } });
    fireEvent.change(screen.getByLabelText(/Razón Social \/ Nombre/i), { target: { value: "Emergencias Médicas S.A." } });
    fireEvent.change(screen.getByLabelText(/Prestación \/ Especialidad \/ Servicio/i), { target: { value: "Ambulancia" } });
    fireEvent.change(screen.getByLabelText(/Fecha inicio \/ nacimiento/i), { target: { value: "2010-01-01" } });
    fireEvent.change(screen.getByLabelText(/Calle/i), { target: { value: "Córdoba" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1540" } });

    // Seleccionar ciudad
    const selectCiudadBtn = screen.getByRole("button", { name: /Seleccionar/i });
    fireEvent.click(selectCiudadBtn);
    const elegirBtns = screen.getAllByRole("button", { name: /Elegir/i });
    if (elegirBtns.length > 0 && elegirBtns[0]) {
      fireEvent.click(elegirBtns[0]);
    }

    // Agregar teléfono
    const telInput = screen.getByLabelText(/Teléfono \(al menos uno requerido\)/i);
    fireEvent.change(telInput, { target: { value: "3414201000" } });
    const agregarTelBtn = screen.getAllByRole("button", { name: /Agregar/i })[0];
    if (agregarTelBtn) {
      fireEvent.click(agregarTelBtn);
    }

    const submitBtn = screen.getByRole("button", { name: /Crear Proveedor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.crearProveedor).toHaveBeenCalledWith(
        expect.objectContaining({
          cuitCuil: "30712345678",
          razonSocial: "Emergencias Médicas S.A.",
          prestacion: "Ambulancia",
        })
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard/proveedores");
    });
  });

  it("debe cargar datos en modo edición y actualizar proveedor", async () => {
    mockSearchParams = new URLSearchParams("edit=1");
    (actions.obtenerProveedorDetalle as jest.Mock).mockResolvedValue({
      id: "1",
      cuitCuil: "30712345678",
      razonSocial: "Emergencias Médicas S.A.",
      prestacion: "Ambulancia y traslados",
      estado: "Activo",
      fechaNacimiento: "2010-03-15",
      ciudad: "Rosario",
      calle: "Córdoba",
      altura: "1540",
      observaciones: "Convenio",
      telefonos: ["3414201000"],
      emails: ["guardia@emergencias.com"],
    });
    (actions.actualizarProveedor as jest.Mock).mockResolvedValue(undefined);

    render(<ProveedorFormPage />);

    await waitFor(() => {
      expect(screen.getByText("Editar Proveedor")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Emergencias Médicas S.A.")).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /Actualizar Proveedor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.actualizarProveedor).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          cuitCuil: "30712345678",
          razonSocial: "Emergencias Médicas S.A.",
        })
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard/proveedores");
    });
  });
});
