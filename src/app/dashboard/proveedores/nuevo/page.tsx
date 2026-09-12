"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Check, Search, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import { Fab } from "@/components/ui/fab";
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
  normalizeContacts,
  contactValue,
} from "../schema";
import {
  obtenerProveedorDetalle,
  crearProveedor,
  actualizarProveedor,
  buscarProveedorPorDocumento,
} from "../actions";

const CIUDADES_COLUMNS: Column<Ciudad>[] = [
  { key: "nombre", header: "Nombre", accessor: (c) => c.nombre, searchable: true },
];

function ProveedorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);

  const [isVerificado, setIsVerificado] = React.useState(isEditing);
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    setError,
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

  const cuitCuilValue = useWatch({ control, name: "cuitCuil" });
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
        setIsVerificado(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error al cargar el proveedor:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [editId, reset]);

  const handleVerificarDocumento = async () => {
    const isValid = await trigger("cuitCuil");
    if (!isValid) return;

    setLoadingSearch(true);

    try {
      const prov = await buscarProveedorPorDocumento(cuitCuilValue);
      if (prov) {
        const formattedTelefonos = (prov.telefonos || []).map((t) =>
          typeof t === "string" ? { value: t } : t
        );
        const formattedCorreos = (prov.correos || []).map((c) =>
          typeof c === "string" ? { value: c } : c
        );

        reset({
          ...prov,
          cuitCuil: prov.cuitCuil || cuitCuilValue,
          telefonos: formattedTelefonos,
          correos: formattedCorreos,
        });
      } else {
        reset({
          cuitCuil: cuitCuilValue,
          razonSocial: "",
          prestacion: "",
          fechaNacimiento: new Date().toISOString().substring(0, 10),
          ciudad: "",
          calle: "",
          altura: "",
          observaciones: "",
          telefonos: [],
          correos: [],
        });
      }
      setIsVerificado(true);
    } catch (err) {
      setError("cuitCuil", {
        type: "manual",
        message: "Error al buscar el proveedor. Intente nuevamente.",
      });
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleCambiarDocumento = () => {
    setIsVerificado(false);
    reset({
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
    });
  };

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

    const formattedData: ProveedorFormData = {
      ...data,
      telefonos: normalizeContacts(data.telefonos),
      correos: normalizeContacts(data.correos),
    };

    try {
      if (isEditing && editId) {
        await actualizarProveedor(editId, formattedData);
      } else {
        const res = await crearProveedor(formattedData);
        if (!res) {
          throw new Error("No se pudo crear el proveedor. Verifique los datos.");
        }
      }
      router.push("/dashboard/proveedores");
    } catch (err) {
      console.error("Error al guardar el proveedor:", err);
      setError("root", {
        type: "manual",
        message: "No se pudo guardar el proveedor. Intente nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const ciudadOptions =
    ciudadValue && !MOCK_CIUDADES.some((c) => c.nombre === ciudadValue)
      ? [...MOCK_CIUDADES, { id: "externo", nombre: ciudadValue }]
      : MOCK_CIUDADES;

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface p-4 md:p-8 flex justify-center items-start">
      <Card variant="outlined" className="w-full max-w-6xl p-6 md:p-10 bg-background">
        <h1 className="text-2xl mb-8 font-semibold tracking-tight">
          {isEditing ? "Editar proveedor" : "Nuevo proveedor"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-x-6 gap-y-8">
          {/* Documento / CUIT Search Field */}
          <div className="col-span-12 md:col-span-10">
            <Input
              label="CUIT / CUIL / DNI"
              variant="outlined"
              error={!!errors.cuitCuil}
              errorText={errors.cuitCuil?.message}
              {...register("cuitCuil")}
              readOnly={isVerificado}
            />
          </div>

          <div className="col-span-12 md:col-span-2 flex items-start gap-3">
            {!isVerificado ? (
              <>
                <Fab
                  type="button"
                  onClick={handleVerificarDocumento}
                  disabled={loadingSearch}
                  icon={<Search />}
                  aria-label="Buscar"
                />
                <Fab
                  type="button"
                  variant="surface"
                  onClick={() => router.push("/dashboard/proveedores")}
                  icon={<X />}
                  aria-label="Cancelar"
                />
              </>
            ) : (
              !isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14"
                  onClick={handleCambiarDocumento}
                >
                  Buscar otro
                </Button>
              )
            )}
          </div>

          {isVerificado && (
            <>
              {/* Razón Social */}
              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Razón Social / Nombre"
                  variant="outlined"
                  error={!!errors.razonSocial}
                  errorText={errors.razonSocial?.message}
                  {...register("razonSocial")}
                />
              </div>

              {/* Prestación */}
              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Prestación / Especialidad / Servicio"
                  variant="outlined"
                  error={!!errors.prestacion}
                  errorText={errors.prestacion?.message}
                  {...register("prestacion")}
                />
              </div>

              {/* Fecha Inicio / Nacimiento */}
              <div className="col-span-12 md:col-span-3">
                <Input
                  label="Fecha de inicio / nacimiento"
                  type="date"
                  variant="outlined"
                  error={!!errors.fechaNacimiento}
                  errorText={errors.fechaNacimiento?.message}
                  {...register("fechaNacimiento")}
                />
              </div>

              {/* Ciudad con selector popup */}
              <div className="col-span-12 md:col-span-9 flex flex-col sm:flex-row items-start sm:items-end gap-2">
                <div className="flex-grow w-full">
                  <Input
                    label="Ciudad"
                    value={ciudadValue || "Ninguna seleccionada"}
                    readOnly
                    variant="outlined"
                    error={!!errors.ciudad}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto h-14" size="default" type="button">
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
                        storageKey="proveedores-ciudades-selector"
                        data={ciudadOptions}
                        columns={CIUDADES_COLUMNS}
                        getRowId={(c) => c.id}
                        searchPlaceholder="Buscar ciudad por nombre"
                        emptyMessage="No se encontraron ciudades"
                        columnsLabel="Columnas"
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
              {errors.ciudad && <p className="text-xs text-destructive mt-1 px-4">{errors.ciudad.message}</p>}

              {/* Calle y Altura */}
              <div className="col-span-12 md:col-span-9">
                <Input
                  label="Calle"
                  variant="outlined"
                  error={!!errors.calle}
                  errorText={errors.calle?.message}
                  {...register("calle")}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
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

              <div className="col-span-12 my-2">
                <Separator />
              </div>

              {/* Contactos */}
              <div className="col-span-12">
                <h2 className="text-xl mb-4 font-medium">Contactos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Teléfonos */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                      <div className="flex-grow w-full">
                        <Input
                          label="Teléfono"
                          variant="outlined"
                          value={newTelefono}
                          onChange={(e) => setNewTelefono(e.target.value)}
                          error={!!telefonoError}
                          errorText={telefonoError}
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
                    {errors.telefonos && (
                      <p className="text-xs text-destructive px-4">{errors.telefonos.message}</p>
                    )}
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
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                      <div className="flex-grow w-full">
                        <Input
                          label="Correo electrónico"
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
                    {errors.correos && (
                      <p className="text-xs text-destructive px-4">{errors.correos.message}</p>
                    )}
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
              </div>

              {errors.root && (
                <div className="col-span-12 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                  {errors.root.message}
                </div>
              )}

              <div className="col-span-12 mt-4">
                <Separator />
              </div>

              {/* Footer */}
              <div className="col-span-12 flex flex-col md:flex-row justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-40"
                  onClick={isEditing ? () => router.push("/dashboard/proveedores") : handleCambiarDocumento}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full md:w-40"
                  disabled={submitting}
                >
                  <Check className="size-4" />
                  {submitting ? "Guardando..." : "Grabar"}
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
}

export default function NuevoProveedorPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-surface-container-lowest p-4 md:p-8" />
      }
    >
      <ProveedorForm />
    </React.Suspense>
  );
}
