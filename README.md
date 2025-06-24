# FinanceHub - Control Financiero Personal

Una aplicación web completa para el control de finanzas personales construida con Next.js, TypeScript, SQLite y Tailwind CSS.

## 🚀 Instalación Rápida

### Prerrequisitos

- **Node.js 18+** (recomendado: versión LTS más reciente)
- **npm** (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <tu-repositorio>
   cd Finance
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar el proyecto**

   ```bash
   npm run setup
   ```

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**

   ```
   http://localhost:3000
   ```

6. **Iniciar sesión**
   - Usuario: `Alejandro`
   - Contraseña: `Aldany17!!`

## 📋 Características

### 🏠 Dashboard Principal

- Resumen financiero en tiempo real
- Estadísticas de ingresos y gastos
- Gráficos interactivos
- Acciones rápidas

### 💰 Gestión de Transacciones

- Agregar, editar y eliminar transacciones
- Categorización automática
- Filtros avanzados
- Exportación de datos

### ₿ Bitcoin Tracker

- Seguimiento de inversiones en Bitcoin
- Gráficos en tiempo real con TradingView
- Cálculo de ganancias/pérdidas
- Conversor de monedas

### 🎨 Interfaz Moderna

- Diseño responsive
- Tema claro/oscuro
- Sidebar colapsible
- Componentes reutilizables

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter

# Base de datos
npm run db:init      # Inicializar base de datos
npm run db:migrate   # Ejecutar migraciones

# Setup
npm run setup        # Configuración completa del proyecto
```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **users**: Usuarios del sistema
- **categories**: Categorías de transacciones
- **transactions**: Transacciones financieras
- **bitcoin_purchases**: Compras de Bitcoin

### Datos Iniciales

- Usuario por defecto: `Alejandro`
- 12 categorías predefinidas
- Estructura de base de datos automática

## 🔧 Configuración del Proyecto

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Estructura de Carpetas

```
Finance/
├── app/                 # Páginas de Next.js 13+
├── components/          # Componentes React
├── lib/                 # Utilidades y base de datos
├── hooks/               # Custom hooks
├── types/               # Definiciones TypeScript
├── data/                # Base de datos SQLite
├── diagrams/            # Diagramas del proyecto
└── scripts/             # Scripts de setup
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otros Proveedores

- **Netlify**: Compatible con Next.js
- **Railway**: Soporte para SQLite
- **Heroku**: Requiere configuración adicional

## 🔒 Autenticación

El sistema utiliza autenticación basada en cookies:

- Middleware de protección de rutas
- API endpoints para login/logout
- Redirección automática

## 📊 Tecnologías Utilizadas

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de Datos**: SQLite con better-sqlite3
- **Gráficos**: Recharts, TradingView Widgets
- **Autenticación**: Cookies + Middleware
- **Temas**: next-themes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Solución de Problemas

### Error: "better-sqlite3" no se puede compilar

```bash
# En macOS
brew install python

# En Windows
npm install --global windows-build-tools

# En Linux
sudo apt-get install python3 make g++
```

### Error: Base de datos no encontrada

```bash
npm run db:init
```

### Error: Migraciones fallidas

```bash
npm run db:migrate
```

### Error: Setup no completado

```bash
npm run setup
```

## 📞 Soporte

Si encuentras algún problema:

1. Revisa la sección de solución de problemas
2. Verifica que tienes Node.js 18+
3. Ejecuta `npm run setup` nuevamente
4. Abre un issue en el repositorio

---

**¡Disfruta gestionando tus finanzas de manera inteligente! 💰✨**
