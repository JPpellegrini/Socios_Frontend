"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ArrowLeft, Check, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { MOCK_CIUDADES, type Ciudad } from "@/lib/ciudades";
import {
  proveedorSchema,
  type ProveedorFormData,
  type ProveedorDetalle,
  contactValue,
} from "../schema";
import {
  obtenerProveedorDetalle,
  crearProveedor,
  actualizarProveedor,
} from "../actions";

const CIUDADES_COLUMNS: Column<Ciudad>[] = [
  { key: "nombre", header: "Nombre", accessor: (c) => c.nombre, searchable: true },
];

export default function ProveedorFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);

  const [loadingInitial, setLoadingInitial] = React.useState(isEditing);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProveedorFormData>({
    resolver: zodResolver(proveedorSchema) as Resolver<ProveedorFormData>,
    defaultValues: {
      cuitCuil: "",
      razonSocial: "",
      prestacion: "",
      fechaNacimiento: new Date().toISOString().substring(0, 10),
      ciudad: "",
      calle: "",
      altura: "",
      observaciones: "",
      telefonos: [],
      correos: [],
    },
  });

  const ciudadValue = useWatch({ control, name: "ciudad" });

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
    if (!editId) return;

    let cancelled = false;
    obtenerProveedorDetalle(editId)
      .then((detalle: ProveedorDetalle | null) => {
        if (cancelled || !detalle) return;

        reset({
          cuitCuil: detalle.cuitCuil,
          razonSocial: detalle.razonSocial,
          prestacion: detalle.prestacion,
          fechaNacimiento: detalle.fechaNacimiento || new Date().toISOString().substring(0, 10),
          ciudad: detalle.ciudad,
          calle: detalle.calle,
          altura: detalle.altura,
          observaciones: detalle.observaciones || "",
          telefonos: detalle.telefonos.map((t) => ({ value: t })),
          correos: detalle.emails.map((e) => ({ value: e })),
        });
      })
      .finally(() => {
        if (!cancelled) setLoadingInitial(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editId, reset]);

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

  const onSubmit = async (data: ProveedorFormData) => {
    setSubmitting(true);
    setServerError(null);

    try {
      if (isEditing && editId) {
        await actualizarProveedor(editId, data);
      } else {
        const res = await crearProveedor(data);
        if (!res) {
          throw new Error("No se pudo crear el proveedor. Verifique los datos.");
        }
      }
      router.push("/dashboard/proveedores");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error inesperado al guardar"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-container-lowest">
        <p className="text-on-surface-variant animate-pulse">Cargando datos del proveedor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 bg-surface-container-lowest p-4 md:p-8 flex justify-center items-start">
      <Card variant="outlined" className="w-full max-w-4xl p-6 md:p-10 bg-background">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/proveedores">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h1>
            <p className="text-xs text-on-surface-variant">
              {isEditing
                ? "Modifique los datos comerciales y de contacto del proveedor."
                : "Complete los datos para dar de alta un nuevo prestador de servicios."}
            </p>
          </div>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            {/* CUIT / CUIL / DNI */}
            <div className="col-span-12 md:col-span-4">
              <Input
                label="CUIT / CUIL / DNI"
                variant="outlined"
                readOnly={isEditing}
                error={!!errors.cuitCuil}
                errorText={errors.cuitCuil?.message}
                {...register("cuitCuil")}
              />
            </div>

            {/* Razón Social */}
            <div className="col-span-12 md:col-span-8">
              <Input
                label="Razón Social / Nombre"
                variant="outlined"
                error={!!errors.razonSocial}
                errorText={errors.razonSocial?.message}
                {...register("razonSocial")}
              />
            </div>

            {/* Prestación / Servicio */}
            <div className="col-span-12 md:col-span-8">
              <Input
                label="Prestación / Especialidad / Servicio"
                variant="outlined"
                error={!!errors.prestacion}
                errorText={errors.prestacion?.message}
                {...register("prestacion")}
              />
            </div>

            {/* Fecha Nacimiento o Inicio */}
            <div className="col-span-12 md:col-span-4">
              <Input
                label="Fecha inicio / nacimiento"
                type="date"
                variant="outlined"
                error={!!errors.fechaNacimiento}
                errorText={errors.fechaNacimiento?.message}
                {...register("fechaNacimiento")}
              />
            </div>

            {/* Ciudad con selector */}
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
                      storageKey="proveedor-ciudades-selector"
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

            {/* Calle y Altura */}
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

            {/* Observaciones */}
            <div className="col-span-12">
              <Input
                label="Observaciones (opcional)"
                variant="outlined"
                error={!!errors.observaciones}
                errorText={errors.observaciones?.message}
                {...register("observaciones")}
              />
            </div>

            {/* Teléfonos */}
            <div className="col-span-12 space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                <div className="flex-grow w-full">
                  <Input
                    label="Teléfono (al menos uno requerido)"
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

          <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/30">
            <Button variant="outline" asChild disabled={submitting}>
              <Link href="/dashboard/proveedores">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              <Check className="size-4" />
              <span>{submitting ? "Guardando..." : isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
