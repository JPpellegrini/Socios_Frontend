import { MOCK_SOCIOS, MOCK_SOCIOS_DETALLE, MOCK_USUARIOS } from "@/lib/mocks"
import type { SocioListItem, SocioDetalle } from "@/app/dashboard/socios/actions"
import { normalizeContacts, type SocioFormData } from "@/app/dashboard/socios/nuevo/schema"
import type { UsuarioListItem, CrearUsuarioDTO } from "@/lib/usuarios/types"

function toListItem(d: SocioDetalle): SocioListItem {
  return {
    id: d.id,
    nombre: d.nombre,
    apellido: d.apellido,
    nroDocumento: d.nroDocumento,
    obraSocial: d.obraSocial ?? null,
    plan: d.plan,
    estado: d.fechaBaja ? "Baja" : "Activo",
  }
}

interface DevStoreState {
  list: SocioListItem[]
  detalle: SocioDetalle[]
  nextId: number
  usuarios: UsuarioListItem[]
  nextUsuarioId: number
}

function seed(): DevStoreState {
  return {
    list: MOCK_SOCIOS.map((s) => ({ ...s })),
    detalle: MOCK_SOCIOS_DETALLE.map((s) => ({ ...s })),
    nextId: MOCK_SOCIOS.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1,
    usuarios: MOCK_USUARIOS.map((u) => ({ ...u, estado: u.estado as "ACTIVO" | "BAJA" })),
    nextUsuarioId: MOCK_USUARIOS.reduce((max, u) => Math.max(max, u.id_Usuario), 0) + 1,
  }
}

let state: DevStoreState = seed()

export function _resetDevStoreForTests(): void {
  state = seed()
}

export function devGetUsuarios(): UsuarioListItem[] {
  return state.usuarios.map((u) => ({ ...u }))
}

export function devAddUsuario(data: CrearUsuarioDTO): UsuarioListItem {
  const newUser: UsuarioListItem = {
    id_Usuario: state.nextUsuarioId++,
    usuario: data.usuario,
    rol: data.rol,
    estado: "ACTIVO",
  }
  state.usuarios.push(newUser)
  return { ...newUser }
}

export function devUpdateUsuarioRol(id_Usuario: number, rol: string): boolean {
  const user = state.usuarios.find((u) => u.id_Usuario === id_Usuario)
  if (!user) return false
  user.rol = rol
  return true
}

export function devUpdateUsuarioPassword(id_Usuario: number, password: string): boolean {
  const user = state.usuarios.find((u) => u.id_Usuario === id_Usuario)
  return !!user && password.length > 0
}


export function devToggleUsuarioEstado(id_Usuario: number): boolean {
  const user = state.usuarios.find((u) => u.id_Usuario === id_Usuario)
  if (!user) return false
  user.estado = user.estado === "ACTIVO" ? "BAJA" : "ACTIVO"
  return true
}


export function devGetSocios(): SocioListItem[] {
  return state.list.map((s) => ({ ...s }))
}

export function devGetSocioDetalle(id: string): SocioDetalle | null {
  const found = state.detalle.find((s) => s.id === id)
  return found
    ? {
        ...found,
        telefonos: [...found.telefonos],
        correos: [...found.correos],
        codeudores: found.codeudores?.map((c) => ({ ...c })),
      }
    : null
}

export function devAddSocio(data: SocioFormData): string {
  const id = String(state.nextId++)
  const detalle: SocioDetalle = {
    id,
    nombre: data.nombre,
    apellido: data.apellido,
    nroDocumento: data.nroDocumento,
    fechaNacimiento: data.fechaNacimiento,
    sexo: data.sexo,
    ciudad: data.ciudad,
    calle: data.calle,
    altura: data.altura,
    fechaAlta: data.fechaAlta,
    fechaBaja: data.fechaBaja,
    obraSocial: data.obraSocial,
    nroAfiliadoObraSocial: data.nroAfiliadoObraSocial,
    plan: data.plan,
    sepelio: data.sepelio,
    cobrador: data.cobrador,
    observaciones: data.observaciones,
    telefonos: normalizeContacts(data.telefonos),
    correos: normalizeContacts(data.correos),
    codeudores: (data.codeudores ?? []).map((c) => ({ ...c })),
  }
  state.detalle.push(detalle)
  state.list.push(toListItem(detalle))
  return id
}

export function devUpdateSocio(id: string, data: SocioFormData): boolean {
  const idx = state.detalle.findIndex((s) => s.id === id)
  if (idx === -1) return false
  const prev = state.detalle[idx]
  if (!prev) return false
  const updated: SocioDetalle = {
    ...prev,
    nombre: data.nombre,
    apellido: data.apellido,
    nroDocumento: data.nroDocumento,
    fechaNacimiento: data.fechaNacimiento,
    sexo: data.sexo,
    ciudad: data.ciudad,
    calle: data.calle,
    altura: data.altura,
    fechaAlta: data.fechaAlta,
    fechaBaja: data.fechaBaja,
    obraSocial: data.obraSocial,
    nroAfiliadoObraSocial: data.nroAfiliadoObraSocial,
    plan: data.plan,
    sepelio: data.sepelio,
    cobrador: data.cobrador,
    observaciones: data.observaciones,
    telefonos: normalizeContacts(data.telefonos),
    correos: normalizeContacts(data.correos),
    codeudores: (data.codeudores ?? []).map((c) => ({ ...c })),
  }
  state.detalle[idx] = updated
  const lidx = state.list.findIndex((s) => s.id === id)
  if (lidx !== -1) state.list[lidx] = toListItem(updated)
  return true
}

export function devFindSocioByDocumento(
  nroDocumento: string
): SocioDetalle | null {
  const found = state.detalle.find(
    (s) => s.nroDocumento === nroDocumento
  )
  return found
    ? {
        ...found,
        telefonos: [...found.telefonos],
        correos: [...found.correos],
        codeudores: found.codeudores?.map((c) => ({ ...c })),
      }
    : null
}

export function devRemoveSocio(id: string): boolean {
  const before = state.list.length
  state.list = state.list.filter((s) => s.id !== id)
  state.detalle = state.detalle.filter((s) => s.id !== id)
  return state.list.length < before
}

export function devReactivateSocio(id: string): boolean {
  const detalle = state.detalle.find((s) => s.id === id)
  if (!detalle) return false
  const updated: SocioDetalle = { ...detalle, fechaBaja: undefined }
  state.detalle = state.detalle.map((s) => (s.id === id ? updated : s))
  state.list = state.list.map((s) => (s.id === id ? toListItem(updated) : s))
  return true
}
