import fetch from 'node-fetch';
import { getDb, run } from './sqlite.js';

async function syncFakeStore() {
  const db = await getDb();
  const resp = await fetch('https://fakestoreapi.com/products');
  if (!resp.ok) throw new Error('Failed to fetch Fake Store API');
  const data = await resp.json();
  const items = Array.isArray(data) ? data.slice(0, 10) : [];

  // Clear existing data to keep ids consistent and avoid FK issues
  await run(db, 'DELETE FROM cart_items');
  await run(db, 'DELETE FROM products');

  for (const p of items) {
    const id = Number(p.id);
    const name = String(p.title || p.name || `Product ${id}`).slice(0, 120);
    const price = Math.max(0.5, Number(p.price || 0));
    await run(db, 'INSERT INTO products (id, name, price) VALUES (?, ?, ?)', [id, name, price]);
  }
  // eslint-disable-next-line no-console
  console.log(`Synced ${items.length} products from Fake Store API`);
}

syncFakeStore().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fake Store sync failed', err);
  process.exit(1);
});


