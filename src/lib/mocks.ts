import type { SocioListItem, SocioDetalle } from "@/app/dashboard/socios/actions";
import { MOCK_CIUDADES } from "./ciudades";
import { MOCK_OBRAS_SOCIALES } from "./obras-sociales";

export const MOCK_USUARIO = {
  id_Usuario: 1,
  usuarioNombre: "CJR",
  estado: "Activo",
  id_Rol: 2,
  rolNombre: "Consultor",
  logueado: true,
  nombre: "CJR",
  rol: "Consultor",
};

export const MOCK_SOCIOS_BACKEND = [
  { idSocio: 1, nombre: "Juan", apellido: "Pérez", dni: "12345678", estado: "ACTIVO" },
  { idSocio: 2, nombre: "María", apellido: "Gómez", dni: "20123456", estado: "ACTIVO" },
  { idSocio: 3, nombre: "Carlos", apellido: "Rodríguez", dni: "34567890", estado: "INACTIVO" },
  { idSocio: 4, nombre: "Ana", apellido: "Martínez", dni: "45678901", estado: "ACTIVO" },
  { idSocio: 5, nombre: "Roberto", apellido: "López", dni: "20345678", estado: "ACTIVO" },
  { idSocio: 6, nombre: "Laura", apellido: "Fernández", dni: "56789012", estado: "INACTIVO" },
  { idSocio: 7, nombre: "Diego", apellido: "García", dni: "67890123", estado: "ACTIVO" },
  { idSocio: 8, nombre: "Patricia", apellido: "Sánchez", dni: "78901234", estado: "ACTIVO" },
  { idSocio: 9, nombre: "Fernando", apellido: "Torres", dni: "20456789", estado: "INACTIVO" },
  { idSocio: 10, nombre: "Verónica", apellido: "Ruiz", dni: "89012345", estado: "ACTIVO" },
];

export const MOCK_SOCIOS: SocioListItem[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    nroDocumento: "12345678",
    obraSocial: "PAMI",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Gómez",
    nroDocumento: "20123456",
    obraSocial: "OSDE",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    nroDocumento: "34567890",
    obraSocial: "IAPOS",
    plan: "A",
    estado: "Baja",
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    nroDocumento: "45678901",
    obraSocial: "PAMI",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "5",
    nombre: "Roberto",
    apellido: "López",
    nroDocumento: "20345678",
    obraSocial: "Jerárquicos Salud",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "6",
    nombre: "Laura",
    apellido: "Fernández",
    nroDocumento: "56789012",
    obraSocial: null,
    plan: "B",
    estado: "Baja",
  },
  {
    id: "7",
    nombre: "Diego",
    apellido: "García",
    nroDocumento: "67890123",
    obraSocial: "OSDE",
    plan: "A",
    estado: "Activo",
  },
  {
    id: "8",
    nombre: "Patricia",
    apellido: "Sánchez",
    nroDocumento: "78901234",
    obraSocial: "PAMI",
    plan: "B",
    estado: "Activo",
  },
  {
    id: "9",
    nombre: "Fernando",
    apellido: "Torres",
    nroDocumento: "20456789",
    obraSocial: "IAPOS",
    plan: "A",
    estado: "Baja",
  },
  {
    id: "10",
    nombre: "Verónica",
    apellido: "Ruiz",
    nroDocumento: "89012345",
    obraSocial: "Jerárquicos Salud",
    plan: "B",
    estado: "Activo",
  },
];

