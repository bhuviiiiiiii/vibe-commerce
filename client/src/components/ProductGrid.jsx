import React from 'react';

export default function ProductGrid({ products, onAdd }) {
  if (!products.length) return <div className="info">No products</div>;
  return (
    <div className="grid">
      {products.map((p) => (
        <div className="card" key={p.id}>
          <div className="card-title">{p.name}</div>
          <div className="card-price">${p.price.toFixed(2)}</div>
          <button className="primary" onClick={() => onAdd(p.id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}


