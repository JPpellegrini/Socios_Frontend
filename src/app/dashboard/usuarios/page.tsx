"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Shield, KeyRound, UserX, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { fabVariants } from "@/components/ui/fab"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useUsuariosService } from "@/lib/usuarios/service-context"
import { ROLES_DISPONIBLES, type UsuarioListItem } from "@/lib/usuarios/types"
import { ModificarRolDialog } from "./modificar-rol-dialog"
import { ModificarPasswordDialog } from "./modificar-password-dialog"

const ESTADO_OPTIONS = [
  { value: "ACTIVO", label: "ACTIVO" },
  { value: "BAJA", label: "BAJA" },
]

const ROL_OPTIONS = ROLES_DISPONIBLES.map((r) => ({ value: r, label: r }))

export default function UsuariosPage() {
  const usuariosService = useUsuariosService()

  const [usuarios, setUsuarios] = React.useState<UsuarioListItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const [userToToggleState, setUserToToggleState] = React.useState<UsuarioListItem | null>(null)
  const [userToEditRol, setUserToEditRol] = React.useState<UsuarioListItem | null>(null)
  const [userToEditPassword, setUserToEditPassword] = React.useState<UsuarioListItem | null>(null)

  const fetchUsuarios = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await usuariosService.list()
      setUsuarios(data)
    } catch (err) {
      console.error("Error al obtener usuarios:", err)
    } finally {
      setLoading(false)
    }
  }, [usuariosService])

  React.useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  const handleConfirmToggleState = async () => {
    if (!userToToggleState) return
    try {
      const ok = await usuariosService.toggleEstado(userToToggleState.id_Usuario)
      if (ok) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id_Usuario === userToToggleState.id_Usuario
              ? { ...u, estado: u.estado === "ACTIVO" ? "BAJA" : "ACTIVO" }
              : u
          )
        )
      }
    } catch (err) {
      console.error("Error al cambiar estado de usuario:", err)
    } finally {
      setUserToToggleState(null)
    }
  }

  const handleSaveRol = async (id_Usuario: number, nuevoRol: string) => {
    const ok = await usuariosService.updateRol({ id_Usuario, rol: nuevoRol })
    if (ok) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id_Usuario === id_Usuario ? { ...u, rol: nuevoRol } : u))
      )
    }
  }

  const handleSavePassword = async (id_Usuario: number, nuevaPassword: string) => {
    await usuariosService.updatePassword({
      id_Usuario,
      password: nuevaPassword,
      confirmPassword: nuevaPassword,
    })
  }

  const columns: Column<UsuarioListItem>[] = React.useMemo(
    () => [
      {
        key: "id_Usuario",
        header: "Id_Usuario",
        accessor: (u) => u.id_Usuario,
        searchable: true,
      },
      {
        key: "usuario",
        header: "Usuario",
        accessor: (u) => u.usuario,
        searchable: true,
      },
      {
        key: "rol",
        header: "Rol",
        accessor: (u) => u.rol,
        searchable: true,
        filterable: true,
        filterOptions: ROL_OPTIONS,
        filterAccessor: (u) => u.rol,
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (u) => (
          <span
            className={cn(
              "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
              u.estado === "ACTIVO"
                ? "bg-primary-container text-on-primary-container"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {u.estado}
          </span>
        ),
        filterable: true,
        filterOptions: ESTADO_OPTIONS,
        filterAccessor: (u) => u.estado,
      },
    ],
    []
  )

  return (
    <div className="relative h-full p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Listado de Usuarios</h1>

      <DataTable<UsuarioListItem>
        storageKey="usuarios-list"
        data={usuarios}
        columns={columns}
        getRowId={(u) => String(u.id_Usuario)}
        searchPlaceholder="Buscar por usuario o rol"
        loading={loading}
        emptyMessage="No se encontraron usuarios"
        renderActions={(u) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              title="Cambiar Rol"
              aria-label="Cambiar Rol"
              onClick={() => setUserToEditRol(u)}
            >
              <Shield />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Cambiar Password"
              aria-label="Cambiar Password"
              onClick={() => setUserToEditPassword(u)}
            >
              <KeyRound />
            </Button>
            {u.estado === "ACTIVO" ? (
              <Button
                variant="ghost"
                size="icon"
                title="Baja Usuario"
                aria-label="Baja Usuario"
                className="text-destructive"
                onClick={() => setUserToToggleState(u)}
              >
                <UserX />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title="Reactivar Usuario"
                aria-label="Reactivar Usuario"
                onClick={() => setUserToToggleState(u)}
              >
                <UserCheck />
              </Button>
            )}
          </>
        )}
      />

      <Link
        href="/dashboard/usuarios/nuevo"
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo usuario"
      >
        <Plus />
      </Link>

      <ConfirmDialog
        open={!!userToToggleState}
        onOpenChange={(open) => {
          if (!open) setUserToToggleState(null)
        }}
        variant={userToToggleState?.estado === "ACTIVO" ? "destructive" : "primary"}
        title={
          userToToggleState?.estado === "ACTIVO"
            ? "¿Dar de baja usuario?"
            : "¿Reactivar usuario?"
        }
        description={
          userToToggleState
            ? `¿Está seguro de que desea cambiar el estado del usuario "${userToToggleState.usuario}" a ${
                userToToggleState.estado === "ACTIVO" ? "BAJA" : "ACTIVO"
              }?`
            : "Mensaje confirmación de baja con cambio de estado."
        }
        confirmText={
          userToToggleState?.estado === "ACTIVO" ? "Dar de Baja" : "Reactivar"
        }
        cancelText="Cancelar"
        onConfirm={handleConfirmToggleState}
      />

      <ModificarRolDialog
        open={!!userToEditRol}
        onOpenChange={(open) => {
          if (!open) setUserToEditRol(null)
        }}
        usuario={userToEditRol}
        onSave={handleSaveRol}
      />

      <ModificarPasswordDialog
        open={!!userToEditPassword}
        onOpenChange={(open) => {
          if (!open) setUserToEditPassword(null)
        }}
        usuario={userToEditPassword}
        onSave={handleSavePassword}
      />
    </div>
  )
}