export const MOCK_SOCIOS_DETALLE: SocioDetalle[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    nroDocumento: "12345678",
    fechaNacimiento: "1990-01-01",
    sexo: "Hombre",
    ciudad: "Buenos Aires",
    calle: "Falsa",
    altura: "123",
    fechaAlta: "2024-01-01",
    obraSocial: "PAMI",
    nroAfiliadoObraSocial: "PAMI-12345678",
    plan: "A",
    sepelio: "SI",
    cobrador: "NO",
    observaciones: "Socio con domicilio particular en Buenos Aires.",
    telefonos: ["3412345678"],
    correos: ["juan.perez@example.com"],
    codeudores: [
      { id: "2", nombre: "María", apellido: "Gómez", nroDocumento: "20123456" },
    ],
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Gómez",
    nroDocumento: "20123456",
    fechaNacimiento: "1985-05-15",
    sexo: "Mujer",
    ciudad: "Rosario",
    calle: "Córdoba",
    altura: "456",
    fechaAlta: "2023-06-12",
    obraSocial: "OSDE",
    nroAfiliadoObraSocial: "OSDE-20123456",
    plan: "B",
    sepelio: "NO",
    cobrador: "SI",
    telefonos: ["3418765432"],
    correos: ["maria.gomez@example.com"],
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    nroDocumento: "34567890",
    fechaNacimiento: "1962-11-20",
    sexo: "Hombre",
    ciudad: "Santa Fe",
    calle: "San Martín",
    altura: "789",
    fechaAlta: "2023-03-15",
    fechaBaja: "2024-12-01",
    obraSocial: "IAPOS",
    nroAfiliadoObraSocial: "IAPOS-34567890",
    plan: "A",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3421112233"],
    correos: ["carlos.rodriguez@example.com"],
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    nroDocumento: "45678901",
    fechaNacimiento: "1978-08-08",
    sexo: "Mujer",
    ciudad: "Paraná",
    calle: "Urquiza",
    altura: "321",
    fechaAlta: "2024-06-01",
    obraSocial: "PAMI",
    nroAfiliadoObraSocial: "PAMI-45678901",
    plan: "B",
    sepelio: "SI",
    cobrador: "NO",
    observaciones: "Prefiere ser contactada por correo electrónico.",
    telefonos: ["3434445566"],
    correos: ["ana.martinez@example.com"],
  },
  {
    id: "5",
    nombre: "Roberto",
    apellido: "López",
    nroDocumento: "20345678",
    fechaNacimiento: "1970-03-22",
    sexo: "Hombre",
    ciudad: "Córdoba",
    calle: "Rivadavia",
    altura: "654",
    fechaAlta: "2022-09-10",
    obraSocial: "Jerárquicos Salud",
    nroAfiliadoObraSocial: "JS-20345678",
    plan: "A",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3517778899"],
    correos: ["roberto.lopez@example.com"],
  },
  {
    id: "6",
    nombre: "Laura",
    apellido: "Fernández",
    nroDocumento: "56789012",
    fechaNacimiento: "1995-12-30",
    sexo: "Otro",
    ciudad: "Rafaela",
    calle: "Belgrano",
    altura: "147",
    fechaAlta: "2024-02-20",
    fechaBaja: "2024-10-15",
    plan: "B",
    sepelio: "NO",
    cobrador: "NO",
    telefonos: ["3492223344"],
    correos: ["laura.fernandez@example.com"],
  },
  {
    id: "7",
    nombre: "Diego",
    apellido: "García",
    nroDocumento: "67890123",
    fechaNacimiento: "1988-07-14",
    sexo: "Hombre",
    ciudad: "Venado Tuerto",
    calle: "Mitre",
    altura: "258",
    fechaAlta: "2023-11-05",
    obraSocial: "OSDE",
    nroAfiliadoObraSocial: "OSDE-67890123",
    plan: "A",
    sepelio: "SI",
    cobrador: "NO",
    telefonos: ["3462556677"],
    correos: ["diego.garcia@example.com"],
  },
  {
    id: "8",
    nombre: "Patricia",
    apellido: "Sánchez",
    nroDocumento: "78901234",
    fechaNacimiento: "1973-04-05",
    sexo: "Mujer",
    ciudad: "Rosario",
    calle: "Oroño",
    altura: "951",
    fechaAlta: "2022-01-15",
    obraSocial: "PAMI",
    nroAfiliadoObraSocial: "PAMI-78901234",
    plan: "B",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3418889900", "3411122334"],
    correos: ["patricia.sanchez@example.com", "patricia@personal.com"],
  },
  {
    id: "9",
    nombre: "Fernando",
    apellido: "Torres",
    nroDocumento: "20456789",
    fechaNacimiento: "1965-09-18",
    sexo: "Hombre",
    ciudad: "Firmat",
    calle: "Sarmiento",
    altura: "753",
    fechaAlta: "2023-04-01",
    fechaBaja: "2024-06-30",
    obraSocial: "IAPOS",
    nroAfiliadoObraSocial: "IAPOS-20456789",
    plan: "A",
    sepelio: "SI",
    cobrador: "SI",
    telefonos: ["3464778899"],
    correos: ["fernando.torres@example.com"],
  },
  {
    id: "10",
    nombre: "Verónica",
    apellido: "Ruiz",
    nroDocumento: "89012345",
    fechaNacimiento: "1992-11-25",
    sexo: "Mujer",
    ciudad: "Cañada de Gómez",
    calle: "Buenos Aires",
    altura: "486",
    fechaAlta: "2024-08-12",
    obraSocial: "Jerárquicos Salud",
    nroAfiliadoObraSocial: "JS-89012345",
    plan: "B",
    sepelio: "NO",
    cobrador: "NO",
    observaciones: "Socio desde agosto de 2024.",
    telefonos: ["3471556677"],
    correos: ["veronica.ruiz@example.com"],
    codeudores: [
      { id: "1", nombre: "Juan", apellido: "Pérez", nroDocumento: "12345678" },
      { id: "4", nombre: "Ana", apellido: "Martínez", nroDocumento: "45678901" },
    ],
  },
];

