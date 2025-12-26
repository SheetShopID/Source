export default function JastipTemplate({ products, utils, addToCart, setSelectedProduct }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12, margin: "0 14px" }}>
      {products.map((item, idx) => (
        <div key={idx} onClick={() => setSelectedProduct(item)} style={{
          background: "#fff",
          padding: 12,
          borderRadius: 16,
          border: "1px solid #eef6ee",
          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
          transition: "0.22s cubic-bezier(.25,.1,.25,1)"
        }}>
          <div style={{ height: 115, borderRadius: 12, background: "linear-gradient(135deg, #f3f9f3, #ffffff)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src={item.img || "https://via.placeholder.com/100"} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {item.promo && <div style={{ background: "#ffedd5", color: "#c2410c", fontSize: 10, padding: "2px 6px", borderRadius: 4, marginTop: 4, display: "inline-block" }}>{item.promo}</div>}
          <div style={{ fontSize: 13, fontWeight: 600, margin: "8px 0 3px" }}>{item.name}</div>
          <div style={{ fontSize: 12, color: "#6b6b6b" }}>{item.shopName}</div>
          <div style={{ fontWeight: 700, fontSize: 13, margin: "4px 0 4px" }}>{utils.formatRp(item.price)} + Fee {utils.formatRp(item.fee)}</div>
          <button style={{ width: "100%", padding: 8, borderRadius: 12, border: "1px solid #cfe9c9", color: "#2f8f4a", marginBottom: 6 }} onClick={() => addToCart(item)}>+ Titip</button>
          <button style={{ width: "100%", padding: 8, borderRadius: 12, border: "none", background: "#2f8f4a", color: "#fff" }} onClick={() => addToCart(item, true)}>Beli Cepat</button>
        </div>
      ))}
    </section>
  );
}

