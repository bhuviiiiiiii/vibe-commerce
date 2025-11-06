import React from 'react';

export default function Cart({ cart, onRemove, onUpdateQty }) {
  if (!cart.items.length) return <div className="info">Cart is empty</div>;
  return (
    <div className="cart">
      {cart.items.map((item) => (
        <div className="cart-row" key={item.id}>
          <div className="cart-name">{item.name}</div>
          <div className="cart-qty">
            <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>-</button>
            <span style={{ padding: '0 8px' }}>x{item.qty}</span>
            <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <div className="cart-price">${item.price.toFixed(2)}</div>
          <div className="cart-line">${Number(item.lineTotal).toFixed(2)}</div>
          <button className="danger" onClick={() => onRemove(item.id)}>Remove</button>
        </div>
      ))}
      <div className="cart-total">Total: ${cart.total.toFixed(2)}</div>
    </div>
  );
}


