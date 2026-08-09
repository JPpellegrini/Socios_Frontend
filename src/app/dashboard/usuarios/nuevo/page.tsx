"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUsuariosService } from "@/lib/usuarios/service-context"
import { ROLES_DISPONIBLES, validarPassword } from "@/lib/usuarios/types"

function NuevoUsuarioForm() {
  const router = useRouter()
  const usuariosService = useUsuariosService()

  const [usuario, setUsuario] = React.useState("")
  const [rol, setRol] = React.useState<string>("SECRETARIA/O")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [errorUsuario, setErrorUsuario] = React.useState<string | undefined>()
  const [errorPassword, setErrorPassword] = React.useState<string | undefined>()
  const [errorConfirm, setErrorConfirm] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState(false)

  const validate = (): boolean => {
    let valid = true

    if (!usuario || usuario.trim().length === 0) {
      setErrorUsuario("El nombre de usuario es requerido")
      valid = false
    } else {
      setErrorUsuario(undefined)
    }

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
    if (!validate()) return

    try {
      setLoading(true)
      const res = await usuariosService.create({
        usuario: usuario.trim(),
        rol,
        password,
        confirmPassword,
      })
      if (res) {
        router.push("/dashboard/usuarios")
      }
    } catch (err) {
      console.error("Error al crear usuario:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface p-4 md:p-8 flex justify-center items-start">
      <Card
        variant="outlined"
        className="w-full max-w-6xl p-6 md:p-10 bg-background"
        style={{ "--input-bg": "var(--color-surface-container-lowest)" } as React.CSSProperties}
      >
        <h1 className="text-2xl mb-8 font-semibold tracking-tight">
          Nuevo usuario
        </h1>


        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-6">
            <Input
              label="Usuario"
              variant="outlined"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              error={!!errorUsuario}
              errorText={errorUsuario}
            />
          </div>


          <div className="col-span-12 md:col-span-6">
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

          <div className="col-span-12 md:col-span-6">
            <Input
              type="password"
              label="Nueva Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errorPassword}
              errorText={errorPassword}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Input
              type="password"
              label="Confirmar Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errorConfirm}
              errorText={errorConfirm}
            />
          </div>

          <div className="col-span-12">
            <div className="rounded-md bg-surface-container-high p-4 text-xs text-on-surface-variant space-y-1.5 border border-outline-variant">
              <p className="font-semibold text-foreground">Requisitos de contraseña:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mínimo 8 caracteres</li>
                <li>Al menos 1 carácter especial (!@#$%^&amp;*()_+-=[]&#123;&#125;;&apos;:&quot;|,..&lt;&gt;?)</li>
              </ul>
            </div>
          </div>

          <div className="col-span-12 flex flex-col md:flex-row justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40"
              onClick={() => router.push("/dashboard/usuarios")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full md:w-40"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Check className="size-4 mr-1" />
              )}
              Grabar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default function NuevoUsuarioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-surface-container-lowest p-4 md:p-8" />
      }
    >
      <NuevoUsuarioForm />
    </React.Suspense>
  )
}
