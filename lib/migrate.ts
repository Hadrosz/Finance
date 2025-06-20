import { db } from "./database";

// Migration script to add type_payment column to existing transactions
export function migrateAddTypePayment() {
  try {
    // Check if the column already exists
    const tableInfo = db
      .prepare("PRAGMA table_info(transactions)")
      .all() as any[];
    const hasTypePayment = tableInfo.some(
      (column) => column.name === "type_payment"
    );

    if (!hasTypePayment) {
      // Add the type_payment column with default value 'debit'
      db.prepare(
        `
        ALTER TABLE transactions 
        ADD COLUMN type_payment TEXT NOT NULL 
        CHECK (type_payment IN ('credit', 'debit')) 
        DEFAULT 'debit'
      `
      ).run();

      console.log(
        "✅ Migration completed: type_payment column added to transactions table"
      );
    } else {
      console.log(
        "ℹ️  type_payment column already exists in transactions table"
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAddTypePayment();
}