export const MOCK_USUARIOS = [
  {
    id_Usuario: 1,
    usuarioNombre: "CJR",
    usuario: "CJR",
    rolNombre: "Consultor",
    rol: "CONSULTOR",
    estado: "ACTIVO",
    descripcion: "Solo acceso a informes",
  },
  {
    id_Usuario: 2,
    usuarioNombre: "ADMIN_SISTEMA",
    usuario: "ADMIN_SISTEMA",
    rolNombre: "Secretaria",
    rol: "SECRETARIO",
    estado: "ACTIVO",
    descripcion: "Acceso total",
  },
  {
    id_Usuario: 3,
    usuarioNombre: "MPEREZ",
    usuario: "MPEREZ",
    rolNombre: "Consultor",
    rol: "CONSULTOR",
    estado: "ACTIVO",
    descripcion: "Solo informes",
  },
  {
    id_Usuario: 4,
    usuarioNombre: "JALVAREZ",
    usuario: "JALVAREZ",
    rolNombre: "Consultor",
    rol: "CONSULTOR",
    estado: "BAJA",
    descripcion: "Usuario inactivo",
  },
];

export const MOCK_PROVEEDORES = [
  {
    id_Proveedor: 1,
    cuitCuil: "30712345678",
    razonSocial: "Emergencias Médicas S.A.",
    prestacion: "Servicio de ambulancia y traslados",
    estado: "Activo",
    fechaNacimiento: "2010-03-15",
    ciudad: "Rosario",
    calle: "Córdoba",
    altura: 1540,
    observaciones: "Convenio vigente de emergencias",
    telefonos: ["3414201000", "3414201001"],
    emails: ["guardia@emergencias.com.ar"],
  },
  {
    id_Proveedor: 2,
    cuitCuil: "27254443334",
    razonSocial: "Dra. Marcela González",
    prestacion: "Atención médica clínica",
    estado: "Activo",
    fechaNacimiento: "1978-09-20",
    ciudad: "Roldán",
    calle: "San Martín",
    altura: 420,
    observaciones: "Consultorio lunes a jueves",
    telefonos: ["3413456789"],
    emails: ["marcelagonzalez@gmail.com"],
  },
  {
    id_Proveedor: 3,
    cuitCuil: "30558889992",
    razonSocial: "Ortopedia Central",
    prestacion: "Insumos ortopédicos y sillas de ruedas",
    estado: "Inactivo",
    fechaNacimiento: "2015-06-01",
    ciudad: "Funes",
    calle: "Santa Fe",
    altura: 1200,
    observaciones: "Contrato pausado",
    telefonos: ["3414930000"],
    emails: ["ventas@ortopediacentral.com"],
  },
];

