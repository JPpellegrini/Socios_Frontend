"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { type ProveedorDetalle } from "../schema";
import { obtenerProveedorDetalle } from "../actions";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="filled">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {children}
      </CardContent>
    </Card>
  );
}

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold tracking-widest text-on-surface-variant/60 mb-1.5">{label}</p>
      <p className="text-base font-medium text-foreground break-words">{value || "—"}</p>
    </div>
  );
}

export function ProveedorDetalleCard({ proveedor }: { proveedor: ProveedorDetalle }) {
  return (
    <div className="space-y-8 mb-8">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <CardTitle className="text-3xl">
                {proveedor.razonSocial}
              </CardTitle>
              <p className="text-base text-on-surface-variant">
                CUIT/CUIL: {proveedor.cuitCuil || "—"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <FieldRow label="ID" value={String(proveedor.id)} />
            <FieldRow label="Estado" value={proveedor.estado} />
            <FieldRow label="Fecha de Inicio / Nacimiento" value={proveedor.fechaNacimiento} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionCard title="Dirección">
          <FieldRow label="Ciudad" value={proveedor.ciudad} />
          <FieldRow label="Calle" value={proveedor.calle} />
          <FieldRow label="Altura" value={proveedor.altura} />
        </SectionCard>

        <SectionCard title="Servicios y Prestaciones">
          <FieldRow label="Prestación / Servicio" value={proveedor.prestacion} />
        </SectionCard>
      </div>

      <Separator />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {proveedor.telefonos && proveedor.telefonos.length > 0 ? (
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant/60">Teléfonos</p>
            {proveedor.telefonos.map((tel, i) => (
              <p key={i} className="text-base font-medium text-foreground break-words">{tel}</p>
            ))}
          </div>
        ) : (
          <FieldRow label="Teléfonos" value={null} />
        )}
        {proveedor.emails && proveedor.emails.length > 0 ? (
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant/60">Correos Electrónicos</p>
            {proveedor.emails.map((correo, i) => (
              <p key={i} className="text-base font-medium text-foreground break-words">{correo}</p>
            ))}
          </div>
        ) : (
          <FieldRow label="Correos Electrónicos" value={null} />
        )}
      </section>

      {proveedor.observaciones && (
        <SectionCard title="Observaciones">
          <FieldRow label="Observaciones" value={proveedor.observaciones} />
        </SectionCard>
      )}
    </div>
  );
}

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

  return (
    <div className="relative min-h-full p-4 md:p-8 pb-16">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon-lg" onClick={() => router.back()} aria-label="Volver">
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Detalle del Proveedor</h1>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="rounded-card bg-surface-container-lowest border border-outline-variant p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-7 w-20 rounded-[8px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-32 rounded-[8px]" />
              <Skeleton className="h-7 w-20 rounded-[8px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-card bg-surface-container-lowest border border-outline-variant p-6 space-y-4">
                <Skeleton className="h-5 w-36" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : proveedor ? (
        <ProveedorDetalleCard proveedor={proveedor} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <p className="text-lg font-medium text-on-surface-variant">Proveedor no encontrado</p>
          <p className="text-sm text-on-surface-variant/60 mt-1">El proveedor solicitado no existe o ha sido eliminado.</p>
          <Button variant="outline" className="mt-6" onClick={() => router.back()}>
            Volver al listado
          </Button>
        </div>
      )}
    </div>
  );
}
