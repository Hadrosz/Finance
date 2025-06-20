import { db } from "./database";
import type { Transaction, Category, BitcoinPurchaseDB } from "./database";

export function getTransactions(filters?: {
  category?: string;
  type?: "income" | "expense";
  type_payment?: "credit" | "debit";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}): Transaction[] {
  let query = `
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters?.category) {
    conditions.push("c.name = ?");
    params.push(filters.category);
  }

  if (filters?.type) {
    conditions.push("t.type = ?");
    params.push(filters.type);
  }

  if (filters?.type_payment) {
    conditions.push("t.type_payment = ?");
    params.push(filters.type_payment);
  }

  if (filters?.dateFrom) {
    conditions.push("t.date >= ?");
    params.push(filters.dateFrom);
  }

  if (filters?.dateTo) {
    conditions.push("t.date <= ?");
    params.push(filters.dateTo);
  }

  if (filters?.search) {
    conditions.push("t.title LIKE ?");
    params.push(`%${filters.search}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY t.date DESC, t.created_at DESC";

  return db.prepare(query).all(...params) as Transaction[];
}

export function addTransaction(
  transaction: Omit<Transaction, "id" | "created_at">
): Transaction {
  const insert = db.prepare(`
    INSERT INTO transactions (title, amount, type, type_payment, category_id, date, receipt_image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    transaction.title,
    transaction.amount,
    transaction.type,
    transaction.type_payment,
    transaction.category_id,
    transaction.date,
    transaction.receipt_image
  );

  return db
    .prepare("SELECT * FROM transactions WHERE id = ?")
    .get(result.lastInsertRowid) as Transaction;
}

export function updateTransaction(
  id: number,
  transaction: Partial<Transaction>
): Transaction {
  const fields = Object.keys(transaction).filter(
    (key) => key !== "id" && key !== "created_at"
  );
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => (transaction as any)[field]);

  const update = db.prepare(
    `UPDATE transactions SET ${setClause} WHERE id = ?`
  );
  update.run(...values, id);

  return db
    .prepare("SELECT * FROM transactions WHERE id = ?")
    .get(id) as Transaction;
}

export function deleteTransaction(id: number): void {
  db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
}

export function getCategories(): Category[] {
  return db
    .prepare("SELECT * FROM categories ORDER BY name")
    .all() as Category[];
}

export function addCategory(name: string, color: string): Category {
  const insert = db.prepare(
    "INSERT INTO categories (name, color) VALUES (?, ?)"
  );
  const result = insert.run(name, color);
  return db
    .prepare("SELECT * FROM categories WHERE id = ?")
    .get(result.lastInsertRowid) as Category;
}

export function updateCategory(
  id: number,
  name: string,
  color: string
): Category {
  const update = db.prepare(
    "UPDATE categories SET name = ?, color = ? WHERE id = ?"
  );
  update.run(name, color, id);
  return db
    .prepare("SELECT * FROM categories WHERE id = ?")
    .get(id) as Category;
}

export function deleteCategory(id: number): void {
  // First, update any transactions that use this category to have no category
  db.prepare(
    "UPDATE transactions SET category_id = NULL WHERE category_id = ?"
  ).run(id);
  // Then delete the category
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function getMonthlyStats(year: number, month: number) {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;

  const stats = db
    .prepare(
      `
    SELECT 
      type,
      SUM(amount) as total,
      COUNT(*) as count
    FROM transactions 
    WHERE date >= ? AND date <= ?
    GROUP BY type
  `
    )
    .all(startDate, endDate) as {
    type: string;
    total: number;
    count: number;
  }[];

  const categoryStats = db
    .prepare(
      `
    SELECT 
      c.name,
      c.color,
      SUM(t.amount) as total,
      COUNT(*) as count
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.date >= ? AND t.date <= ?
    GROUP BY c.id, c.name, c.color
    ORDER BY total DESC
  `
    )
    .all(startDate, endDate) as {
    name: string;
    color: string;
    total: number;
    count: number;
  }[];

  return { stats, categoryStats };
}

export function getYearlyData(year: number) {
  const data = db
    .prepare(
      `
    SELECT 
      strftime('%m', date) as month,
      type,
      SUM(amount) as total
    FROM transactions 
    WHERE strftime('%Y', date) = ?
    GROUP BY strftime('%m', date), type
    ORDER BY month
  `
    )
    .all(year.toString()) as { month: string; type: string; total: number }[];

  return data;
}

export function addBitcoinPurchase(purchase: {
  purchase_time: string;
  invested_value: number;
  bitcoin_price: number;
  usd_cop_rate: number;
}): BitcoinPurchaseDB {
  const insert = db.prepare(`
    INSERT INTO bitcoin_purchases (purchase_time, invested_value, bitcoin_price, usd_cop_rate)
    VALUES (?, ?, ?, ?)
  `);
  const result = insert.run(
    purchase.purchase_time,
    purchase.invested_value,
    purchase.bitcoin_price,
    purchase.usd_cop_rate
  );
  return db
    .prepare("SELECT * FROM bitcoin_purchases WHERE id = ?")
    .get(result.lastInsertRowid) as BitcoinPurchaseDB;
}

export function getBitcoinPurchases(): BitcoinPurchaseDB[] {
  return db
    .prepare("SELECT * FROM bitcoin_purchases ORDER BY purchase_time DESC")
    .all() as BitcoinPurchaseDB[];
}
