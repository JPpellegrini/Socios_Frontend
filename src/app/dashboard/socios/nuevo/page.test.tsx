import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NuevoSocioPage from './page';
import * as React from 'react';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockGuardarSocio = jest.fn();
const mockBuscarSocioPorDocumento = jest.fn();

jest.mock('./actions', () => ({
  guardarSocio: (...args: unknown[]) => mockGuardarSocio(...args),
  buscarSocioPorDocumento: (...args: unknown[]) => mockBuscarSocioPorDocumento(...args),
}));

interface MockSelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
}

interface MockSelectTriggerProps {
  children: React.ReactNode;
  label?: string;
  id?: string;
  disabled?: boolean;
}

jest.mock('../../../../components/ui/select', () => ({
  Select: ({ children, onValueChange }: MockSelectProps) => {
    const triggerProps = (children as React.ReactElement<MockSelectTriggerProps>)?.props;
    const triggerLabel = triggerProps?.label || '';
    return (
      <div
        data-testid={`mock-select-${triggerLabel}`}
        onClick={() => {
          if (onValueChange) {
            if (/tipo/i.test(triggerLabel) || /documento/i.test(triggerLabel)) {
              onValueChange('DNI');
            } else if (/sepelio/i.test(triggerLabel) || /cobrador/i.test(triggerLabel)) {
              onValueChange('SI');
            } else {
              onValueChange('A');
            }
          }
        }}
      >
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children, label, id, disabled }: MockSelectTriggerProps) => (
    <button type="button" id={id} aria-label={label} disabled={disabled}>{children}</button>
  ),
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
}));

jest.mock('../../../../components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dialog">{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogClose: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Módulo de Socios - Registro (Comportamiento)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe pedir primero el documento, verificar que no existe y permitir guardar el nuevo socio', async () => {
    mockBuscarSocioPorDocumento.mockResolvedValue(null);

    render(<NuevoSocioPage />);

    expect(screen.queryByLabelText(/^nombre$/i)).not.toBeInTheDocument();

    const inputDocumento = screen.getByLabelText(/^documento$/i);
    await userEvent.type(inputDocumento, '12345678');

    const buscarBtn = screen.getByRole('button', { name: /^buscar$/i });
    fireEvent.click(buscarBtn);

    await waitFor(() => {
      expect(mockBuscarSocioPorDocumento).toHaveBeenCalledWith('DNI', '12345678');
      expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/^nombre$/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: '1990-01-01' } });
    await userEvent.type(screen.getByLabelText(/ciudad/i), 'Buenos Aires');
    await userEvent.type(screen.getByLabelText(/calle/i), 'Falsa');
    await userEvent.type(screen.getByLabelText(/altura/i), '123');
    fireEvent.change(screen.getByLabelText(/fecha de alta/i), { target: { value: '2024-01-01' } });
    
    fireEvent.click(screen.getByLabelText(/plan/i));
    fireEvent.click(screen.getByLabelText(/cobrador/i));
    
    await userEvent.type((await screen.findAllByLabelText(/teléfono/i))[0], '12345678');
    const agregarButtons = screen.getAllByRole('button', { name: /agregar/i });
    await userEvent.click(agregarButtons[0]);

    await userEvent.type((await screen.findAllByLabelText(/correo electrónico/i))[0], 'test@example.com');
    await userEvent.click(agregarButtons[1]);

    const grabarBtn = await screen.findByRole('button', { name: /grabar/i });
    fireEvent.click(grabarBtn);

    await waitFor(() => {
      expect(mockGuardarSocio).toHaveBeenCalledWith(expect.objectContaining({
        tipoDocumento: 'DNI',
        nroDocumento: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefonos: ['12345678'],
        correos: ['test@example.com']
      }));
    });
  }, 15000);

  it('debe autocompletar el formulario si encuentra el socio con el documento ingresado', async () => {
    const mockSocioExistente = {
      tipoDocumento: 'DNI',
      nroDocumento: '12345678',
      nombre: 'Carlos',
      apellido: 'González',
      fechaNacimiento: '1975-06-18',
      ciudad: 'Rosario',
      calle: 'Mitre',
      altura: '980',
      fechaAlta: '2023-01-10',
      obraSocial: 'OSDE',
      plan: 'A',
      sepelio: 'SI',
      cobrador: 'SI',
      telefonos: ['341500600'],
      correos: ['carlos@test.com'],
    };

    mockBuscarSocioPorDocumento.mockResolvedValue(mockSocioExistente);

    render(<NuevoSocioPage />);

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toHaveValue('Carlos');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('González');
      expect(screen.getByLabelText(/ciudad/i)).toHaveValue('Rosario');
    });

    const grabarBtn = screen.getByRole('button', { name: /grabar/i });
    fireEvent.click(grabarBtn);

    await waitFor(() => {
      expect(mockGuardarSocio).toHaveBeenCalledWith(expect.objectContaining({
        tipoDocumento: 'DNI',
        nroDocumento: '12345678',
        nombre: 'Carlos',
        apellido: 'González',
      }));
    });
  });

  it('debe colapsar el formulario y limpiar campos al presionar Buscar otro', async () => {
    const mockSocioExistente = {
      tipoDocumento: 'DNI',
      nroDocumento: '12345678',
      nombre: 'Carlos',
      apellido: 'González',
      fechaNacimiento: '1975-06-18',
      ciudad: 'Rosario',
      calle: 'Mitre',
      altura: '980',
      fechaAlta: '2023-01-10',
      obraSocial: 'OSDE',
      plan: 'A',
      sepelio: 'SI',
      cobrador: 'SI',
      telefonos: [],
      correos: [],
    };
    mockBuscarSocioPorDocumento.mockResolvedValue(mockSocioExistente);

    render(<NuevoSocioPage />);

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    });

    const buscarOtroBtn = screen.getByRole('button', { name: /buscar otro/i });
    fireEvent.click(buscarOtroBtn);

    expect(screen.queryByLabelText(/^nombre$/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^documento$/i)).toHaveValue('');
  });

  it('debe mostrar errores de validación y no guardar si el formulario está vacío tras búsqueda', async () => {
    mockBuscarSocioPorDocumento.mockResolvedValue(null);

    render(<NuevoSocioPage />);

    await userEvent.type(screen.getByLabelText(/^documento$/i), '12345678');
    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    });

    const grabarBtn = screen.getByRole('button', { name: /grabar/i });
    fireEvent.click(grabarBtn);

    await waitFor(() => {
      expect(mockGuardarSocio).not.toHaveBeenCalled();
      expect(screen.getByText(/el nombre debe tener al menos 2 letras/i)).toBeInTheDocument();
      expect(screen.getByText(/la ciudad es obligatoria/i)).toBeInTheDocument();
    });
  });

  it('debe navegar al listado al hacer clic en cancelar antes de buscar', async () => {
    render(<NuevoSocioPage />);
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/socios');
  });
});
