# Finance - Control Financiero Personal

## 📋 Descripción

**Finance** es una aplicación web completa para el control de finanzas personales desarrollada con Next.js 13, TypeScript y SQLite. La aplicación permite gestionar transacciones, categorizar gastos e ingresos, realizar seguimiento de inversiones en Bitcoin, y generar reportes financieros detallados.

## ✨ Características Principales

### 💰 Gestión de Transacciones

- **Registro de ingresos y gastos** con categorización automática
- **Soporte para pagos con tarjeta de crédito y débito**
- **Adjuntar imágenes de comprobantes** a las transacciones
- **Filtros avanzados** por fecha, categoría, tipo y monto
- **Edición y eliminación** de transacciones existentes

### 📊 Dashboard y Análisis

- **Resumen financiero** con estadísticas en tiempo real
- **Gráficos interactivos** para visualizar gastos por categoría
- **Análisis de tendencias** mensuales y anuales
- **Tarjetas de estadísticas** con ingresos, gastos y balance

### 🏷️ Gestión de Categorías

- **Categorías personalizables** con colores únicos
- **Categorías predefinidas** para uso inmediato
- **Edición y eliminación** de categorías existentes

### ₿ Seguimiento de Bitcoin

- **Registro de compras de Bitcoin** con precio y tasa de cambio
- **Cálculo automático de ganancias/pérdidas** en tiempo real
- **Integración con APIs de mercado** para precios actuales
- **Resumen de inversión** con métricas detalladas

### 📈 Reportes y Exportación

- **Exportación a PDF** de transacciones y reportes
- **Filtros personalizables** para reportes específicos
- **Gráficos exportables** para presentaciones

### 🔐 Autenticación

- **Sistema de login** con credenciales seguras
- **Protección de rutas** con middleware de autenticación
- **Sesiones persistentes** para mejor experiencia de usuario

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
Finance/
├── app/                          # App Router de Next.js 13
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints de autenticación
│   │   ├── bitcoin-purchases/    # Gestión de compras de Bitcoin
│   │   ├── categories/           # CRUD de categorías
│   │   ├── stats/                # Estadísticas y métricas
│   │   └── transactions/         # CRUD de transacciones
│   ├── globals.css               # Estilos globales
│   ├── invest/                   # Página de inversiones
│   ├── login/                    # Página de login
│   ├── transactions/             # Página de transacciones
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página principal (Dashboard)
├── components/                   # Componentes React
│   ├── BitcoinTracker/           # Componentes de seguimiento Bitcoin
│   ├── ui/                       # Componentes de UI (shadcn/ui)
│   ├── widgets/                  # Widgets especializados
│   └── [otros componentes]       # Componentes principales
├── hooks/                        # Custom React Hooks
├── layout/                       # Layouts especializados
├── lib/                          # Utilidades y configuración
├── types/                        # Definiciones de TypeScript
└── data/                         # Base de datos SQLite
```

### Tecnologías Utilizadas

#### Frontend

- **Next.js 13** - Framework React con App Router
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de estilos utilitarios
- **shadcn/ui** - Componentes de UI modernos y accesibles
- **Radix UI** - Primitivos de UI sin estilos
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconografía moderna

#### Backend

- **Next.js API Routes** - API REST integrada
- **SQLite** - Base de datos ligera y portable
- **better-sqlite3** - Driver de SQLite para Node.js
- **jsPDF** - Generación de PDFs

#### Herramientas de Desarrollo

- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 🗄️ Base de Datos

### Esquema de Tablas

#### `users`

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `categories`

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `transactions`

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  type_payment TEXT NOT NULL CHECK (type_payment IN ('credit', 'debit')) DEFAULT 'debit',
  category_id INTEGER,
  date DATE NOT NULL,
  receipt_image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);
```

#### `bitcoin_purchases`

