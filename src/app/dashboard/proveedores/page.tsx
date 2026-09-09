"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit2, UserX, UserCheck } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Fab } from "@/components/ui/fab";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  type ProveedorListItem,
} from "./schema";
import {
  obtenerProveedores,
  darDeBajaProveedor,
  reactivarProveedor,
} from "./actions";

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

  const columns: Column<ProveedorListItem>[] = [
    {
      key: "razonSocial",
      header: "Razón Social / Nombre",
      accessor: (p) => p.razonSocial,
      searchable: true,
      className: "font-medium text-foreground",
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
      accessor: (p) => p.telefonos.join(", ") || "-",
    },
    {
      key: "estado",
      header: "Estado",
      accessor: (p) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            p.estado === "Activo"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {p.estado}
        </span>
      ),
      filterable: true,
      filterOptions: [
        { value: "Todos", label: "Todos" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
      ],
      filterAccessor: (p) => p.estado,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-container-lowest">
      <div className="flex-1 flex flex-col min-h-0 px-4 md:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Proveedores
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Gestión de convenios, profesionales y servicios prestados.
            </p>
          </div>

          <div className="hidden sm:block">
            <Button asChild>
              <Link href="/dashboard/proveedores/nuevo">
                <Plus className="size-4" />
                <span>Nuevo Proveedor</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <DataTable<ProveedorListItem>
            storageKey="proveedores-table"
            data={proveedores}
            columns={columns}
            getRowId={(p) => p.id}
            loading={loading}
            searchPlaceholder="Buscar por razón social, CUIT o prestación..."
            emptyMessage={loading ? "Cargando proveedores..." : "No se encontraron proveedores"}
            onRowClick={(p) => router.push(`/dashboard/proveedores/${p.id}`)}
            renderActions={(p) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Ver detalle"
                  title="Ver detalle"
                  onClick={() => router.push(`/dashboard/proveedores/${p.id}`)}
                >
                  <Eye className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Editar"
                  title="Editar"
                  onClick={() => router.push(`/dashboard/proveedores/nuevo?edit=${p.id}`)}
                >
                  <Edit2 className="size-4" />
                </Button>
                {p.estado === "Activo" ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Dar de baja"
                    title="Dar de baja"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedProveedor(p);
                      setDialogAction("baja");
                    }}
                  >
                    <UserX className="size-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Reactivar"
                    title="Reactivar"
                    className="text-primary hover:text-primary"
                    onClick={() => {
                      setSelectedProveedor(p);
                      setDialogAction("reactivar");
                    }}
                  >
                    <UserCheck className="size-4" />
                  </Button>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* FAB flotante para móvil */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <Fab
          icon={<Plus className="size-6" />}
          aria-label="Nuevo Proveedor"
          onClick={() => router.push("/dashboard/proveedores/nuevo")}
        />
      </div>

      {/* Diálogo de Confirmación para Baja / Reactivación */}
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
            ? "Confirmar Baja de Proveedor"
            : "Confirmar Reactivación de Proveedor"
        }
        description={
          dialogAction === "baja"
            ? `¿Está seguro de que desea dar de baja al proveedor "${selectedProveedor?.razonSocial}"?`
            : `¿Está seguro de que desea reactivar al proveedor "${selectedProveedor?.razonSocial}"?`
        }
        confirmText={dialogAction === "baja" ? "Dar de baja" : "Reactivar"}
        variant={dialogAction === "baja" ? "destructive" : "primary"}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
      />
    </div>
  );
}
