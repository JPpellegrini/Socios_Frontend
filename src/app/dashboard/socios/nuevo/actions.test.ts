import { guardarSocio, buscarSocioPorDocumento } from './actions';
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
global.fetch = jest.fn();

describe('Acciones del Servidor para Nuevo Socio', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('buscarSocioPorDocumento', () => {
    it('debe encontrar un socio existente en la base de datos mock', async () => {
      const socio = await buscarSocioPorDocumento('DNI', '12345678');
      expect(socio).not.toBeNull();
      expect(socio?.nombre).toBe('Juan');
      expect(socio?.apellido).toBe('Pérez');
    });

    it('debe devolver null si el socio no existe', async () => {
      const socio = await buscarSocioPorDocumento('DNI', '99999999');
      expect(socio).toBeNull();
    });
  });

  describe('guardarSocio', () => {
    it('debe enviar los datos al backend y redirigir a la lista', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      const datosSocio = {
        tipoDocumento: 'DNI' as const,
        nroDocumento: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-01-01',
        ciudad: 'Buenos Aires',
        calle: 'Falsa',
        altura: '123',
        fechaAlta: '2024-01-01',
        plan: 'A',
        cobrador: 'NO',
      };
      
      await guardarSocio(datosSocio);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/socios'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(datosSocio)
        })
      );
      
      expect(redirect).toHaveBeenCalledWith('/dashboard/socios');
    });
  });
});
