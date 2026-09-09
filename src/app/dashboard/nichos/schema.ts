export interface NichoSocio {
  id: string;
  nombre: string;
  apellido: string;
}

export interface NichoItem {
  id: string;
  nroNicho: number;
  sector: string;
  ocupado: boolean;
  valorNicho: number;
  valorLapida: number;
  cuotas: number;
  interes: number;
  socio: NichoSocio | null;
}

export interface NichoFiltros {
  nombre?: string;
  apellido?: string;
}
