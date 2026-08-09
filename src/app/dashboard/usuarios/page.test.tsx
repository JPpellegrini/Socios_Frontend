import { render, screen, waitFor, within, fireEvent } from "@testing-library/react"
import UsuariosPage from "./page"
import { UsuariosServiceProvider, type UsuariosService } from "@/lib/usuarios/service-context"
import type { UsuarioListItem } from "@/lib/usuarios/types"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

const usuario1: UsuarioListItem = {
  id_Usuario: 1,
  usuario: "CJR",
  rol: "SECRETARIA/O",
  estado: "ACTIVO",
}

const usuario2: UsuarioListItem = {
  id_Usuario: 2,
  usuario: "JALVAREZ",
  rol: "SUPERVISOR/A",
  estado: "BAJA",
}

function makeFakeService(overrides: Partial<UsuariosService> = {}): UsuariosService {
  return {
    list: jest.fn().mockResolvedValue([usuario1, usuario2]),
    create: jest.fn(),
    updateRol: jest.fn().mockResolvedValue(true),
    updatePassword: jest.fn().mockResolvedValue(true),
    toggleEstado: jest.fn().mockResolvedValue(true),
    ...overrides,
  }
}

function renderPage(service: UsuariosService) {
  return render(
    <UsuariosServiceProvider mockMode={false} service={service}>
      <UsuariosPage />
    </UsuariosServiceProvider>
  )
}

describe("Pantalla Usuarios - Lista e Integración UI", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe tener un botón FAB (+) que enlace a la vista de registro /dashboard/usuarios/nuevo", () => {
    renderPage(makeFakeService())

    const fabLink = screen.getByRole("link", { name: /nuevo usuario/i })
    expect(fabLink).toBeInTheDocument()
    expect(fabLink).toHaveAttribute("href", "/dashboard/usuarios/nuevo")
  })

  it("debe cargar y renderizar el listado de usuarios correctamente", async () => {
    const service = makeFakeService()
    renderPage(service)

    expect(screen.getByRole("heading", { name: /listado de usuarios/i })).toBeInTheDocument()


    await waitFor(() => {
      expect(screen.getByText("CJR")).toBeInTheDocument()
      expect(screen.getByText("SECRETARIA/O")).toBeInTheDocument()
      expect(screen.getByText("JALVAREZ")).toBeInTheDocument()
      expect(screen.getByText("SUPERVISOR/A")).toBeInTheDocument()
    })
  })

  it("debe abrir el modal Modificar Rol y permitir guardar el nuevo rol", async () => {
    const service = makeFakeService()
    renderPage(service)

    await screen.findByText("CJR")
    const row = screen.getByText("CJR").closest("tr")!

    const cambiarRolBtn = within(row).getByRole("button", { name: /cambiar rol/i })
    fireEvent.click(cambiarRolBtn)

    expect(await screen.findByRole("heading", { name: /modificar rol/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue("CJR")).toBeInTheDocument()
  })

  it("debe abrir el modal Modificar Password y validar contraseñas", async () => {
    const service = makeFakeService()
    renderPage(service)

    await screen.findByText("CJR")
    const row = screen.getByText("CJR").closest("tr")!

    const cambiarPassBtn = within(row).getByRole("button", { name: /cambiar password/i })
    fireEvent.click(cambiarPassBtn)

    expect(await screen.findByRole("heading", { name: /modificar password/i })).toBeInTheDocument()

    const submitBtn = screen.getByRole("button", { name: /cambiar password/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument()
    })
  })

  it("debe solicitar confirmación al hacer clic en Baja Usuario y ejecutar el cambio de estado", async () => {
    const service = makeFakeService()
    renderPage(service)

    await screen.findByText("CJR")
    const row = screen.getByText("CJR").closest("tr")!

    const bajaBtn = within(row).getByRole("button", { name: /baja usuario/i })
    fireEvent.click(bajaBtn)

    expect(await screen.findByText("¿Dar de baja usuario?")).toBeInTheDocument()

    const confirmBtn = within(screen.getByRole("dialog")).getByRole("button", { name: /dar de baja/i })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(service.toggleEstado).toHaveBeenCalledWith(1)
    })
  })
})
