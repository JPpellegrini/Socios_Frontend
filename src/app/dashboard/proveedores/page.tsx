"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, UserCheck } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { fabVariants } from "@/components/ui/fab";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { type ProveedorListItem } from "./schema";
import {
  obtenerProveedores,
  darDeBajaProveedor,
  reactivarProveedor,
} from "./actions";

const ESTADO_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

export default function ProveedoresPage() {
  const router = useRouter();
  const [proveedores, setProveedores] = React.useState<ProveedorListItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Confirm dialog state
  const [dialogAction, setDialogAction] = React.useState<"baja" | "reactivar" | null>(null);
  const [selectedProveedor, setSelectedProveedor] = React.useState<ProveedorListItem | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const cargarProveedores = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch {
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const handleConfirmAction = async () => {
    if (!selectedProveedor || !dialogAction) return;
    setActionLoading(true);

    try {
      if (dialogAction === "baja") {
        await darDeBajaProveedor(selectedProveedor.id);
      } else {
        await reactivarProveedor(selectedProveedor.id);
      }
      await cargarProveedores();
    } finally {
      setActionLoading(false);
      setSelectedProveedor(null);
      setDialogAction(null);
    }
  };

  const columns: Column<ProveedorListItem>[] = React.useMemo(
    () => [
      {
        key: "razonSocial",
        header: "Razón Social / Nombre",
        accessor: (p) => p.razonSocial,
        searchable: true,
      },
      {
        key: "cuitCuil",
        header: "CUIT / CUIL",
        accessor: (p) => p.cuitCuil,
        searchable: true,
      },
      {
        key: "prestacion",
        header: "Prestación / Servicio",
        accessor: (p) => p.prestacion,
        searchable: true,
      },
      {
        key: "telefonos",
        header: "Teléfono",
        accessor: (p) => p.telefonos.join(", ") || "—",
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (p) => (
          <span
            className={cn(
              "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
              p.estado === "Activo"
                ? "bg-primary-container text-on-primary-container"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {p.estado}
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
    <div className="relative h-full p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Listado de Proveedores</h1>

      <DataTable<ProveedorListItem>
        storageKey="proveedores-list"
        data={proveedores}
        columns={columns}
        getRowId={(p) => p.id}
        searchPlaceholder="Buscar por razón social, CUIT o prestación..."
        loading={loading}
        emptyMessage="No se encontraron proveedores"
        onRowClick={(p) => router.push(`/dashboard/proveedores/${p.id}`)}
        renderActions={(p) =>
          p.estado === "Inactivo" ? (
            <Button
              variant="ghost"
              size="icon"
              title="Reactivar"
              aria-label="Reactivar"
              onClick={() => {
                setSelectedProveedor(p);
                setDialogAction("reactivar");
              }}
            >
              <UserCheck />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                title="Editar"
                aria-label="Editar"
                onClick={() =>
                  router.push(`/dashboard/proveedores/nuevo?edit=${p.id}`)
                }
              >
                <Edit />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Dar de baja"
                aria-label="Dar de baja"
                className="text-destructive"
                onClick={() => {
                  setSelectedProveedor(p);
                  setDialogAction("baja");
                }}
              >
                <Trash2 />
              </Button>
            </>
          )
        }
      />

      <Link
        href="/dashboard/proveedores/nuevo"
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo proveedor"
      >
        <Plus />
      </Link>

      <ConfirmDialog
        open={dialogAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialogAction(null);
            setSelectedProveedor(null);
          }
        }}
        title={
          dialogAction === "baja"
            ? "¿Dar de baja proveedor?"
            : "¿Reactivar proveedor?"
        }
        description={
          dialogAction === "baja"
            ? `¿Está seguro de que desea dar de baja al proveedor "${selectedProveedor?.razonSocial}"? Esta acción no se puede deshacer.`
            : `¿Está seguro de que desea reactivar al proveedor "${selectedProveedor?.razonSocial}"?`
        }
        confirmText={dialogAction === "baja" ? "Dar de baja" : "Reactivar"}
        cancelText="Cancelar"
        variant={dialogAction === "baja" ? "destructive" : "primary"}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
      />
    </div>
  );
}
