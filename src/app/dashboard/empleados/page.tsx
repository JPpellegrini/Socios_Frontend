"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Users, CheckCircle2, XCircle } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type EmpleadoListItem } from "./schema";
import { obtenerEmpleados, darDeBajaEmpleado } from "./actions";

const ESTADO_OPTIONS = [
  { value: "Todos", label: "Todos los estados" },
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

export default function EmpleadosPage() {
  const router = useRouter();
  const [empleados, setEmpleados] = React.useState<EmpleadoListItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Baja dialog
  const [empleadoParaBaja, setEmpleadoParaBaja] = React.useState<EmpleadoListItem | null>(null);
  const [motivoBaja, setMotivoBaja] = React.useState("");
  const [bajaError, setBajaError] = React.useState<string | null>(null);
  const [bajaLoading, setBajaLoading] = React.useState(false);

  const cargarEmpleados = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerEmpleados();
      setEmpleados(data);
    } catch {
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const handleConfirmarBaja = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empleadoParaBaja) return;

    if (motivoBaja.trim().length < 3) {
      setBajaError("Debe indicar un motivo de baja de al menos 3 caracteres.");
      return;
    }

    setBajaLoading(true);
    setBajaError(null);

    try {
      const targetId = empleadoParaBaja.idEntidadTipo ?? Number(empleadoParaBaja.id);
      const res = await darDeBajaEmpleado(targetId, motivoBaja.trim());
      if (res.success) {
        setEmpleadoParaBaja(null);
        setMotivoBaja("");
        await cargarEmpleados();
      } else {
        setBajaError(res.mensaje || "Error al dar de baja el empleado.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al dar de baja.";
      setBajaError(msg);
    } finally {
      setBajaLoading(false);
    }
  };

  // Métricas
  const totalEmpleados = empleados.length;
  const activos = empleados.filter((e) => e.estado === "Activo").length;
  const inactivos = totalEmpleados - activos;

  const columns: Column<EmpleadoListItem>[] = React.useMemo(
    () => [
      {
        key: "dni",
        header: "Documento",
        accessor: (e) => (
          <div>
            <span className="font-mono font-medium text-foreground">{e.dni}</span>
            <span className="ml-1.5 text-[11px] text-on-surface-variant uppercase">DNI</span>
          </div>
        ),
        searchable: true,
        searchAccessor: (e) => e.dni,
      },
      {
        key: "nombre",
        header: "Nombre y Apellido",
        accessor: (e) => (
          <p className="font-semibold text-foreground">
            {e.apellido}, {e.nombre}
          </p>
        ),
        searchable: true,
        searchAccessor: (e) => `${e.nombre} ${e.apellido}`,
      },
      {
        key: "sexo",
        header: "Sexo",
        accessor: (e) => (
          <span className="text-sm text-on-surface-variant">
            {e.sexo || "—"}
          </span>
        ),
      },
      {
        key: "telefonos",
        header: "Teléfono",
        accessor: (e) => (
          <span className="text-sm font-mono text-on-surface-variant">
            {e.telefonos.length > 0 ? e.telefonos[0] : "—"}
          </span>
        ),
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (e) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs ${
              e.estado === "Inactivo"
                ? "bg-destructive text-white font-medium"
                : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium"
            }`}
          >
            {e.estado}
          </span>
        ),
        filterable: true,
        filterOptions: ESTADO_OPTIONS,
        filterAccessor: (e) => e.estado,
      },
    ],
    []
  );

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Empleados
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gestión integral de personal de la institución
          </p>
        </div>
        <Button asChild variant="filled">
          <Link href="/dashboard/empleados/nuevo">
            <Plus className="size-4" />
            Nuevo Empleado
          </Link>
        </Button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="filled" className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Users className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Total Empleados
            </p>
            <p className="text-2xl font-bold text-foreground">{totalEmpleados}</p>
          </div>
        </Card>
        <Card variant="filled" className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Activos
            </p>
            <p className="text-2xl font-bold text-foreground">{activos}</p>
          </div>
        </Card>
        <Card variant="filled" className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <XCircle className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Inactivos
            </p>
            <p className="text-2xl font-bold text-foreground">{inactivos}</p>
          </div>
        </Card>
      </div>

      {/* Tabla de Empleados */}
      <DataTable<EmpleadoListItem>
        storageKey="empleados-list-table"
        data={empleados}
        columns={columns}
        getRowId={(e) => e.id}
        loading={loading}
        searchPlaceholder="Buscar por nombre, apellido o DNI"
        emptyMessage="No se encontraron empleados"
        renderActions={(e) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/empleados/${e.id}`)}
            >
              Ver detalle
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Editar empleado"
              onClick={() => router.push(`/dashboard/empleados/${e.id}?edit=true`)}
            >
              <Edit className="size-4" />
            </Button>
            {e.estado === "Activo" && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Dar de baja"
                onClick={() => {
                  setEmpleadoParaBaja(e);
                  setMotivoBaja("");
                  setBajaError(null);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )}
      />

      {/* Diálogo de Baja con Motivo */}
      <Dialog
        open={Boolean(empleadoParaBaja)}
        onOpenChange={(open) => {
          if (!open) {
            setEmpleadoParaBaja(null);
            setMotivoBaja("");
            setBajaError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dar de baja empleado</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea dar de baja al empleado{" "}
              <strong>
                {empleadoParaBaja?.nombre} {empleadoParaBaja?.apellido}
              </strong>{" "}
              (DNI {empleadoParaBaja?.dni})? Ingrese el motivo correspondiente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmarBaja} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="motivoBaja">Motivo de la baja</Label>
              <Input
                id="motivoBaja"
                placeholder="Ej. Renuncia voluntaria, fin de contrato..."
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                required
                autoFocus
              />
              {bajaError && <p className="text-xs text-destructive">{bajaError}</p>}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                disabled={bajaLoading}
                onClick={() => setEmpleadoParaBaja(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="filled"
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={bajaLoading}
              >
                {bajaLoading ? "Procesando..." : "Confirmar baja"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
