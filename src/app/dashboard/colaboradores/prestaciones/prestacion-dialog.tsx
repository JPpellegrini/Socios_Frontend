"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type PrestacionItem, type TipoPrestacion } from "./schema";
import { crearPrestacion, modificarPrestacion } from "./actions";

interface PrestacionDialogProps {
  open: boolean;
  prestacion: PrestacionItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PrestacionDialog({
  open,
  prestacion,
  onOpenChange,
  onSuccess,
}: PrestacionDialogProps) {
  const isEditing = prestacion !== null;

  const [nombre, setNombre] = React.useState("");
  const [tipo, setTipo] = React.useState<TipoPrestacion>("PRESTACION");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setNombre(prestacion?.nombre ?? "");
      setTipo(prestacion?.tipo ?? "PRESTACION");
      setErrorMsg(null);
    }
  }, [open, prestacion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreTrim = nombre.trim();
    if (nombreTrim.length < 3 || nombreTrim.length > 100) {
      setErrorMsg("El nombre debe tener entre 3 y 100 caracteres.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = isEditing
        ? await modificarPrestacion(prestacion.idPrestacion, {
            nombre: nombreTrim,
            tipo,
          })
        : await crearPrestacion({
            nombre: nombreTrim,
            tipo,
          });

      if (res.success) {
        onOpenChange(false);
        onSuccess();
      } else {
        setErrorMsg(res.mensaje || "No se pudo guardar la prestación.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Prestación" : "Nueva Prestación"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifique el nombre o tipo de la prestación seleccionada."
                : "Complete los datos para dar de alta una nueva prestación."}
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4 py-4">
            <Input
              id="prestacion-nombre"
              label="Nombre"
              variant="outlined"
              placeholder="Ej. Servicio de ambulancia"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <Select
              value={tipo}
              onValueChange={(val: TipoPrestacion) => setTipo(val)}
            >
              <SelectTrigger label="Tipo" variant="outlined">
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESTACION">Prestación (Proveedores)</SelectItem>
                <SelectItem value="COLABORACION">Colaboración (Colaboradores)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Crear Prestación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
