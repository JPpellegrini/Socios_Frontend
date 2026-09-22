import React from 'react';
import { render } from '@testing-library/react';
import { useUsuariosService, UsuariosServiceProvider } from './service-context';

function Consumer() {
  useUsuariosService();
  return null;
}

describe('useUsuariosService', () => {
  it('lanza si se usa fuera de <UsuariosServiceProvider>', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/UsuariosServiceProvider/);
    spy.mockRestore();
  });

  it('dentro del provider expone un servicio construido a partir del flag', () => {
    const { unmount } = render(
      <UsuariosServiceProvider mockMode={true}>
        <Consumer />
      </UsuariosServiceProvider>
    );
    unmount();
  });
});