export const MOCK_NICHOS = [
  {
    id_Nicho: 1,
    nroNicho: 45,
    sector: "A",
    ocupado: true,
    valorNicho: 50000,
    valorLapida: 15000,
    cuotas: 12,
    interes: 0.05,
    socio: {
      id_Socio: 1,
      nombre: "Luciano",
      apellido: "Oldan",
    },
  },
  {
    id_Nicho: 2,
    nroNicho: 46,
    sector: "A",
    ocupado: false,
    valorNicho: 50000,
    valorLapida: 15000,
    cuotas: 12,
    interes: 0.05,
    socio: null,
  },
  {
    id_Nicho: 3,
    nroNicho: 12,
    sector: "B",
    ocupado: true,
    valorNicho: 60000,
    valorLapida: 18000,
    cuotas: 24,
    interes: 0.08,
    socio: {
      id_Socio: 2,
      nombre: "María",
      apellido: "Gómez",
    },
  },
  {
    id_Nicho: 4,
    nroNicho: 13,
    sector: "B",
    ocupado: false,
    valorNicho: 60000,
    valorLapida: 18000,
    cuotas: 24,
    interes: 0.08,
    socio: null,
  },
];

export const MOCK_ENTIDADES = [
  {
    id_Entidad: 1,
    cuitCuil: "20123456789",
    nombre: "Juan",
    apellido: "Pérez",
    razonSocial: null,
    sexo: "Hombre",
    nacimiento: "1990-01-01",
    ciudad: { id_Ciudad: 1, nombre: "Buenos Aires" },
    calle: "Falsa",
    altura: 123,
    observacion: "Socio activo",
  },
  {
    id_Entidad: 2,
    cuitCuil: "27201234564",
    nombre: "María",
    apellido: "Gómez",
    razonSocial: null,
    sexo: "Mujer",
    nacimiento: "1985-05-15",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Mitre",
    altura: 450,
    observacion: null,
  },
  {
    id_Entidad: 3,
    cuitCuil: "30712345678",
    nombre: "",
    apellido: "",
    razonSocial: "Emergencias Médicas S.A.",
    sexo: "-",
    nacimiento: "2010-03-15",
    ciudad: { id_Ciudad: 2, nombre: "Rosario" },
    calle: "Córdoba",
    altura: 1540,
    observacion: "Proveedor de salud",
  },
];

