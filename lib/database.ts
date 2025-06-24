import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "finance.db");
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
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

  CREATE TABLE IF NOT EXISTS bitcoin_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_time DATETIME NOT NULL,
    invested_value REAL NOT NULL,
    bitcoin_price REAL NOT NULL,
    usd_cop_rate REAL NOT NULL DEFAULT 0
  );
`);

// Add usd_cop_rate to bitcoin_purchases if missing
const tableInfo = db.prepare("PRAGMA table_info(bitcoin_purchases)").all();
const hasUsdCopRate = tableInfo.some((col: any) => col.name === "usd_cop_rate");
if (!hasUsdCopRate) {
  db.prepare(
    "ALTER TABLE bitcoin_purchases ADD COLUMN usd_cop_rate REAL NOT NULL DEFAULT 0"
  ).run();
}

// Insert default user and categories
const insertUser = db.prepare(
  "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)"
);
insertUser.run("Alejandro", "Aldany17!!");

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (name, color) VALUES (?, ?)"
);
const defaultCategories = [
  ["Alimentación", "#F59E0B"],
  ["Transporte", "#3B82F6"],
  ["Entretenimiento", "#8B5CF6"],
  ["Salud", "#10B981"],
  ["Educación", "#F97316"],
  ["Hogar", "#EF4444"],
  ["Ropa", "#EC4899"],
  ["Tecnología", "#6366F1"],
  ["Salario", "#059669"],
  ["Inversiones", "#0891B2"],
  ["Freelance", "#7C3AED"],
  ["Otros", "#6B7280"],
];

defaultCategories.forEach(([name, color]) => {
  insertCategory.run(name, color);
});

export { db };

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category_id: number;
  date: string;
  receipt_image?: string;
  created_at: string;
  category_name?: string;
  category_color?: string;
  type_payment: "debit" | "credit";
}

export interface BitcoinPurchaseDB {
  id: number;
  purchase_time: string; // ISO string with minute and second
  invested_value: number;
  bitcoin_price: number;
  usd_cop_rate: number;
}
