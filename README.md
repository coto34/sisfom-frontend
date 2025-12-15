# SISFOM Frontend

Frontend del Sistema de Fortalecimiento Municipal, construido con React 18, Vite y Tailwind CSS.

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI básicos (Button, Card, etc.)
│   ├── Header.jsx      # Encabezado principal
│   ├── Sidebar.jsx     # Menú lateral
│   ├── ChatbotWidget.jsx    # Widget de chatbot flotante
│   ├── SpotlightSearch.jsx  # Búsqueda rápida (Ctrl+K)
│   ├── OnboardingModal.jsx  # Tour de bienvenida
│   ├── GlosarioTooltip.jsx  # Tooltips para términos
│   └── Layout.jsx      # Layout principal de la app
│
├── context/            # React Context
│   └── AuthContext.jsx # Autenticación y sesión
│
├── pages/              # Páginas/vistas
│   ├── Login.jsx       # Inicio de sesión / Registro
│   ├── Dashboard.jsx   # Página principal
│   ├── Biblioteca.jsx  # Lista de procedimientos
│   ├── ArticuloDetalle.jsx   # Detalle de un procedimiento
│   ├── DependenciaDetalle.jsx # Procedimientos por dependencia
│   ├── MisConsultas.jsx      # Lista de consultas del usuario
│   ├── NuevaConsulta.jsx     # Formulario nueva consulta
│   ├── ConsultaDetalle.jsx   # Detalle de una consulta
│   ├── Contacto.jsx    # Información de contacto
│   ├── Glosario.jsx    # Glosario de términos
│   └── PanelExpertos.jsx     # Panel de administración (expertos)
│
├── services/           # Servicios y API
│   └── api.js          # Cliente Axios y funciones de API
│
├── utils/              # Utilidades
│   └── helpers.js      # Funciones de ayuda
│
├── App.jsx             # Componente principal y rutas
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales (Tailwind)
```

## Funcionalidades Principales

### 🔐 Autenticación
- Login / Registro de usuarios
- Roles: Funcionario, Experto, Admin
- Token-based authentication

### 📚 Biblioteca
- Listado de procedimientos administrativos
- Filtros por tipo y dependencia
- Búsqueda de contenido
- Vista detallada con pasos del procedimiento
- Favoritos y historial de lectura

### 💬 Chatbot
- Widget flotante siempre disponible
- Respuestas con IA (GPT-4o mini)
- Contexto del artículo actual
- Sugerencias de preguntas

### 📝 Consultas
- Envío de consultas a expertos
- Seguimiento de estado
- Sistema de feedback

### 🔍 Búsqueda
- Spotlight search (Ctrl+K)
- Búsqueda en artículos, dependencias y glosario
- Resultados con relevancia

## Atajos de Teclado

- `Ctrl+K` / `Cmd+K` - Abrir búsqueda rápida
- `Escape` - Cerrar modales

## Variables de Entorno

El frontend se conecta al backend a través del proxy de Vite.
Ver `vite.config.js` para la configuración del proxy.

```javascript
// vite.config.js - El proxy redirige /api a localhost:8000
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

## Colores del Tema

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#f0f7ff',
    100: '#e0effe',
    500: '#3b82f6',  // Principal
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a5f',
  }
}
```

## Desarrollo

### Agregar una nueva página

1. Crear componente en `src/pages/NuevaPagina.jsx`
2. Agregar ruta en `src/App.jsx`
3. Si es protegida, envolver con `<ProtectedRoute>`

### Agregar nuevo endpoint de API

1. Agregar función en `src/services/api.js`
2. Usar en componentes: `import { bibliotecaAPI } from '../services/api'`

### Crear componente reutilizable

1. Crear en `src/components/` o `src/components/ui/`
2. Exportar desde el archivo correspondiente

## Build de Producción

```bash
npm run build
```

Los archivos se generan en `dist/`. Configurar servidor web para SPA (redirect a index.html).

## Autor

INFOM - Instituto de Fomento Municipal, Guatemala
