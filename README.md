# MegaLineas Dashboard

Aplicacion web para visualizar indicadores operativos, productos y planificacion de Megalineas.
El proyecto esta construido como SPA con React + TypeScript y UI en Material UI.

## Stack Tecnologico

- React 18
- TypeScript 5
- Vite 7
- Material UI (`@mui/material`, `@mui/icons-material`)
- MUI Data Grid (`@mui/x-data-grid`)
- React Router DOM 6
- Axios
- Recharts
- Day.js
- ExcelJS + FileSaver (exportacion a Excel)

## Funcionalidades Principales

- Login con ruta protegida y persistencia simple de sesion.
- Dashboard con KPIs, grafica de soporte diario y panel de alertas.
- Vista de productos con tabla de top productos y clasificacion ABCDE.
- Vista de planificador con filtros (fecha, categoria, producto) y exportacion a Excel.
- Filtros por rango de fechas reutilizables entre pantallas.
- Integracion actual con datos mock, preparada para API real.

## Estructura del Proyecto

```text
src/
  api/            # cliente HTTP, endpoints y mocks
  auth/           # proteccion de rutas y almacenamiento de token
  components/     # componentes reutilizables de UI
  pages/          # vistas: Dashboard, Productos, Planificador, Login
  routes/         # enrutamiento principal
  utils/          # utilidades de fecha, CSV y Excel
```

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+

## Instalacion y Ejecucion

```bash
npm install
npm run dev
```

La app levanta en el host local que indique Vite (normalmente `http://localhost:5173`).

## Scripts Disponibles

```bash
npm run dev      # entorno de desarrollo
npm run build    # compilacion TypeScript + build de produccion
npm run preview  # vista previa del build
```

## Autenticacion Demo

En el login se usan credenciales de prueba:

- Usuario: `admi`
- Password: `admi123`

## API y Datos

Actualmente `src/api/endpoints.ts` responde con `mockData` y deja comentarios `TODO` para conectar endpoints reales con Axios.

Siguiente paso recomendado para backend real:

1. Configurar `baseURL` y headers en `src/api/client.ts`.
2. Reemplazar retornos mock por llamadas HTTP en `src/api/endpoints.ts`.
3. Ajustar tipos en `src/api/types.ts` segun contrato real.

## Buenas Practicas del Repo

- Los artefactos generados (`*.tsbuildinfo`, `vite.config.js`, `vite.config.d.ts`) estan ignorados en `.gitignore`.
- No subir `node_modules`, `dist`, logs ni archivos `.env`.
- Mantener versionados solo fuentes (`.ts`, `.tsx`, configuracion y docs).