"use client";

export default function CartBar({ cart, onCheckout }) {
  const totalQty = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce(
    (a, b) => a + b.price * b.qty + (b.fee || 0) * b.qty,
    0
  );

  if (totalQty === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        background: "#000",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div>
        🛒 {totalQty} item <br />
        <strong>Rp {totalPrice.toLocaleString()}</strong>
      </div>

      <button
        onClick={onCheckout}
        style={{
          background: "#25D366",
          border: "none",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Checkout WA
      </button>
    </div>
  );
}
