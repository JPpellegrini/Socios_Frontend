"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Phone, Mail, MapPin, Briefcase, FileText, Calendar } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { type ProveedorDetalle } from "../schema";
import { obtenerProveedorDetalle } from "../actions";

export default function ProveedorDetallePage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [proveedor, setProveedor] = React.useState<ProveedorDetalle | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;

    let cancelled = false;
    obtenerProveedorDetalle(id)
      .then((data) => {
        if (!cancelled) setProveedor(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-container-lowest">
        <p className="text-on-surface-variant animate-pulse">Cargando información del proveedor...</p>
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-container-lowest space-y-4">
        <p className="text-lg font-medium text-foreground">Proveedor no encontrado</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/proveedores">Volver al listado</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 bg-surface-container-lowest p-4 md:p-8 pb-16 flex justify-center items-start">
      <Card variant="outlined" className="w-full max-w-4xl p-6 md:p-10 mb-8 bg-background space-y-8">
        {/* Header con botón atrás, título y botón editar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/proveedores" aria-label="Volver">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {proveedor.razonSocial}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    proveedor.estado === "Activo"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {proveedor.estado}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                CUIT/CUIL: {proveedor.cuitCuil || "Sin registrar"}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/proveedores/nuevo?edit=${proveedor.id}`)}
          >
            <Edit2 className="size-4" />
            <span>Editar Proveedor</span>
          </Button>
        </div>

        {/* Grilla de Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Datos Comerciales y Prestación */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Briefcase className="size-5 text-primary" />
              <span>Servicios y Prestaciones</span>
            </h2>

            <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Prestación / Servicio</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {proveedor.prestacion || "No especificada"}
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant font-medium">Fecha de Inicio / Nacimiento</p>
                <p className="text-sm font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                  <Calendar className="size-4 text-on-surface-variant" />
                  {proveedor.fechaNacimiento || "No registrada"}
                </p>
              </div>
            </div>
          </div>

          {/* Domicilio */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <MapPin className="size-5 text-primary" />
              <span>Domicilio</span>
            </h2>

            <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Ciudad</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {proveedor.ciudad || "No registrada"}
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant font-medium">Dirección</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {proveedor.calle ? `${proveedor.calle} ${proveedor.altura}` : "No registrada"}
                </p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Phone className="size-5 text-primary" />
              <span>Información de Contacto</span>
            </h2>

            <div className="bg-surface-container-low p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-on-surface-variant font-medium mb-2">Teléfonos</p>
                <div className="flex flex-wrap gap-2">
                  {proveedor.telefonos.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">Sin teléfonos registrados</p>
                  ) : (
                    proveedor.telefonos.map((tel, idx) => (
                      <Chip key={idx} variant="assist">
                        <Phone className="size-3.5 mr-1" />
                        {tel}
                      </Chip>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant font-medium mb-2">Correos Electrónicos</p>
                <div className="flex flex-wrap gap-2">
                  {proveedor.emails.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">Sin correos registrados</p>
                  ) : (
                    proveedor.emails.map((mail, idx) => (
                      <Chip key={idx} variant="assist">
                        <Mail className="size-3.5 mr-1" />
                        {mail}
                      </Chip>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {proveedor.observaciones && (
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <FileText className="size-5 text-primary" />
                <span>Observaciones</span>
              </h2>
              <div className="bg-surface-container-low p-4 rounded-xl">
                <p className="text-sm text-foreground whitespace-pre-wrap">{proveedor.observaciones}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
