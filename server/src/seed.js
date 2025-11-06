import { getDb, get, run } from './sqlite.js';

const sampleProducts = [
  { id: 1, name: 'Wireless Headphones', price: 79.99 },
  { id: 2, name: 'Smartwatch', price: 129.99 },
  { id: 3, name: 'Bluetooth Speaker', price: 49.5 },
  { id: 4, name: 'Portable Charger', price: 24.99 },
  { id: 5, name: 'USB-C Cable', price: 9.99 },
  { id: 6, name: 'Gaming Mouse', price: 39.99 },
  { id: 7, name: 'Mechanical Keyboard', price: 89.0 }
];

async function seed() {
  const db = await getDb();
  const existing = await get(db, 'SELECT COUNT(*) as count FROM products');
  if (existing.count > 0) {
    // eslint-disable-next-line no-console
    console.log('Products already seeded');
    return;
  }

  for (const p of sampleProducts) {
    await run(db, 'INSERT INTO products (id, name, price) VALUES (?, ?, ?)', [p.id, p.name, p.price]);
  }
  // eslint-disable-next-line no-console
  console.log('Seeded products');
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed', err);
  process.exit(1);
});


