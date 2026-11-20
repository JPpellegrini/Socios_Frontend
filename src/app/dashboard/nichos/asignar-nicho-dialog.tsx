"use client";

import * as React from "react";
import { AlertCircle, Search, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type NichoItem,
  type SocioAsignableNicho,
  type NichoSimulacionCuotas,
} from "./schema";
import {
  buscarSociosAsignablesNicho,
  asignarNicho,
  simularCuotasNicho,
} from "./actions";

function getDefaultPrimerVencimiento(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0] ?? "";
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface AsignarNichoDialogProps {
  open: boolean;
  nicho: NichoItem | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AsignarNichoDialog({
  open,
  nicho,
  onOpenChange,
  onSuccess,
}: AsignarNichoDialogProps) {
  const [busquedaSocio, setBusquedaSocio] = React.useState("");
  const [sociosElegibles, setSociosElegibles] = React.useState<SocioAsignableNicho[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = React.useState<SocioAsignableNicho | null>(null);
  const [buscandoSocios, setBuscandoSocios] = React.useState(false);

  // Formulario
  const [valorTotal, setValorTotal] = React.useState("50000");
  const [cuotas, setCuotas] = React.useState("1");
  const [interes, setInteres] = React.useState("0");
  const [primerVencimiento, setPrimerVencimiento] = React.useState(getDefaultPrimerVencimiento);
  const [conLapida, setConLapida] = React.useState<"SI" | "NO">("NO");
  const [valorLapida, setValorLapida] = React.useState("0");

  // Flujo de resumen previo
  const [paso, setPaso] = React.useState<"formulario" | "resumen">("formulario");
  const [simulacion, setSimulacion] = React.useState<NichoSimulacionCuotas | null>(null);
  const [simulando, setSimulando] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Cargar socios al abrir o buscar
  const cargarSocios = React.useCallback(async (query = "") => {
    setBuscandoSocios(true);
    try {
      const data = await buscarSociosAsignablesNicho(query);
      setSociosElegibles(data);
    } catch {
      setSociosElegibles([]);
    } finally {
      setBuscandoSocios(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      cargarSocios();
      setPaso("formulario");
      setSimulacion(null);
      if (nicho) {
        setValorTotal(String(nicho.valorNicho || 50000));
        setCuotas(String(nicho.cuotas && nicho.cuotas > 0 ? nicho.cuotas : 1));
        setInteres(String(nicho.interes || 0));
        setPrimerVencimiento(getDefaultPrimerVencimiento());
        setConLapida(nicho.conLapida ? "SI" : "NO");
        setValorLapida(String(nicho.valorLapida || 0));
      }
    } else {
      setSocioSeleccionado(null);
      setBusquedaSocio("");
      setPaso("formulario");
      setSimulacion(null);
      setErrorMsg(null);
    }
  }, [open, nicho, cargarSocios]);

  const handleBuscarSocio = (e: React.FormEvent) => {
    e.preventDefault();
    cargarSocios(busquedaSocio);
  };

  const handleClose = () => {
    setSocioSeleccionado(null);
    setBusquedaSocio("");
    setPaso("formulario");
    setSimulacion(null);
    setErrorMsg(null);
    onOpenChange(false);
  };

  const validarFormulario = (): {
    valorTotalNum: number;
    cuotasNum: number;
    interesNum: number;
    valorLapidaNum: number;
  } | null => {
    if (!socioSeleccionado) {
      setErrorMsg("Debe seleccionar un socio activo titular.");
      return null;
    }

    const valorTotalNum = Number(valorTotal);
    const cuotasNum = Number(cuotas);
    const interesNum = Number(interes);
    const valorLapidaNum = Number(valorLapida);

    if (isNaN(valorTotalNum) || valorTotalNum < 0) {
      setErrorMsg("El valor del nicho no puede ser negativo.");
      return null;
    }
    if (isNaN(cuotasNum) || cuotasNum < 1) {
      setErrorMsg("La cantidad de cuotas debe ser al menos 1.");
      return null;
    }
    if (isNaN(interesNum) || interesNum < 0) {
      setErrorMsg("El interés no puede ser negativo.");
      return null;
    }
    const today = new Date().toISOString().split("T")[0] ?? "";
    if (!primerVencimiento || primerVencimiento <= today) {
      setErrorMsg("La fecha del primer vencimiento debe ser posterior a hoy.");
      return null;
    }
    if (conLapida === "SI" && (isNaN(valorLapidaNum) || valorLapidaNum <= 0)) {
      setErrorMsg("El valor de la lápida debe ser mayor a 0 cuando lleva lápida.");
      return null;
    }

    return { valorTotalNum, cuotasNum, interesNum, valorLapidaNum };
  };

  const handleRevisarResumen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicho) return;

    const datos = validarFormulario();
    if (!datos) return;

    setSimulando(true);
    setErrorMsg(null);

    try {
      const res = await simularCuotasNicho({
        valorTotal: datos.valorTotalNum,
        cuotas: datos.cuotasNum,
        interesPorCuota: datos.interesNum,
        primerVencimiento,
        conLapida,
        valorLapida: conLapida === "SI" ? datos.valorLapidaNum : 0,
      });

      if (res.success && res.simulacion) {
        setSimulacion(res.simulacion);
        setPaso("resumen");
      } else {
        setErrorMsg(res.mensaje || "Error al calcular el resumen de financiación.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al simular.";
      setErrorMsg(msg);
    } finally {
      setSimulando(false);
    }
  };

  const handleConfirmarAsignacion = async () => {
    if (!nicho || !socioSeleccionado) return;

    const datos = validarFormulario();
    if (!datos) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await asignarNicho({
        idNicho: Number(nicho.id),
        idEntidad: socioSeleccionado.idEntidad,
        valorTotal: datos.valorTotalNum,
        cuotas: datos.cuotasNum,
        interesPorCuota: datos.interesNum,
        primerVencimiento,
        conLapida,
        valorLapida: conLapida === "SI" ? datos.valorLapidaNum : 0,
      });

      if (res.success) {
        handleClose();
        onSuccess();
      } else {
        setErrorMsg(res.mensaje || "Error al asignar el nicho.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al asignar.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? handleClose() : onOpenChange(true))}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {paso === "formulario" ? (
          <form onSubmit={handleRevisarResumen}>
            <DialogHeader>
              <DialogTitle>Asignar Nicho #{nicho?.nroNicho} ({nicho?.sector})</DialogTitle>
              <DialogDescription>
                Seleccione el socio titular (activo con sepelio) y configure los valores de concesión.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

          <div className="space-y-4 py-4">
            {/* Buscador de Socio */}
            <div className="space-y-2">
              <Label>Socio Titular</Label>
              {socioSeleccionado ? (
                <div className="p-3 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {socioSeleccionado.apellido}, {socioSeleccionado.nombre}
                      </p>
                      <p className="text-xs text-on-surface-variant font-mono">
                        DNI: {socioSeleccionado.dni}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSocioSeleccionado(null)}
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    Cambiar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Buscar por nombre, apellido o DNI..."
                      value={busquedaSocio}
                      onChange={(e) => setBusquedaSocio(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBuscarSocio}
                      disabled={buscandoSocios}
                    >
                      <Search className="size-4" />
                    </Button>
                  </div>

                  <div className="max-h-36 overflow-y-auto rounded-lg border border-outline-variant divide-y divide-outline-variant">
                    {buscandoSocios ? (
                      <p className="p-3 text-xs text-on-surface-variant text-center">
                        Buscando socios elegibles...
                      </p>
                    ) : sociosElegibles.length === 0 ? (
                      <p className="p-3 text-xs text-on-surface-variant text-center">
                        No se encontraron socios activos con sepelio.
                      </p>
                    ) : (
                      sociosElegibles.map((socio) => (
                        <button
                          key={socio.idEntidad}
                          type="button"
                          onClick={() => setSocioSeleccionado(socio)}
                          className="w-full p-2.5 text-left text-xs hover:bg-surface-container flex items-center justify-between transition-colors"
                        >
                          <span className="font-medium text-foreground">
                            {socio.apellido}, {socio.nombre}
                          </span>
                          <span className="font-mono text-on-surface-variant">
                            DNI: {socio.dni}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Valores Financieros */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="valor-nicho">Valor del Nicho ($)</Label>
                <Input
                  id="valor-nicho"
                  type="number"
                  min="0"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cuotas-nicho">Cuotas</Label>
                <Input
                  id="cuotas-nicho"
                  type="number"
                  min="1"
                  value={cuotas}
                  onChange={(e) => setCuotas(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="interes-nicho">Interés Mensual (%)</Label>
                <Input
                  id="interes-nicho"
                  type="number"
                  step="0.1"
                  min="0"
                  value={interes}
                  onChange={(e) => setInteres(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="primer-vencimiento">Primer Vencimiento</Label>
                <Input
                  id="primer-vencimiento"
                  type="date"
                  value={primerVencimiento}
                  onChange={(e) => setPrimerVencimiento(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Lápida */}
            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="space-y-1.5">
                <Label htmlFor="con-lapida">¿Lleva Lápida?</Label>
                <Select
                  value={conLapida}
                  onValueChange={(val: "SI" | "NO") => setConLapida(val)}
                >
                  <SelectTrigger id="con-lapida">
                    <SelectValue placeholder="Seleccione opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">No</SelectItem>
                    <SelectItem value="SI">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {conLapida === "SI" && (
                <div className="space-y-1.5">
                  <Label htmlFor="valor-lapida">Valor Lápida ($)</Label>
                  <Input
                    id="valor-lapida"
                    type="number"
                    min="1"
                    value={valorLapida}
                    onChange={(e) => setValorLapida(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={simulando}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="default" disabled={simulando}>
              {simulando ? "Calculando..." : "Revisar Resumen"}
            </Button>
          </DialogFooter>
        </form>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Confirmar Asignación — Nicho #{nicho?.nroNicho} ({nicho?.sector})</DialogTitle>
              <DialogDescription>
                Verifique los datos antes de confirmar la concesión y generar las cuotas.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Socio Titular</span>
                <span className="font-semibold text-foreground text-right">
                  {socioSeleccionado?.apellido}, {socioSeleccionado?.nombre} (DNI: {socioSeleccionado?.dni})
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Valor del Nicho</span>
                <span className="font-medium tabular-nums">{formatCurrency(Number(valorTotal) || 0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">¿Lleva Lápida?</span>
                <span className="font-medium tabular-nums">
                  {conLapida === "SI" ? `Sí (${formatCurrency(Number(valorLapida) || 0)})` : "No"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Cantidad de Cuotas</span>
                <span className="font-medium">{simulacion?.cantidadCuotas ?? Number(cuotas)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Interés Mensual</span>
                <span className="font-medium">{simulacion?.interesPorCuota ?? Number(interes)}%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Primer Vencimiento</span>
                <span className="font-medium font-mono">{primerVencimiento}</span>
              </div>
              <div className="border-t border-outline-variant pt-2.5 flex justify-between gap-4">
                <span className="font-semibold text-foreground">Valor de cada cuota (con interés)</span>
                <span className="font-bold text-primary tabular-nums">
                  {formatCurrency(simulacion?.montoCuota ?? 0)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-foreground">Total a pagar</span>
                <span className="font-bold text-foreground tabular-nums">
                  {formatCurrency(simulacion?.totalAPagar ?? 0)}
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setErrorMsg(null);
                  setPaso("formulario");
                }}
                disabled={loading}
              >
                Volver
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleConfirmarAsignacion}
                disabled={loading}
              >
                {loading ? "Asignando..." : "Confirmar Asignación"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
