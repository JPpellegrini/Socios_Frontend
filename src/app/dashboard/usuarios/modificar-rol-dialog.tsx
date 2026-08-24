"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ROLES_DISPONIBLES, type UsuarioListItem } from "@/lib/usuarios/types"


interface ModificarRolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioListItem | null
  onSave: (id_Usuario: number, nuevoRol: string) => Promise<void>
}

export function ModificarRolDialog({
  open,
  onOpenChange,
  usuario,
  onSave,
}: ModificarRolDialogProps) {
  const [rol, setRol] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (usuario) {
      setRol(usuario.rol)
    }
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario || !rol) return

    try {
      setLoading(true)
      await onSave(usuario.id_Usuario, rol)
      onOpenChange(false)
    } catch (err) {
      console.error("Error al modificar rol:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Modificar Rol
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant">
            Seleccione el nuevo rol para el usuario.
          </DialogDescription>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Select value={rol} onValueChange={setRol} label="ROL" variant="outlined">
              <SelectTrigger variant="outlined">
                <SelectValue placeholder="Seleccionar Rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES_DISPONIBLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !rol || rol === usuario?.rol}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