export function getMockResponse(endpoint: string, options?: RequestInit): unknown {
  if (endpoint === "/me" || endpoint.startsWith("/me")) {
    return {
      id_Usuario: MOCK_USUARIO.id_Usuario,
      usuarioNombre: MOCK_USUARIO.usuarioNombre,
      estado: MOCK_USUARIO.estado,
      id_Rol: MOCK_USUARIO.id_Rol,
      rolNombre: MOCK_USUARIO.rolNombre,
      nombre: MOCK_USUARIO.nombre,
      rol: MOCK_USUARIO.rol,
    };
  }
  if (endpoint === "/socios/crear") {
    return { idSocio: 14 };
  }
  if (endpoint === "/socios/baja") {
    return { mensaje: "El socio fue dado de baja correctamente." };
  }
  if (endpoint === "/socios/modificar") {
    return { mensaje: "El socio fue modificado correctamente." };
  }
  if (endpoint === "/socios") {
    return MOCK_SOCIOS_BACKEND;
  }
  if (endpoint.startsWith("/socios/")) {
    const id = endpoint.split("/socios/")[1];
    const socio = MOCK_SOCIOS_DETALLE.find((s) => s.id === id);
    if (!socio) {
      throw new Error(`No se encontró el socio solicitado.`);
    }
    return {
      idSocio: Number(socio.id),
      tipoDocumento: "DNI",
      dni: socio.nroDocumento,
      nombre: socio.nombre,
      apellido: socio.apellido,
      fechaNacimiento: socio.fechaNacimiento,
      sexo: socio.sexo,
      idCiudad: 1,
      ciudad: socio.ciudad,
      calle: socio.calle,
      altura: Number(socio.altura) || 0,
      observaciones: socio.observaciones ?? null,
      estado: socio.fechaBaja ? "INACTIVO" : "ACTIVO",
      fechaAlta: socio.fechaAlta,
      fechaBaja: socio.fechaBaja ?? null,
      idObraSocial: socio.obraSocial ? 1 : null,
      obraSocial: socio.obraSocial ?? null,
      numeroAfiliado: socio.nroAfiliadoObraSocial ?? "",
      plan: socio.plan,
      sepelio: socio.sepelio ?? "NO",
      cobrador: socio.cobrador ?? "NO",
      telefonos: socio.telefonos,
      emails: socio.correos,
      codeudores: socio.codeudores,
    };
  }
  if (endpoint === "/usuarios/alta") {
    return {
      id_Usuario: 5,
      usuarioNombre: "nuevo",
      password: "$2a$11$mockhash",
      estado: "Activo",
      id_Rol: 1,
      rol: { id_Rol: 1, rolNombre: "Secretaria", descripcion: "Secretaria" },
    };
  }
  if (endpoint.startsWith("/usuarios/baja/")) {
    return { mensaje: "Usuario dado de baja correctamente", usuario: {} };
  }
  if (endpoint.startsWith("/usuarios/modificar/")) {
    return { mensaje: "Usuario modificado correctamente", usuario: {} };
  }
  if (endpoint === "/usuarios" || endpoint.startsWith("/usuarios/buscar") || endpoint.startsWith("/usuarios")) {
    return MOCK_USUARIOS;
  }
  if (endpoint.startsWith("/ciudades/buscar")) {
    return MOCK_CIUDADES.map((c) => ({ id_Ciudad: Number(c.id), nombre: c.nombre }));
  }
  if (endpoint.startsWith("/obrassociales/buscar")) {
    return MOCK_OBRAS_SOCIALES.map((o) => ({ id_ObraSocial: Number(o.id), nombreObraSocial: o.nombre }));
  }
  if (endpoint.startsWith("/buscarentidad/buscar")) {
    return MOCK_ENTIDADES;
  }
  if (endpoint.startsWith("/buscarentidad")) {
    return MOCK_ENTIDADES[0];
  }
  if (endpoint === "/codeudores/crear") {
    return { idEntidad: 15 };
  }
  if (endpoint.startsWith("/proveedores/crear")) {
    return { idProveedor: 4 };
  }
  if (endpoint.startsWith("/proveedores/baja")) {
    let id: number | undefined;
    if (options?.body) {
      try {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        id = Number(body?.idProveedor ?? body?.id_Proveedor ?? body?.id);
      } catch {
        // fallback
      }
    }
    if (id) {
      const found = MOCK_PROVEEDORES.find((p) => p.id_Proveedor === id);
      if (found) {
        found.estado = "Inactivo";
      }
    }
    return { mensaje: "Proveedor dado de baja correctamente" };
  }
  if (endpoint.startsWith("/proveedores/reactivar")) {
    let id: number | undefined;
    if (options?.body) {
      try {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        id = Number(body?.idProveedor ?? body?.id_Proveedor ?? body?.id);
      } catch {
        // fallback
      }
    }
    if (id) {
      const found = MOCK_PROVEEDORES.find((p) => p.id_Proveedor === id);
      if (found) {
        found.estado = "Activo";
      }
    }
    return { mensaje: "Proveedor reactivado correctamente" };
  }
  if (endpoint.startsWith("/proveedores/eliminar") || (endpoint.match(/^\/proveedores\/\d+$/) && options?.method === "DELETE")) {
    let id: number | undefined;
    const match = endpoint.match(/^\/proveedores\/(\d+)$/);
    if (match) {
      id = Number(match[1]);
    } else if (options?.body) {
      try {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
        id = Number(body?.idProveedor ?? body?.id_Proveedor ?? body?.id);
      } catch {}
    }
    if (id) {
      const idx = MOCK_PROVEEDORES.findIndex((p) => p.id_Proveedor === id);
      if (idx !== -1) {
        MOCK_PROVEEDORES.splice(idx, 1);
      }
    }
    return { mensaje: "Proveedor eliminado correctamente" };
  }
  if (endpoint.startsWith("/proveedores/modificar")) {
    return { mensaje: "Proveedor modificado correctamente" };
  }
  if (endpoint.match(/^\/proveedores\/\d+$/)) {
    const id = Number(endpoint.replace("/proveedores/", ""));
    const found = MOCK_PROVEEDORES.find((p) => p.id_Proveedor === id);
    return found || MOCK_PROVEEDORES[0];
  }
  if (endpoint.startsWith("/proveedores")) {
    return MOCK_PROVEEDORES;
  }
  if (endpoint.startsWith("/nichos/buscar") || endpoint.startsWith("/nichos")) {
    return MOCK_NICHOS;
  }
  throw new Error(`No hay mock definido para el endpoint: ${endpoint}`);
}
