"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { validarPassword, type UsuarioListItem } from "@/lib/usuarios/types"

interface ModificarPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioListItem | null
  onSave: (id_Usuario: number, nuevaPassword: string) => Promise<void>
}

export function ModificarPasswordDialog({
  open,
  onOpenChange,
  usuario,
  onSave,
}: ModificarPasswordDialogProps) {
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [errorPassword, setErrorPassword] = React.useState<string | undefined>()
  const [errorConfirm, setErrorConfirm] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setPassword("")
      setConfirmPassword("")
      setErrorPassword(undefined)
      setErrorConfirm(undefined)
    }
  }, [open])

  const validate = (): boolean => {
    let valid = true
    const checkPass = validarPassword(password)
    if (!checkPass.valido) {
      setErrorPassword(checkPass.mensaje)
      valid = false
    } else {
      setErrorPassword(undefined)
    }

    if (!confirmPassword || confirmPassword.trim().length === 0) {
      setErrorConfirm("La confirmación de contraseña es requerida")
      valid = false
    } else if (password !== confirmPassword) {
      setErrorConfirm("Las contraseñas no coinciden")
      valid = false
    } else {
      setErrorConfirm(undefined)
    }

    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario) return
    if (!validate()) return

    try {
      setLoading(true)
      await onSave(usuario.id_Usuario, password)
      onOpenChange(false)
    } catch (err) {
      console.error("Error al modificar password:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Modificar Password
          </DialogTitle>
          <DialogDescription className="text-xs text-on-surface-variant">
            Establezca una nueva contraseña para la cuenta del usuario.
          </DialogDescription>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input
            type="password"
            label="Nueva Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorPassword}
            errorText={errorPassword}
          />


          <Input
            type="password"
            label="Confirmar Password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errorConfirm}
            errorText={errorConfirm}
          />


          <div className="rounded-md bg-surface-container-high p-3 text-xs text-on-surface-variant space-y-1">
            <p className="font-semibold text-foreground">Requisitos de contraseña:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos 1 carácter especial (!@#$%^&amp;*)</li>

            </ul>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
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
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              Cambiar Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
