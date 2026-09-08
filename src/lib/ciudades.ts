export interface Ciudad {
  id: string;
  nombre: string;
}

export const MOCK_CIUDADES: Ciudad[] = [
  { id: "1", nombre: "Buenos Aires" },
  { id: "2", nombre: "Córdoba" },
  { id: "3", nombre: "Rosario" },
  { id: "4", nombre: "Santa Fe" },
  { id: "5", nombre: "Paraná" },
  { id: "6", nombre: "Rafaela" },
  { id: "7", nombre: "Venado Tuerto" },
  { id: "8", nombre: "Firmat" },
  { id: "9", nombre: "Cañada de Gómez" },
];

export function findCiudadIdByName(nombre?: string): number {
  if (!nombre) return 1;
  const found = MOCK_CIUDADES.find(
    (c) => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  return found ? Number(found.id) : 1;
}
