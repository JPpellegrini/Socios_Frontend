"use client";

import * as React from "react";
import { Edit, Plus, Trash2, UserCheck } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { fabVariants } from "@/components/ui/fab";
import { cn } from "@/lib/utils";
import { type PrestacionItem } from "./schema";
import {
  obtenerPrestaciones,
  darDeBajaPrestacion,
  reactivarPrestacion,
} from "./actions";
import { PrestacionDialog } from "./prestacion-dialog";

const TIPO_OPTIONS = [
  { value: "Todos", label: "Todos los tipos" },
  { value: "PRESTACION", label: "Prestación" },
  { value: "COLABORACION", label: "Colaboración" },
];

const ESTADO_OPTIONS = [
  { value: "Todos", label: "Todos los estados" },
  { value: "ACTIVA", label: "Activa" },
  { value: "INACTIVA", label: "Inactiva" },
];

export default function PrestacionesPage() {
  const [prestaciones, setPrestaciones] = React.useState<PrestacionItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [prestacionParaEditar, setPrestacionParaEditar] =
    React.useState<PrestacionItem | null>(null);
  const [confirmTarget, setConfirmTarget] = React.useState<{
    item: PrestacionItem;
    action: "baja" | "reactivar";
  } | null>(null);
  const [procesandoConfirm, setProcesandoConfirm] = React.useState(false);

  const cargarPrestaciones = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerPrestaciones({ estado: "TODOS" });
      setPrestaciones(data);
    } catch {
      setPrestaciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarPrestaciones();
  }, [cargarPrestaciones]);

  const handleConfirmAction = async () => {
    if (!confirmTarget) return;

    setProcesandoConfirm(true);
    try {
      const res =
        confirmTarget.action === "baja"
          ? await darDeBajaPrestacion(confirmTarget.item.idPrestacion)
          : await reactivarPrestacion(confirmTarget.item.idPrestacion);

      if (res.success) {
        setConfirmTarget(null);
        await cargarPrestaciones();
      }
    } finally {
      setProcesandoConfirm(false);
    }
  };

  const totalPrestaciones = prestaciones.length;
  const activas = prestaciones.filter((p) => p.estado === "ACTIVA").length;
  const inactivas = totalPrestaciones - activas;

  const columns: Column<PrestacionItem>[] = React.useMemo(
    () => [
      {
        key: "idPrestacion",
        header: "ID",
        accessor: (p) => <span className="font-mono font-medium">#{p.idPrestacion}</span>,
      },
      {
        key: "nombre",
        header: "Nombre",
        accessor: (p) => (
          <span className="font-semibold text-foreground">{p.nombre}</span>
        ),
        searchable: true,
        searchAccessor: (p) => p.nombre,
      },
      {
        key: "tipo",
        header: "Tipo",
        accessor: (p) => (
          <span className="text-sm text-on-surface-variant">
            {p.tipo === "COLABORACION" ? "Colaboración" : "Prestación"}
          </span>
        ),
        filterable: true,
        filterOptions: TIPO_OPTIONS,
        filterAccessor: (p) => p.tipo,
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (p) => (
          <span
            className={cn(
              "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
              p.estado === "ACTIVA"
                ? "bg-primary-container text-on-primary-container"
                : "bg-destructive text-white font-medium"
            )}
          >
            {p.estado === "ACTIVA" ? "Activa" : "Inactiva"}
          </span>
        ),
        filterable: true,
        filterOptions: ESTADO_OPTIONS,
        filterAccessor: (p) => p.estado,
      },
    ],
    []
  );

  return (
    <div className="relative h-full p-4 md:p-8 pb-24 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Prestaciones</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-rose-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{totalPrestaciones}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Total Prestaciones</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-sky-500 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{activas}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Activas</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-violet-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{inactivas}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Inactivas</p>
        </Card>
      </div>

      {/* Tabla de Prestaciones */}
      <DataTable<PrestacionItem>
        storageKey="prestaciones-table"
        data={prestaciones}
        columns={columns}
        getRowId={(p) => p.id}
        loading={loading}
        searchPlaceholder="Buscar prestación por nombre..."
        emptyMessage={loading ? "Cargando prestaciones..." : "No se encontraron prestaciones"}
        renderActions={(p) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              title="Editar prestación"
              aria-label={`Editar prestación ${p.nombre}`}
              onClick={() => {
                setPrestacionParaEditar(p);
                setDialogOpen(true);
              }}
            >
              <Edit className="size-4" />
            </Button>
            {p.estado === "ACTIVA" ? (
              <Button
                variant="ghost"
                size="icon"
                title="Dar de baja"
                aria-label={`Dar de baja prestación ${p.nombre}`}
                className="text-destructive"
                onClick={() => setConfirmTarget({ item: p, action: "baja" })}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title="Reactivar prestación"
                aria-label={`Reactivar prestación ${p.nombre}`}
                onClick={() => setConfirmTarget({ item: p, action: "reactivar" })}
              >
                <UserCheck className="size-4" />
              </Button>
            )}
          </>
        )}
      />

      <button
        type="button"
        onClick={() => {
          setPrestacionParaEditar(null);
          setDialogOpen(true);
        }}
        className={cn(
          fabVariants({ variant: "primary", size: "default" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nueva prestación"
      >
        <Plus />
      </button>

      <PrestacionDialog
        open={dialogOpen}
        prestacion={prestacionParaEditar}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setPrestacionParaEditar(null);
        }}
        onSuccess={cargarPrestaciones}
      />

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
        title={
          confirmTarget?.action === "baja"
            ? "Dar de baja prestación"
            : "Reactivar prestación"
        }
        description={
          confirmTarget?.action === "baja"
            ? `¿Está seguro de que desea dar de baja la prestación "${confirmTarget.item.nombre}"? Dejará de ofrecerse para nuevas asignaciones.`
            : `¿Está seguro de que desea reactivar la prestación "${confirmTarget?.item.nombre}"?`
        }
        confirmText={confirmTarget?.action === "baja" ? "Dar de baja" : "Reactivar"}
        variant={confirmTarget?.action === "baja" ? "destructive" : "primary"}
        loading={procesandoConfirm}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
