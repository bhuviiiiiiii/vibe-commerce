# Vibe Commerce – Mock E-Com Cart

A minimal full-stack shopping cart app for the Vibe Commerce screening. Implements products, cart, totals, and a mock checkout. Backend uses Node/Express + SQLite; Frontend is React (Vite).

## Tech
- Backend: Node, Express, SQLite (`sqlite3`)
- Frontend: React 18, Vite
- REST APIs with basic error handling

## Getting Started

### 1) Backend

```bash
cd server
npm install
npm run seed   # seeds 5-7 sample products into SQLite
npm run dev    # starts server on http://localhost:4000
```

Optional: sync products from Fake Store API

```bash
npm run sync:fakestore  # clears products & cart, imports first 10 Fake Store items
```

Available endpoints:
- GET `/api/products` – list products
- POST `/api/cart` – body: `{ productId, qty }` – add/update cart
- DELETE `/api/cart/:id` – remove cart item by cart item id
- GET `/api/cart` – current cart and total
- POST `/api/checkout` – body: `{ cartItems }` – returns mock receipt and clears cart

SQLite file is stored at `server/data.sqlite` by default.

### 2) Frontend

```bash
cd client
npm install
npm run dev    # opens Vite dev server on http://localhost:5173
```

Proxy is set so `/api/**` calls target `http://localhost:4000` in dev.

## Project Structure

```
server/
  src/
    index.js        # Express server setup
    sqlite.js       # SQLite connection + schema
    routes.js       # REST API endpoints
    seed.js         # Seeds product data
  package.json
  data.sqlite       # created at runtime

client/
  src/
    App.jsx         # App shell: products + cart + checkout
    api.js          # API helpers
    components/
      ProductGrid.jsx
      Cart.jsx
      CheckoutModal.jsx
    styles.css      # simple responsive styles
  index.html
  vite.config.js
  package.json
```

## Notes
- Cart is associated with a mock user id and persisted in SQLite.
- Checkout is a mock; it returns a receipt and clears the cart.
- Basic error states are displayed in the UI.

## Scripts
- Server: `npm run dev`, `npm run seed`, `npm run sync:fakestore`, `npm start`
- Client: `npm run dev`, `npm run build`, `npm run preview`

## Bonus ideas
- Swap products to fetch from Fake Store API and persist to DB.
- Add quantity update endpoint and UI controls.
- Add unit tests for routes and components.

