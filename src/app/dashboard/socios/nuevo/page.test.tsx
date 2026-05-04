import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NuevoSocioPage from './page';

const mockGuardarSocio = jest.fn();
jest.mock('./actions', () => ({
  guardarSocio: (...args: unknown[]) => mockGuardarSocio(...args),
}));


describe('Módulo de Socios - Registro (Comportamiento)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('debe ejecutar la acción de guardado al completar el formulario', async () => {
    render(<NuevoSocioPage />);

    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    await userEvent.type(screen.getByLabelText(/dni/i), '12345678');
    await userEvent.type(screen.getByLabelText(/fecha de nacimiento/i), '1990-01-01');
    await userEvent.type(screen.getByLabelText(/ciudad/i), 'Buenos Aires');
    await userEvent.type(screen.getByLabelText(/calle/i), 'Falsa');
    await userEvent.type(screen.getByLabelText(/altura/i), '123');
    await userEvent.type(screen.getByLabelText(/fecha de alta/i), '2024-01-01');
    await userEvent.type(screen.getByLabelText(/plan/i), 'A');
    await userEvent.type(screen.getByLabelText(/cobrador/i), 'C1');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '12345678');
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');

    fireEvent.click(screen.getByRole('button', { name: /guardar socio/i }));

    await waitFor(() => {
      expect(mockGuardarSocio).toHaveBeenCalled();
    });
  });

  it('debe mostrar errores de validación y no guardar si el formulario está vacío', async () => {
    render(<NuevoSocioPage />);

    fireEvent.click(screen.getByRole('button', { name: /guardar socio/i }));

    await waitFor(() => {
      expect(mockGuardarSocio).not.toHaveBeenCalled();

      expect(screen.getByText(/el nombre debe tener al menos 2 letras/i)).toBeInTheDocument();
      expect(screen.getByText(/la ciudad es obligatoria/i)).toBeInTheDocument();
    });
  });
});

