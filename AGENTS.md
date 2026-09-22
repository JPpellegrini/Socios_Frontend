# Reglas del Proyecto (Socios Frontend)

## Componentes y Sistema de Diseño
- **NUNCA inventar componentes nuevos**: Tienes componentes creados y estandarizados en `@/components/ui/` (`Button`, `Card`, `DataTable`, `Input`, `Select`, `Dialog`, `ConfirmDialog`, `Chip`, `Separator`, `Skeleton`, etc.). ÚNICAMENTE utiliza esos.
- **Solicitud de nuevos componentes**: Si consideras que se necesita un componente nuevo que no existe en el sistema, debes **pedir permiso explícito al usuario y preguntar cómo debe ser implementado y diseñado** antes de crearlo.
- **Estandarización visual**: Las vistas de detalle y listados deben ser coherentes entre módulos (Socios, Proveedores, Usuarios). La vista de detalle de socio (`socio-detalle.tsx` / `dashboard/socios/[id]`) es el estándar para vistas de visualización de entidades.
- **Etiquetas de estado**: Las etiquetas rojas de estado inactivo o baja (`bg-destructive`) deben tener **siempre letras blancas** (`text-white font-medium`).
