import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data.sqlite');

let dbInstance = null;

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function getDb() {
  if (dbInstance) return dbInstance;

  ensureDirExists(DB_PATH);
  sqlite3.verbose();
  dbInstance = new sqlite3.Database(DB_PATH);

  await run(dbInstance, `PRAGMA foreign_keys = ON;`);

  // Create schema if not exists
  await run(
    dbInstance,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL
    );`
  );

  await run(
    dbInstance,
    `CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL CHECK (qty > 0),
      UNIQUE(user_id, product_id),
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );`
  );

  return dbInstance;
}

export function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export const MOCK_USER_ID = 'mock-user-1';


