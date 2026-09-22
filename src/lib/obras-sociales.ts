export interface ObraSocial {
  id: string;
  nombre: string;
}

export const MOCK_OBRAS_SOCIALES: ObraSocial[] = [
  { id: "1", nombre: "PAMI" },
  { id: "2", nombre: "IAPOS" },
  { id: "3", nombre: "OSDE" },
  { id: "4", nombre: "Jerárquicos Salud" },
];

export function findObraSocialIdByName(nombre?: string): number | undefined {
  if (!nombre) return undefined;
  const found = MOCK_OBRAS_SOCIALES.find(
    (o) => o.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  return found ? Number(found.id) : undefined;
}
