"use client";

import * as React from "react";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Check, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/ui/data-table";
import { MOCK_CIUDADES, type Ciudad } from "@/lib/ciudades";
import {
  codeudorSchema,
  type CodeudorFormData,
  type Codeudor,
  contactValue,
} from "./schema";
import { crearCodeudor } from "./actions";

const CIUDADES_COLUMNS: Column<Ciudad>[] = [
  { key: "nombre", header: "Nombre", accessor: (c) => c.nombre, searchable: true },
];

interface CrearCodeudorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCodeudorCreado: (codeudor: Codeudor) => void;
}

export function CrearCodeudorDialog({
  open,
  onOpenChange,
  onCodeudorCreado,
}: CrearCodeudorDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CodeudorFormData>({
    resolver: zodResolver(codeudorSchema) as Resolver<CodeudorFormData>,
    defaultValues: {
      dni: "",
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      sexo: "",
      ciudad: "",
      calle: "",
      altura: "",
      observaciones: "",
      telefonos: [],
      correos: [],
    },
  });

  const ciudadValue = useWatch({ control, name: "ciudad" });
  const sexoValue = useWatch({ control, name: "sexo" });

  const {
    fields: telefonoFields,
    append: appendTelefono,
    remove: removeTelefono,
  } = useFieldArray({
    control,
    name: "telefonos",
  });

  const {
    fields: correoFields,
    append: appendCorreo,
    remove: removeCorreo,
  } = useFieldArray({
    control,
    name: "correos",
  });

  const [newTelefono, setNewTelefono] = React.useState("");
  const [newCorreo, setNewCorreo] = React.useState("");
  const [telefonoError, setTelefonoError] = React.useState("");
  const [correoError, setCorreoError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      reset();
      setNewTelefono("");
      setNewCorreo("");
      setTelefonoError("");
      setCorreoError("");
      setServerError(null);
    }
  }, [open, reset]);

  const handleAddTelefono = () => {
    if (!newTelefono) return;
    if (!/^\d{8,15}$/.test(newTelefono.replace(/[- ]/g, ""))) {
      setTelefonoError("Formato inválido (8 a 15 dígitos)");
      return;
    }
    setTelefonoError("");
    appendTelefono({ value: newTelefono });
    setNewTelefono("");
  };

  const handleAddCorreo = () => {
    if (!newCorreo) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCorreo)) {
      setCorreoError("Formato de correo inválido");
      return;
    }
    setCorreoError("");
    appendCorreo({ value: newCorreo });
    setNewCorreo("");
  };

  const onSubmit = async (data: CodeudorFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await crearCodeudor(data);
      if (res && res.idEntidad) {
        onCodeudorCreado({
          id: String(res.idEntidad),
          nombre: data.nombre,
          apellido: data.apellido,
          nroDocumento: data.dni,
        });
        onOpenChange(false);
      } else {
        setServerError("No se pudo crear el codeudor. Verifique los datos.");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error inesperado al crear codeudor"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Registrar Nuevo Codeudor
          </DialogTitle>
          <DialogDescription className="text-sm text-on-surface-variant">
            Cree una nueva persona como codeudor avalista para este socio.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <Input
                label="DNI"
                variant="outlined"
                error={!!errors.dni}
                errorText={errors.dni?.message}
                {...register("dni")}
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <Input
                label="Nombre"
                variant="outlined"
                error={!!errors.nombre}
                errorText={errors.nombre?.message}
                {...register("nombre")}
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <Input
                label="Apellido"
                variant="outlined"
                error={!!errors.apellido}
                errorText={errors.apellido?.message}
                {...register("apellido")}
              />
            </div>

            <div className="col-span-12 sm:col-span-6">
              <Input
                label="Fecha de nacimiento"
                type="date"
                variant="outlined"
                error={!!errors.fechaNacimiento}
                errorText={errors.fechaNacimiento?.message}
                {...register("fechaNacimiento")}
              />
            </div>

            <div className="col-span-12 sm:col-span-6">
              <Select
                value={sexoValue || ""}
                onValueChange={(val) => setValue("sexo", val, { shouldValidate: true })}
              >
                <SelectTrigger label="Sexo" variant="outlined" error={!!errors.sexo}>
                  <SelectValue placeholder=" " />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hombre">Hombre</SelectItem>
                  <SelectItem value="Mujer">Mujer</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 flex flex-col sm:flex-row items-start sm:items-end gap-2">
              <div className="flex-grow w-full">
                <Input
                  label="Ciudad"
                  value={ciudadValue || "Ninguna seleccionada"}
                  readOnly
                  variant="outlined"
                  error={!!errors.ciudad}
                  errorText={errors.ciudad?.message}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full sm:w-auto h-14" type="button">
                    <Search className="size-4" />
                    Seleccionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Buscar ciudad</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <DataTable<Ciudad>
                      storageKey="codeudor-ciudades-selector"
                      data={MOCK_CIUDADES}
                      columns={CIUDADES_COLUMNS}
                      getRowId={(c) => c.id}
                      searchPlaceholder="Buscar ciudad por nombre"
                      emptyMessage="No se encontraron ciudades"
                      renderActions={(c) => (
                        <DialogClose asChild>
                          <Button
                            size="sm"
                            type="button"
                            onClick={() => setValue("ciudad", c.nombre, { shouldValidate: true })}
                          >
                            Elegir
                          </Button>
                        </DialogClose>
                      )}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="col-span-12 sm:col-span-8">
              <Input
                label="Calle"
                variant="outlined"
                error={!!errors.calle}
                errorText={errors.calle?.message}
                {...register("calle")}
              />
            </div>

            <div className="col-span-12 sm:col-span-4">
              <Input
                label="Altura"
                variant="outlined"
                error={!!errors.altura}
                errorText={errors.altura?.message}
                {...register("altura")}
              />
            </div>

            {/* Teléfonos */}
            <div className="col-span-12 space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                <div className="flex-grow w-full">
                  <Input
                    label="Teléfono (requerido)"
                    variant="outlined"
                    value={newTelefono}
                    onChange={(e) => setNewTelefono(e.target.value)}
                    error={!!telefonoError || !!errors.telefonos}
                    errorText={telefonoError || errors.telefonos?.message}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTelefono();
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto h-14 px-4"
                  onClick={handleAddTelefono}
                >
                  <Plus className="size-4" />
                  <span>Agregar</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {telefonoFields.map((field, index) => (
                  <Chip
                    key={field.id}
                    variant="input"
                    onRemove={() => removeTelefono(index)}
                  >
                    {contactValue(field)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Correos */}
            <div className="col-span-12 space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                <div className="flex-grow w-full">
                  <Input
                    label="Correo electrónico (opcional)"
                    variant="outlined"
                    value={newCorreo}
                    onChange={(e) => setNewCorreo(e.target.value)}
                    error={!!correoError}
                    errorText={correoError}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCorreo();
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto h-14 px-4"
                  onClick={handleAddCorreo}
                >
                  <Plus className="size-4" />
                  <span>Agregar</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {correoFields.map((field, index) => (
                  <Chip
                    key={field.id}
                    variant="input"
                    onRemove={() => removeCorreo(index)}
                  >
                    {contactValue(field)}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Check className="size-4" />
              <span>{loading ? "Guardando..." : "Crear Codeudor"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
