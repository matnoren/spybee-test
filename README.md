# Sitemap — Gestión de Incidencias

Sistema SaaS moderno para la gestión de incidencias en proyectos de construcción. Construido con Next.js 14 (App Router), TypeScript, Zustand, Mapbox GL y SCSS Modules.

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/sitemap-incidents.git
cd sitemap-incidents

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) → redirige automáticamente al mapa.

---

## 📦 Stack

| Tecnología | Uso |
|---|---|
| Next.js 14 App Router | Framework full-stack |
| TypeScript | Tipado estático |
| Zustand + persist | Estado global + localStorage |
| Mapbox GL JS | Mapa interactivo |
| SCSS Modules | Estilos encapsulados |
| Recharts | Gráficas en el dashboard |

---

## 🗂️ Estructura

```
/
├── app/
│   ├── layout.tsx          # Root layout con fuentes y Mapbox CSS
│   ├── page.tsx            # Redirect → /map
│   ├── globals.scss        # Estilos globales + Mapbox overrides
│   ├── map/page.tsx        # Vista de mapa (dynamic import, ssr: false)
│   └── dashboard/page.tsx  # Vista de dashboard
│
├── components/
│   ├── Map/
│   │   └── MapView.tsx     # Mapa Mapbox + marcadores + topbar
│   ├── Dashboard/
│   │   └── Dashboard.tsx   # Cards, charts, filtros, tabla
│   ├── IncidentForm/
│   │   └── IncidentFormModal.tsx  # Modal de creación
│   └── UI/
│       ├── Sidebar.tsx     # Navegación lateral
│       └── Badge.tsx       # Badges de severidad y estado
│
├── store/
│   └── incidentStore.ts    # Zustand store con persist
│
├── types/
│   └── index.ts            # Tipos TypeScript
│
├── lib/
│   └── utils.ts            # Helpers: formatos, colores
│
├── styles/
│   └── _variables.scss     # Design tokens globales
│
└── public/
    └── data/
        └── incidents_mock.json
```

---

## ✨ Funcionalidades

### Mapa de Incidencias
- **Mapa dark** con Mapbox GL JS
- **Clic en cualquier punto** → abre modal para crear incidencia
- **Marcadores por severidad**: 🟢 verde / 🟡 amarillo / 🔴 rojo con animación hover
- **Popup informativo** al hacer clic en un marcador
- **Stats bar** flotante con conteo por severidad
- Botón "Nueva incidencia" si se prefiere crear desde el centro del mapa

### Dashboard Analítico
- **4 metric cards** con totales, abiertas, en progreso y alta prioridad
- **Donut chart** de distribución por severidad (Recharts)
- **Bar chart** de incidencias creadas por mes
- **Filtros combinados**: por estado, severidad y búsqueda de texto
- **Tabla paginada** con avatar del responsable, badges y fechas
- **Empty state** elegante cuando no hay resultados

### Estado Global (Zustand)
- Persistencia en `localStorage` (incidents + isLoaded)
- Carga inicial desde `incidents_mock.json` (solo una vez)
- Acciones: `addIncident`, `updateIncident`, `deleteIncident`, `setFilters`

---

## 🎨 Decisiones de Diseño

- **Tema oscuro elegante** (#0a0b0d base) — apropiado para profesionales de construcción que trabajan en campo con pantallas expuestas al sol
- **Acento azul índigo** (#4f6ef7) — neutral y profesional, no compite con los colores semánticos de severidad
- **Tipografía Inter** — legible en tamaños pequeños, excelente para tablas de datos
- **SCSS Modules** — encapsulamiento real, sin conflictos, escalable por feature
- **Sin Tailwind** — como pedido en el stack, control total del CSS

---

## 🌐 Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

O conecta el repositorio directamente en [vercel.com](https://vercel.com).

---

## 📝 Variables de entorno

No se requieren por defecto. El token de Mapbox está incluido en el código para facilitar la evaluación. En producción, moverlo a:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

Y actualizar `MapView.tsx`:
```ts
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
```
