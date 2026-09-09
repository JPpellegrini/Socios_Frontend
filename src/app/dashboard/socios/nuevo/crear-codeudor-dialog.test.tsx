import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CrearCodeudorDialog } from "./crear-codeudor-dialog";
import * as actions from "./actions";

jest.mock("./actions", () => ({
  crearCodeudor: jest.fn(),
}));

describe("CrearCodeudorDialog Component", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnCodeudorCreado = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("no debe renderizar nada visible si open es false", () => {
    render(
      <CrearCodeudorDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onCodeudorCreado={mockOnCodeudorCreado}
      />
    );

    expect(screen.queryByText("Registrar Nuevo Codeudor")).not.toBeInTheDocument();
  });

  it("debe renderizar el título y campos si open es true", () => {
    render(
      <CrearCodeudorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onCodeudorCreado={mockOnCodeudorCreado}
      />
    );

    expect(screen.getByText("Registrar Nuevo Codeudor")).toBeInTheDocument();
    expect(screen.getByLabelText(/DNI/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
  });

  it("debe validar campos obligatorios y formato de DNI", async () => {
    render(
      <CrearCodeudorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onCodeudorCreado={mockOnCodeudorCreado}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Crear Codeudor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/El DNI debe tener 7 u 8 dígitos/i)).toBeInTheDocument();
    });
  });

  it("debe permitir agregar teléfonos y crear codeudor exitosamente", async () => {
    (actions.crearCodeudor as jest.Mock).mockResolvedValue({ idEntidad: 25 });

    render(
      <CrearCodeudorDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onCodeudorCreado={mockOnCodeudorCreado}
      />
    );

    // Llenar campos
    fireEvent.change(screen.getByLabelText(/DNI/i), { target: { value: "32127057" } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Carlos" } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: "1980-05-10" } });
    fireEvent.change(screen.getByLabelText(/Calle/i), { target: { value: "San Martín" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "123" } });

    // Seleccionar ciudad
    const selectCiudadBtn = screen.getByRole("button", { name: /Seleccionar/i });
    fireEvent.click(selectCiudadBtn);

    const elegirBtns = screen.getAllByRole("button", { name: /Elegir/i });
    if (elegirBtns.length > 0 && elegirBtns[0]) {
      fireEvent.click(elegirBtns[0]);
    }

    // Agregar teléfono
    const telInput = screen.getByLabelText(/Teléfono \(requerido\)/i);
    fireEvent.change(telInput, { target: { value: "3415551234" } });
    const agregarTelBtn = screen.getAllByRole("button", { name: /Agregar/i })[0];
    if (agregarTelBtn) {
      fireEvent.click(agregarTelBtn);
    }

    // Enviar formulario
    const submitBtn = screen.getByRole("button", { name: /Crear Codeudor/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.crearCodeudor).toHaveBeenCalled();
      expect(mockOnCodeudorCreado).toHaveBeenCalledWith({
        id: "25",
        nombre: "Carlos",
        apellido: "Pérez",
        nroDocumento: "32127057",
      });
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
