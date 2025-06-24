# 🚀 Instalación Rápida - FinanceHub

## ⚡ Setup en 4 Pasos

### 1. Clonar y Entrar

```bash
git clone <tu-repositorio>
cd Finance
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Proyecto

```bash
npm run setup
```

### 4. Ejecutar

```bash
npm run dev
```

## 🔑 Credenciales de Acceso

- **Usuario**: `Alejandro`
- **Contraseña**: `Aldany17!!`

## 🌐 Acceso

Abre tu navegador en: `http://localhost:3000`

---

## 🛠️ Si Algo Sale Mal

### Verificar Node.js

```bash
node --version  # Debe ser 18+
npm --version   # Debe estar instalado
```

### Reinstalar Todo

```bash
rm -rf node_modules package-lock.json
npm install
npm run setup
```

### Problemas de Base de Datos

```bash
npm run db:init
npm run db:migrate
```
