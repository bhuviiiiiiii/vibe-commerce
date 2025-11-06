const BASE = '';

async function http(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) {
    let detail = 'Request failed';
    try {
      const j = await res.json();
      if (j && j.error) detail = j.error;
    } catch {}
    throw new Error(detail);
  }
  return res.json();
}

export async function fetchProducts() {
  return http('/api/products');
}

export async function fetchCart() {
  return http('/api/cart');
}

export async function addToCart(productId, qty) {
  return http('/api/cart', { method: 'POST', body: JSON.stringify({ productId, qty }) });
}

export async function removeCartItem(id) {
  return http(`/api/cart/${id}`, { method: 'DELETE' });
}

export async function checkout(cartItems) {
  return http('/api/checkout', { method: 'POST', body: JSON.stringify({ cartItems }) });
}

export async function updateCartItem(id, qty) {
  return http(`/api/cart/${id}`, { method: 'PUT', body: JSON.stringify({ qty }) });
}


