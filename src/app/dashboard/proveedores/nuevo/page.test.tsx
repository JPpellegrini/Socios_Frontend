import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NuevoProveedorPage from "./page";
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
  buscarProveedorPorDocumento: jest.fn(),
}));

describe("NuevoProveedorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("debe renderizar el campo de búsqueda inicial de CUIT/CUIL/DNI", () => {
    render(<NuevoProveedorPage />);

    expect(screen.getByText("Nuevo proveedor")).toBeInTheDocument();
    expect(screen.getByLabelText(/CUIT \/ CUIL \/ DNI/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancelar")).toBeInTheDocument();
  });

  it("debe validar formato de documento al buscar", async () => {
    render(<NuevoProveedorPage />);

    const searchBtn = screen.getByLabelText("Buscar");
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/Debe ser un DNI o CUIT\/CUIL válido/i)).toBeInTheDocument();
    });
  });

  it("debe verificar documento y permitir completar el formulario y crear el proveedor", async () => {
    (actions.buscarProveedorPorDocumento as jest.Mock).mockResolvedValue(null);
    (actions.crearProveedor as jest.Mock).mockResolvedValue({ idProveedor: 10 });

    render(<NuevoProveedorPage />);

    // Paso 1: Ingresar CUIT y verificar
    fireEvent.change(screen.getByLabelText(/CUIT \/ CUIL \/ DNI/i), {
      target: { value: "30712345678" },
    });
    fireEvent.click(screen.getByLabelText("Buscar"));

    // Paso 2: Se despliegan los campos del formulario
    await waitFor(() => {
      expect(screen.getByLabelText(/Razón Social \/ Nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Prestación \/ Especialidad \/ Servicio/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Razón Social \/ Nombre/i), {
      target: { value: "Emergencias Médicas S.A." },
    });
    fireEvent.change(screen.getByLabelText(/Prestación \/ Especialidad \/ Servicio/i), {
      target: { value: "Ambulancia" },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de inicio \/ nacimiento/i), {
      target: { value: "2010-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Calle/i), {
      target: { value: "Córdoba" },
    });
    fireEvent.change(screen.getByLabelText(/Altura/i), {
      target: { value: "1540" },
    });

    // Seleccionar ciudad
    const selectCiudadBtn = screen.getByRole("button", { name: /Seleccionar/i });
    fireEvent.click(selectCiudadBtn);
    const elegirBtns = screen.getAllByRole("button", { name: /Elegir/i });
    if (elegirBtns.length > 0 && elegirBtns[0]) {
      fireEvent.click(elegirBtns[0]);
    }

    // Agregar teléfono
    const telInput = screen.getByLabelText("Teléfono");
    fireEvent.change(telInput, { target: { value: "3414201000" } });
    const agregarTelBtn = screen.getAllByRole("button", { name: /Agregar/i })[0];
    if (agregarTelBtn) {
      fireEvent.click(agregarTelBtn);
    }

    // Grabar
    const submitBtn = screen.getByRole("button", { name: /Grabar/i });
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

    render(<NuevoProveedorPage />);

    await waitFor(() => {
      expect(screen.getByText("Editar proveedor")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Emergencias Médicas S.A.")).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /Grabar/i });
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
