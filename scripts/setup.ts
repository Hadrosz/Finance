#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Iniciando setup del proyecto Finance...\n");

// Función para ejecutar comandos
function runCommand(command: string, description: string) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error);
    process.exit(1);
  }
}

// Función para crear directorios si no existen
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Directorio creado: ${dirPath}`);
  }
}

// Función para verificar si Node.js está instalado
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion < 18) {
    console.error("❌ Node.js 18 o superior es requerido");
    console.error(`   Versión actual: ${nodeVersion}`);
    process.exit(1);
  }

  console.log(`✅ Node.js ${nodeVersion} detectado\n`);
}

// Función para verificar si npm está disponible
function checkNpm() {
  try {
    execSync("npm --version", { stdio: "pipe" });
    console.log("✅ npm detectado\n");
  } catch (error) {
    console.error("❌ npm no está disponible");
    process.exit(1);
  }
}

// Función para inicializar la base de datos
function initializeDatabase() {
  console.log("🗄️  Inicializando base de datos...");

  // Crear directorio data si no existe
  ensureDirectoryExists("data");

  // Importar y ejecutar la inicialización de la base de datos
  try {
    require("../lib/database");
    console.log("✅ Base de datos inicializada correctamente\n");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
}

// Función para ejecutar migraciones
function runMigrations() {
  console.log("🔄 Ejecutando migraciones...");

  try {
    // Importar y ejecutar migraciones
    const { migrateAddTypePayment } = require("../lib/migrate");
    migrateAddTypePayment();
    console.log("✅ Migraciones completadas\n");
  } catch (error) {
    console.error("❌ Error al ejecutar migraciones:", error);
    process.exit(1);
  }
}

// Función principal
async function main() {
  try {
    // Verificaciones iniciales
    checkNodeVersion();
    checkNpm();

    // Instalar dependencias
    runCommand("npm install", "Instalando dependencias");

    // Crear directorios necesarios
    ensureDirectoryExists("data");
    ensureDirectoryExists("diagrams");

    // Inicializar base de datos
    initializeDatabase();

    // Ejecutar migraciones
    runMigrations();

    console.log("🎉 ¡Setup completado exitosamente!");
    console.log("\n📋 Próximos pasos:");
    console.log("   1. Ejecuta: npm run dev");
    console.log("   2. Abre: http://localhost:3000");
    console.log("   3. Inicia sesión con: Alejandro / Aldany17!!");
    console.log("\n🔧 Comandos útiles:");
    console.log("   - npm run dev     : Iniciar servidor de desarrollo");
    console.log("   - npm run build   : Construir para producción");
    console.log("   - npm run start   : Iniciar servidor de producción");
    console.log("   - npm run lint    : Ejecutar linter");
  } catch (error) {
    console.error("❌ Error durante el setup:", error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}
