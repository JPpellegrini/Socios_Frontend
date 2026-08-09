import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import NuevoUsuarioPage from "./page"
import { UsuariosServiceProvider, type UsuariosService } from "@/lib/usuarios/service-context"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

function makeFakeService(overrides: Partial<UsuariosService> = {}): UsuariosService {
  return {
    list: jest.fn(),
    create: jest.fn().mockResolvedValue({
      id_Usuario: 10,
      usuario: "testuser",
      rol: "ADMINISTRADOR",
      estado: "ACTIVO",
    }),
    updateRol: jest.fn(),
    updatePassword: jest.fn(),
    toggleEstado: jest.fn(),
    ...overrides,
  }
}

function renderPage(service: UsuariosService) {
  return render(
    <UsuariosServiceProvider mockMode={false} service={service}>
      <NuevoUsuarioPage />
    </UsuariosServiceProvider>
  )
}

describe("Pantalla Nuevo Usuario - Formulario de Registro", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renderiza el formulario de alta de usuario correctamente", () => {
    renderPage(makeFakeService())

    expect(screen.getByRole("heading", { name: /nuevo usuario/i })).toBeInTheDocument()

    expect(screen.getByLabelText(/^usuario$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nueva password/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/confirmar password/i)).toBeInTheDocument()
  })

  it("muestra errores de validación si los campos requeridos están vacíos", async () => {
    renderPage(makeFakeService())

    const submitBtn = screen.getByRole("button", { name: /grabar/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/el nombre de usuario es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument()
    })
  })

  it("navega de regreso a /dashboard/usuarios al presionar Cancelar", () => {
    renderPage(makeFakeService())

    const cancelBtn = screen.getByRole("button", { name: /cancelar/i })
    fireEvent.click(cancelBtn)

    expect(mockPush).toHaveBeenCalledWith("/dashboard/usuarios")
  })

  it("crea un usuario válido y redirige al listado /dashboard/usuarios", async () => {
    const service = makeFakeService()
    renderPage(service)

    const userInput = screen.getByLabelText(/^usuario$/i)
    fireEvent.change(userInput, { target: { value: "UsuarioNuevo" } })

    const passInput = screen.getByLabelText(/nueva password/i)
    fireEvent.change(passInput, { target: { value: "ClaveValida#123" } })

    const confirmInput = screen.getByLabelText(/confirmar password/i)
    fireEvent.change(confirmInput, { target: { value: "ClaveValida#123" } })

    const submitBtn = screen.getByRole("button", { name: /grabar/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(service.create).toHaveBeenCalledWith({
        usuario: "UsuarioNuevo",
        rol: "SECRETARIA/O",
        password: "ClaveValida#123",
        confirmPassword: "ClaveValida#123",
      })
      expect(mockPush).toHaveBeenCalledWith("/dashboard/usuarios")
    })
  })

})
