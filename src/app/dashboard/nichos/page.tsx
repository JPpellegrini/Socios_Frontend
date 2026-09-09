"use client";

import * as React from "react";
import { Landmark, CheckCircle2, XCircle } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { type NichoItem } from "./schema";
import { obtenerNichos } from "./actions";

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
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            n.ocupado
              ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
          }`}
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
            {n.socio.apellido}, {n.socio.nombre}
          </span>
        ) : (
          <span className="text-on-surface-variant italic">Sin asignar</span>
        ),
      searchable: true,
      searchAccessor: (n) =>
        n.socio ? `${n.socio.nombre} ${n.socio.apellido} ${n.socio.apellido} ${n.socio.nombre}` : "",
    },
    {
      key: "valorNicho",
      header: "Valor Nicho",
      accessor: (n) => formatCurrency(n.valorNicho),
      className: "tabular-nums",
    },
    {
      key: "valorLapida",
      header: "Valor Lápida",
      accessor: (n) => formatCurrency(n.valorLapida),
      className: "tabular-nums",
    },
    {
      key: "cuotas",
      header: "Financiación",
      accessor: (n) =>
        n.cuotas > 0
          ? `${n.cuotas} cuotas (${(n.interes * 100).toFixed(0)}% int.)`
          : "Contado",
      className: "text-xs text-on-surface-variant",
    },
  ];

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Nichos y Panteón</h1>

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
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <XCircle className="size-6" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Ocupados / Concesionados</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{ocupados}</p>
          </div>
        </Card>

        <Card variant="outlined" className="p-4 bg-background flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
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
    </div>
  );
}
