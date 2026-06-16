<div align="center">

<img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Zustand-5-FF6B35?style=for-the-badge" />
<img src="https://img.shields.io/badge/Mapbox_GL-3-000000?style=for-the-badge&logo=mapbox&logoColor=white" />
<img src="https://img.shields.io/badge/SCSS_Modules-CC6699?style=for-the-badge&logo=sass&logoColor=white" />

<br /><br />

<img src="https://raw.githubusercontent.com/matnoren/spybee-test/main/public/favicon.png" width="64" height="64" alt="Spybee logo" />

<h1>Spybee Control</h1>
<p><strong>Sistema de gestión de incidencias para proyectos de construcción</strong></p>

<a href="https://spybee-test-six.vercel.app/login"><strong>🚀 Ver demo en vivo →</strong></a>

<br /><br />

</div>

---

## 📸 Capturas

| Mapa de incidencias | Dashboard analítico |
|---|---|
| ![Mapa](<img width="1346" height="718" alt="mapa-preview" src="https://github.com/user-attachments/assets/5a1f5e3e-9664-4091-938a-33c4ff2d40db" />
) | ![Dashboard](<img width="1346" height="718" alt="dashboard-preview" src="https://github.com/user-attachments/assets/39224c68-ec25-4078-8a0e-a6fdfa31a2db" />
) |


---

## ✨ Funcionalidades

### 🗺️ Mapa interactivo
- Mapa oscuro con **Mapbox GL JS**
- **Clic en cualquier punto** del mapa para crear una incidencia en esa ubicación exacta
- **Marcadores por severidad** con colores semánticos (🔴 Alta / 🟡 Media / 🟢 Baja) y animación hover
- **Popup informativo** al hacer clic en un pin — muestra título, descripción, estado y fecha
- Barra de estadísticas flotante con conteo en tiempo real por severidad

### 📊 Dashboard analítico
- **4 metric cards** — Total, Abiertas, En Progreso y Alta Prioridad
- **Donut chart** de distribución por severidad (Recharts)
- **Bar chart** de incidencias creadas por mes (últimos 8 meses)
- Filtros combinados por estado, severidad y búsqueda de texto
- Tabla paginada con avatar del responsable, badges y fechas

### 🔐 Autenticación
- Login con validación de credenciales
- Protección de rutas con `AuthGuard`
- Persistencia de sesión en `localStorage` via Zustand
- Dropdown de usuario con logout desde cualquier pantalla

### 👥 Equipo
- Vista de miembros del proyecto con rol y estadísticas de incidencias asignadas
- Alertas visuales para miembros con incidencias de alta prioridad

### ⚙️ Configuración
- Ajustes del proyecto (nombre, etapa, ubicación)
- Toggles de notificaciones
- Sección de seguridad (cambio de contraseña)

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 14 (App Router) | Framework fullstack con SSR/CSR |
| **TypeScript** | 5 | Tipado estático en todo el proyecto |
| **Zustand** + persist | 5 | Estado global con persistencia en localStorage |
| **Mapbox GL JS** | 3 | Mapa interactivo con marcadores dinámicos |
| **SCSS Modules** | — | Estilos encapsulados por componente |
| **Recharts** | — | Gráficas del dashboard |
| **Lucide React** | — | Sistema de iconos |
| **UUID** | — | Generación de IDs únicos para incidencias |

---

## 📁 Estructura del proyecto

```
spybee/
├── app/
│   ├── layout.tsx              # Root layout + fuentes + AuthGuard
│   ├── page.tsx                # Redirect → /map
│   ├── globals.scss            # Estilos globales + Mapbox overrides
│   ├── map/page.tsx            # Vista de mapa
│   ├── dashboard/page.tsx      # Vista de dashboard
│   ├── team/page.tsx           # Vista de equipo
│   ├── settings/page.tsx       # Vista de configuración
│   └── login/page.tsx          # Vista de login
│
├── components/
│   ├── Auth/
│   │   └── AuthGuard.tsx       # Protección de rutas
│   ├── Map/
│   │   └── MapView.tsx         # Mapa + marcadores + popups + topbar
│   ├── Dashboard/
│   │   └── Dashboard.tsx       # Cards + charts + filtros + tabla
│   ├── IncidentForm/
│   │   └── IncidentFormModal.tsx  # Modal de creación de incidencias
│   ├── Team/
│   │   └── Team.tsx            # Vista de miembros del equipo
│   ├── Settings/
│   │   └── Settings.tsx        # Configuración del proyecto
│   └── UI/
│       ├── Sidebar.tsx         # Navegación lateral + logout dropdown
│       └── Badge.tsx           # Badges de severidad y estado
│
├── store/
│   ├── authStore.ts            # Auth: login, logout, persistencia
│   └── incidentStore.ts        # Incidencias: CRUD + filtros
│
├── types/
│   └── index.ts                # Tipos TypeScript globales
│
├── lib/
│   └── utils.ts                # Helpers: formateo, colores semánticos
│
├── styles/
│   └── _variables.scss         # Design tokens (colores, radios, transiciones)
│
└── public/
    └── data/
        └── incidents_mock.json # 204 incidencias de prueba
```

---

## 🚀 Instalación y uso

### Prerrequisitos
- Node.js 18+
- Una cuenta y token de [Mapbox](https://mapbox.com)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/matnoren/spybee-test.git
cd spybee-test

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
echo "NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aqui" > .env.local

# 4. Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige automáticamente al mapa.

### Credenciales demo

```
Email:      admin@spybee.com.co
Contraseña: spybee2026
```

---

## 🌐 Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_de_mapbox_aqui
```

Para obtener un token gratuito: [mapbox.com](https://mapbox.com) → Create account → Tokens.

---

## 🎨 Decisiones de diseño

- **Tema oscuro** — apropiado para profesionales de construcción que trabajan en campo con distintas condiciones de luz
- **Colores semánticos para severidad** — rojo/amarillo/verde universalmente reconocibles, sin ambigüedad
- **Acento amarillo dorado** (`#f5a623`) — coherente con la identidad visual de Spybee
- **SCSS Modules** — encapsulamiento real sin colisiones, escalable por feature
- **Zustand sobre Redux** — mínimo boilerplate, API simple, integración nativa con Next.js App Router
- **Design tokens centralizados** en `_variables.scss` — un solo punto de cambio para todo el sistema visual

---

## 📦 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter ESLint
```

---

## 🚢 Deploy

El proyecto está desplegado en **Vercel**:

👉 **[spybee-test-six.vercel.app](https://spybee-test-six.vercel.app/login)**

Para desplegar tu propia instancia:

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Agrega la variable de entorno `NEXT_PUBLIC_MAPBOX_TOKEN`
3. Deploy automático en cada push a `main`

---

<div align="center">

Desarrollado por **[@matnoren](https://github.com/matnoren)** como prueba técnica para **Spybee** · 2026

</div>
