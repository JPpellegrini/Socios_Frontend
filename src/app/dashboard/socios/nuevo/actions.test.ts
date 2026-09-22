import { guardarSocio, actualizarSocio, buscarSocioPorDocumento, crearCodeudor } from './actions';

jest.mock('../../../../lib/apiClient', () => ({
  fetchAPI: jest.fn(),
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { fetchAPI } from '../../../../lib/apiClient';
import { cookies } from 'next/headers';

const datosSocio = {
  nroDocumento: '12345678',
  nombre: 'Juan',
  apellido: 'Pérez',
  fechaNacimiento: '1990-01-01',
  sexo: 'Hombre',
  ciudad: 'Buenos Aires',
  calle: 'Falsa',
  altura: '123',
  fechaAlta: '2024-01-01',
  plan: 'A',
  cobrador: 'NO',
};

describe('Acciones del Servidor para Nuevo Socio (API real)', () => {
  const originalEnv = process.env.ENV;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.ENV = 'stg';
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
  });

  describe('buscarSocioPorDocumento', () => {
    it('con token debe consultar /buscarentidad con DNI', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({
        id_Entidad: 1,
        cuitCuil: '20123456789',
        nombre: 'Juan',
        apellido: 'Pérez',
        nacimiento: '1990-01-01',
        sexo: 'Hombre',
        ciudad: { id_Ciudad: 1, nombre: 'Buenos Aires' },
        calle: 'Falsa',
        altura: 123,
      });

      const socio = await buscarSocioPorDocumento('12345678');

      expect(socio).not.toBeNull();
      expect(socio?.nombre).toBe('Juan');
      expect(socio?.apellido).toBe('Pérez');
      expect(socio?.ciudad).toBe('Buenos Aires');
      expect(fetchAPI).toHaveBeenCalledWith(
        '/buscarentidad',
        'tok',
        expect.objectContaining({
          method: 'GET',
          body: JSON.stringify({ dni: '12345678' }),
        })
      );
    });

    it('sin token debe devolver null sin llamar a la API', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

      const socio = await buscarSocioPorDocumento('12345678');

      expect(socio).toBeNull();
      expect(fetchAPI).not.toHaveBeenCalled();
    });

    it('si la API falla debe devolver null', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error('404'));

      await expect(buscarSocioPorDocumento('99999999')).resolves.toBeNull();
    });
  });

  describe('guardarSocio', () => {
    it('con token debe hacer POST a /socios/crear con el payload adaptado', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });

      await guardarSocio(datosSocio);

      expect(fetchAPI).toHaveBeenCalledWith(
        '/socios/crear',
        'tok',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"dni":"12345678"'),
        })
      );
    });

    it('sin token no debe llamar a la API', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

      await guardarSocio(datosSocio);

      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe('actualizarSocio', () => {
    it('con token debe hacer PUT a /socios/modificar con el body adecuado', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });

      await actualizarSocio('5', datosSocio);

      expect(fetchAPI).toHaveBeenCalledWith(
        '/socios/modificar',
        'tok',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"idSocio":5'),
        })
      );
    });

    it('propaga el error si el backend falla', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockRejectedValue(new Error('network'));

      await expect(actualizarSocio('5', datosSocio)).rejects.toThrow('network');
    });
  });

  describe('crearCodeudor', () => {
    const codeudorData = {
      dni: '30111222',
      nombre: 'María',
      apellido: 'Gómez',
      fechaNacimiento: '1985-05-15',
      sexo: 'Mujer',
      ciudad: 'Rosario',
      calle: 'Mitre',
      altura: '450',
      telefonos: ['3415551234'],
      correos: ['maria@test.com'],
    };

    it('con token debe hacer POST a /codeudores/crear y devolver { idEntidad }', async () => {
      (cookies as jest.Mock).mockResolvedValue({
        get: (n: string) => (n === 'authToken' ? { value: 'tok' } : undefined),
      });
      (fetchAPI as jest.Mock).mockResolvedValue({ idEntidad: 15 });

      const res = await crearCodeudor(codeudorData);

      expect(res).toEqual({ idEntidad: 15 });
      expect(fetchAPI).toHaveBeenCalledWith(
        '/codeudores/crear',
        'tok',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"dni":"30111222"'),
        })
      );
    });

    it('sin token debe devolver null sin llamar a la API', async () => {
      (cookies as jest.Mock).mockResolvedValue({ get: () => undefined });

      const res = await crearCodeudor(codeudorData);

      expect(res).toBeNull();
      expect(fetchAPI).not.toHaveBeenCalled();
    });
  });
});

