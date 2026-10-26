"use client";

import * as React from "react";
import { Landmark, CheckCircle2, XCircle, Plus, Trash2, UserPlus } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { fabVariants } from "@/components/ui/fab";
import { cn } from "@/lib/utils";
import { type NichoItem } from "./schema";
import { obtenerNichos, darDeBajaNicho } from "./actions";
import { CrearNichoDialog } from "./crear-nicho-dialog";
import { AsignarNichoDialog } from "./asignar-nicho-dialog";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NichosPage() {
  const [nichos, setNichos] = React.useState<NichoItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modales
  const [modalCrearOpen, setModalCrearOpen] = React.useState(false);
  const [nichoParaAsignar, setNichoParaAsignar] = React.useState<NichoItem | null>(null);
  const [nichoParaEliminar, setNichoParaEliminar] = React.useState<NichoItem | null>(null);
  const [eliminando, setEliminando] = React.useState(false);

  const cargarNichos = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerNichos();
      setNichos(data);
    } catch {
      setNichos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarNichos();
  }, [cargarNichos]);

  const handleConfirmarBaja = async () => {
    if (!nichoParaEliminar) return;

    setEliminando(true);
    try {
      const res = await darDeBajaNicho(Number(nichoParaEliminar.id));
      if (res.success) {
        setNichoParaEliminar(null);
        await cargarNichos();
      }
    } finally {
      setEliminando(false);
    }
  };

  // Cálculos para tarjetas de métricas
  const totalNichos = nichos.length;
  const ocupados = nichos.filter((n) => n.ocupado).length;
  const disponibles = totalNichos - ocupados;

  const sectoresUnicos = React.useMemo(() => {
    const set = new Set(nichos.map((n) => n.sector).filter(Boolean));
    return Array.from(set).sort();
  }, [nichos]);

  const columns: Column<NichoItem>[] = [
    {
      key: "sector",
      header: "Sector",
      accessor: (n) => <span className="font-semibold text-foreground">Sector {n.sector}</span>,
      searchable: true,
      searchAccessor: (n) => `Sector ${n.sector}`,
      filterable: sectoresUnicos.length > 0,
      filterOptions: [
        { value: "Todos", label: "Todos los sectores" },
        ...sectoresUnicos.map((s) => ({ value: s, label: `Sector ${s}` })),
      ],
      filterAccessor: (n) => n.sector,
    },
    {
      key: "nroNicho",
      header: "N° Nicho",
      accessor: (n) => `#${n.nroNicho}`,
      searchable: true,
      searchAccessor: (n) => String(n.nroNicho),
      className: "font-mono font-medium",
    },
    {
      key: "ocupado",
      header: "Estado",
      accessor: (n) => (
        <span
          className={cn(
            "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
            n.ocupado
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface-variant text-on-surface-variant font-medium"
          )}
        >
          {n.ocupado ? "Ocupado" : "Disponible"}
        </span>
      ),
      filterable: true,
      filterOptions: [
        { value: "Todos", label: "Todos los estados" },
        { value: "Ocupado", label: "Ocupado" },
        { value: "Disponible", label: "Disponible" },
      ],
      filterAccessor: (n) => (n.ocupado ? "Ocupado" : "Disponible"),
    },
    {
      key: "socio",
      header: "Titular Asignado",
      accessor: (n) =>
        n.socio ? (
          <span className="font-medium text-foreground">
            {n.socio.apellido ? `${n.socio.apellido}, ${n.socio.nombre}` : n.socio.nombre}
          </span>
        ) : (
          <span className="text-on-surface-variant italic">Sin asignar</span>
        ),
      searchable: true,
      searchAccessor: (n) =>
        n.socio ? `${n.socio.nombre} ${n.socio.apellido}` : "",
    },
    {
      key: "valorNicho",
      header: "Valor Nicho",
      accessor: (n) => (n.valorNicho > 0 ? formatCurrency(n.valorNicho) : "-"),
      className: "tabular-nums",
    },
    {
      key: "valorLapida",
      header: "Valor Lápida",
      accessor: (n) => (n.valorLapida > 0 ? formatCurrency(n.valorLapida) : "-"),
      className: "tabular-nums",
    },
    {
      key: "cuotas",
      header: "Financiación",
      accessor: (n) =>
        n.cuotas > 0
          ? `${n.cuotas} cuotas (${(n.interes * 100).toFixed(0)}% int.)`
          : n.ocupado
          ? "Contado"
          : "-",
      className: "text-xs text-on-surface-variant",
    },
    {
      key: "acciones",
      header: "Acciones",
      accessor: (n) =>
        !n.ocupado ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNichoParaAsignar(n)}
              className="h-8 px-2 text-primary hover:bg-primary/10 gap-1"
              aria-label={`Asignar nicho ${n.nroNicho}`}
            >
              <UserPlus className="size-3.5" />
              <span className="text-xs font-medium">Asignar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNichoParaEliminar(n)}
              className="h-8 px-2 text-destructive hover:bg-destructive/10"
              aria-label={`Eliminar nicho ${n.nroNicho}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ) : (
          <span className="text-xs text-on-surface-variant/70 italic px-2">Concesionado</span>
        ),
    },
  ];

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Nichos</h1>

      {/* Tarjetas de Métricas M3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="outlined" className="p-4 bg-background flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Landmark className="size-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Total de Nichos</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{totalNichos}</p>
          </div>
        </Card>

        <Card variant="outlined" className="p-4 bg-background flex items-center gap-4">
          <div className="p-3 bg-primary-container/40 text-on-primary-container rounded-xl">
            <XCircle className="size-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Ocupados / Concesionados</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{ocupados}</p>
          </div>
        </Card>

        <Card variant="outlined" className="p-4 bg-background flex items-center gap-4">
          <div className="p-3 bg-surface-variant/40 text-on-surface-variant rounded-xl">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Disponibles</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{disponibles}</p>
          </div>
        </Card>
      </div>

      {/* Tabla de Nichos */}
      <DataTable<NichoItem>
        storageKey="nichos-table"
        data={nichos}
        columns={columns}
        getRowId={(n) => n.id}
        loading={loading}
        searchPlaceholder="Buscar por socio, número de nicho o sector..."
        emptyMessage={loading ? "Cargando nichos..." : "No se encontraron nichos"}
      />

      <button
        type="button"
        onClick={() => setModalCrearOpen(true)}
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo nicho"
      >
        <Plus />
      </button>

      {/* Modal de Creación */}
      <CrearNichoDialog
        open={modalCrearOpen}
        onOpenChange={setModalCrearOpen}
        onSuccess={cargarNichos}
      />

      {/* Modal de Asignación */}
      <AsignarNichoDialog
        open={nichoParaAsignar !== null}
        nicho={nichoParaAsignar}
        onOpenChange={(open) => !open && setNichoParaAsignar(null)}
        onSuccess={cargarNichos}
      />

      {/* Confirmación de Baja */}
      <ConfirmDialog
        open={nichoParaEliminar !== null}
        onOpenChange={(open) => !open && setNichoParaEliminar(null)}
        title="Eliminar Nicho"
        description={`¿Está seguro de que desea eliminar el nicho #${nichoParaEliminar?.nroNicho} del Sector ${nichoParaEliminar?.sector}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        loading={eliminando}
        onConfirm={handleConfirmarBaja}
      />
    </div>
  );
}
