export interface EntidadListItem {
  id: string;
  cuitCuil: string;
  nombre: string;
  apellido: string;
  razonSocial: string | null;
  sexo: string;
  fechaNacimiento: string;
  tipo: "Física" | "Jurídica";
}

export interface EntidadDetalle {
  id: string;
  cuitCuil: string;
  nombre: string;
  apellido: string;
  razonSocial: string | null;
  sexo: string;
  fechaNacimiento: string;
  ciudad: string;
  calle: string;
  altura: string;
  observaciones?: string;
  tipo: "Física" | "Jurídica";
}
