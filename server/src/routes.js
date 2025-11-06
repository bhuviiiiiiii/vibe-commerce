import { Router } from 'express';
import { all, get, getDb, run, MOCK_USER_ID } from './sqlite.js';

const router = Router();

// GET /api/products
router.get('/products', async (_req, res) => {
  try {
    const db = await getDb();
    const products = await all(db, 'SELECT id, name, price FROM products ORDER BY id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/cart { productId, qty }
router.post('/cart', async (req, res) => {
  const { productId, qty } = req.body || {};
  if (!Number.isInteger(productId) || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ error: 'Invalid productId or qty' });
  }
  try {
    const db = await getDb();

    const product = await get(db, 'SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const existing = await get(
      db,
      'SELECT id, qty FROM cart_items WHERE user_id = ? AND product_id = ?',
      [MOCK_USER_ID, productId]
    );

    if (existing) {
      await run(db, 'UPDATE cart_items SET qty = ? WHERE id = ?', [existing.qty + qty, existing.id]);
    } else {
      await run(db, 'INSERT INTO cart_items (user_id, product_id, qty) VALUES (?, ?, ?)', [
        MOCK_USER_ID,
        productId,
        qty,
      ]);
    }

    const cart = await getCart(db);
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// DELETE /api/cart/:id (cart item id OR product id? Spec says id -> item)
router.delete('/cart/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const db = await getDb();
    await run(db, 'DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, MOCK_USER_ID]);
    const cart = await getCart(db);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// PUT /api/cart/:id { qty }
router.put('/cart/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { qty } = req.body || {};
  if (!Number.isInteger(id) || !Number.isInteger(qty)) {
    return res.status(400).json({ error: 'Invalid id or qty' });
  }
  try {
    const db = await getDb();
    if (qty <= 0) {
      await run(db, 'DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, MOCK_USER_ID]);
    } else {
      await run(db, 'UPDATE cart_items SET qty = ? WHERE id = ? AND user_id = ?', [qty, id, MOCK_USER_ID]);
    }
    const cart = await getCart(db);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// GET /api/cart
router.get('/cart', async (_req, res) => {
  try {
    const db = await getDb();
    const cart = await getCart(db);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/checkout { cartItems }
router.post('/checkout', async (req, res) => {
  try {
    const db = await getDb();
    const cart = await getCart(db);
    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const timestamp = new Date().toISOString();
    // Clear cart after mock checkout
    await run(db, 'DELETE FROM cart_items WHERE user_id = ?', [MOCK_USER_ID]);
    res.json({ receipt: { total: cart.total, timestamp } });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

async function getCart(db) {
  const items = await all(
    db,
    `SELECT c.id as id, p.id as productId, p.name, p.price, c.qty,
            ROUND(p.price * c.qty, 2) as lineTotal
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY c.id` ,
    [MOCK_USER_ID]
  );
  const totalRow = await get(
    db,
    `SELECT ROUND(COALESCE(SUM(p.price * c.qty), 0), 2) as total
     FROM cart_items c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?`,
    [MOCK_USER_ID]
  );
  return { items, total: Number(totalRow?.total || 0) };
}

export default router;


