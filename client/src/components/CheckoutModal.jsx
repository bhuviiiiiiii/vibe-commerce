import React, { useState } from 'react';

export default function CheckoutModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  if (!open) return null;

  function submit(e) {
    e.preventDefault();
    if (!name || !email) return;
    onSubmit({ name, email });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Checkout</h3>
        <form onSubmit={submit} className="form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
          </label>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button className="primary" type="submit" disabled={!name || !email}>Pay (Mock)</button>
          </div>
        </form>
      </div>
    </div>
  );
}


