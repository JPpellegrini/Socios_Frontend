import { fetchAPI, isMockMode } from './apiClient';

global.fetch = jest.fn();

describe('fetchAPI HTTP Client', () => {
  const originalEnv = process.env.ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.ENV = originalEnv;
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  describe('modo develop (mocks)', () => {
    beforeEach(() => {
      process.env.ENV = 'develop';
    });

    it('no debe llamar a fetch y debe devolver el mock del endpoint', async () => {
      const me = await fetchAPI<{ usuarioNombre: string; rolNombre: string }>('/me');
      expect(global.fetch).not.toHaveBeenCalled();
      expect(me.usuarioNombre).toBe('CJR');
      expect(me.rolNombre).toBe('Consultor');
    });

    it('debe devolver el listado de socios mockeado', async () => {
      const socios = await fetchAPI<unknown[]>('/socios');
      expect(Array.isArray(socios)).toBe(true);
      expect(socios.length).toBeGreaterThan(0);
    });

    it('en proveedores/baja y reactivar debe mutar el estado en MOCK_PROVEEDORES', async () => {
      await fetchAPI('/proveedores/baja', undefined, {
        method: 'POST',
        body: JSON.stringify({ idProveedor: 1 }),
      });
      const provs = await fetchAPI<{ id_Proveedor: number; estado: string }[]>('/proveedores');
      const p1 = provs.find((p) => p.id_Proveedor === 1);
      expect(p1?.estado).toBe('Inactivo');

      await fetchAPI('/proveedores/reactivar', undefined, {
        method: 'POST',
        body: JSON.stringify({ idProveedor: 1 }),
      });
      const provs2 = await fetchAPI<{ id_Proveedor: number; estado: string }[]>('/proveedores');
      const p1Reactivado = provs2.find((p) => p.id_Proveedor === 1);
      expect(p1Reactivado?.estado).toBe('Activo');
    });
  });

  describe('rama no-develop (fetch mockeado, sin red)', () => {
    beforeEach(() => {
      process.env.ENV = 'stg';
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';
    });

    it('debe agregar el header Authorization si se provee un token en base64', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({ id: 1, name: 'Socio Test' }),
      });

      const fakeTokenBase64 = 'dXNlcjpwYXNzd29yZA==';
      await fetchAPI('/me', fakeTokenBase64);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/me',
        expect.objectContaining({
          headers: expect.any(Headers),
          cache: 'no-store',
        })
      );

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const headersPassed = callArgs[1].headers as Headers;
      expect(headersPassed.get('Authorization')).toBe(`Basic ${fakeTokenBase64}`);
    });

    it('debe parsear error de negocio (409) con campo mensaje', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ mensaje: 'El socio ya está dado de baja.' }),
      });

      await expect(fetchAPI('/socios/baja')).rejects.toThrow(
        'El socio ya está dado de baja.'
      );
    });

    it('debe parsear error de validacion ProblemDetails (400)', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          title: 'Validation error',
          errors: { Dni: ['El DNI debe tener 7 u 8 dígitos.'] },
        }),
      });

      await expect(fetchAPI('/socios/crear')).rejects.toThrow(
        /El DNI debe tener 7 u 8 dígitos/
      );
    });

    it('debe parsear error 404 de texto plano', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => 'Entidad no encontrada.',
      });

      await expect(fetchAPI('/buscarentidad')).rejects.toThrow(
        'Entidad no encontrada.'
      );
    });

    it('debe lanzar un error si NEXT_PUBLIC_API_URL no está definida', async () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      await expect(fetchAPI('/me')).rejects.toThrow(/NEXT_PUBLIC_API_URL/);
    });
  });

  describe('isMockMode', () => {
    it('debe ser true solo cuando ENV es develop', () => {
      process.env.ENV = 'develop';
      expect(isMockMode()).toBe(true);
      process.env.ENV = 'stg';
      expect(isMockMode()).toBe(false);
      process.env.ENV = 'prod';
      expect(isMockMode()).toBe(false);
    });
  });
});