```sql
CREATE TABLE bitcoin_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_time DATETIME NOT NULL,
  invested_value REAL NOT NULL,
  bitcoin_price REAL NOT NULL,
  usd_cop_rate REAL NOT NULL DEFAULT 0
);
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Finance
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar la base de datos**

   ```bash
   # La base de datos se creará automáticamente en data/finance.db
   # Se insertarán categorías por defecto y usuario inicial
   ```

4. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Credenciales por Defecto

- **Usuario**: Alejandro
- **Contraseña**: Aldany17!!

## 📱 Uso de la Aplicación

### Dashboard Principal

El dashboard muestra un resumen completo de las finanzas personales:

- **Tarjetas de estadísticas** con ingresos, gastos y balance del mes
- **Gráficos interactivos** de gastos por categoría
- **Lista de transacciones recientes**
- **Widgets de inversión en Bitcoin**

### Gestión de Transacciones

1. **Agregar transacción**: Click en "Nueva Transacción"
2. **Editar**: Click en el ícono de edición en la lista
3. **Eliminar**: Click en el ícono de eliminar (con confirmación)
4. **Filtrar**: Usar el panel de filtros para buscar transacciones específicas

### Seguimiento de Bitcoin

1. **Registrar compra**: Ir a la sección de inversiones
2. **Ver resumen**: Dashboard muestra ganancias/pérdidas en tiempo real
3. **Historial**: Lista completa de todas las compras realizadas

### Reportes

1. **Exportar transacciones**: Click en "Exportar" en el dashboard
2. **Filtrar antes de exportar**: Aplicar filtros para reportes específicos
3. **Descargar PDF**: El reporte se genera automáticamente

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Configuración de la base de datos
DATABASE_URL=./data/finance.db

# Configuración de APIs externas (opcional)
BITCOIN_API_URL=https://api.coingecko.com/api/v3
```

### Personalización de Categorías

Las categorías por defecto incluyen:

- Alimentación, Transporte, Entretenimiento
- Salud, Educación, Hogar
- Ropa, Tecnología, Salario
- Inversiones, Freelance, Otros

Pueden ser modificadas desde la interfaz de usuario.

## 🧪 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
```

## 📊 APIs Integradas

### APIs de Bitcoin

- **CoinGecko API**: Precios actuales de Bitcoin
- **Tasas de cambio USD/COP**: Para cálculos de inversión

### Endpoints Internos

- `/api/transactions` - CRUD de transacciones
- `/api/categories` - CRUD de categorías
- `/api/bitcoin-purchases` - Gestión de compras Bitcoin
- `/api/stats` - Estadísticas y métricas
- `/api/auth/*` - Autenticación y sesiones

## 🎨 Diseño y UI/UX

### Sistema de Diseño

- **Design System**: Basado en shadcn/ui
- **Colores**: Paleta moderna con soporte para modo oscuro
- **Tipografía**: Inter como fuente principal
- **Iconografía**: Lucide React para consistencia

### Responsive Design

- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: Adaptable a tablets y desktop
- **Touch-friendly**: Interacciones optimizadas para touch

## 🔒 Seguridad

### Autenticación

- **Middleware de protección**: Rutas protegidas automáticamente
- **Sesiones seguras**: Manejo de sesiones con cookies
- **Validación de entrada**: Todos los formularios validados con Zod

### Base de Datos

- **Prepared statements**: Prevención de SQL injection
- **Validación de esquemas**: Tipos de datos estrictos
- **Backup automático**: Base de datos en archivo local

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otros Proveedores

- **Netlify**: Compatible con Next.js
- **Railway**: Soporte para SQLite
- **Heroku**: Requiere configuración adicional

## 🤝 Contribución

### Estructura de Commits

```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización de código
test: pruebas
chore: tareas de mantenimiento
```

### Guías de Desarrollo

1. **Fork del repositorio**
2. **Crear rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar cambios** siguiendo las convenciones
4. **Ejecutar tests**: `npm run lint`
5. **Crear Pull Request** con descripción detallada

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Alejandro** - Desarrollador Full Stack

## 📞 Soporte

Para soporte técnico o preguntas:

- Crear un issue en el repositorio
- Contactar al desarrollador directamente

---

**Finance** - Tu compañero financiero personal 🚀
