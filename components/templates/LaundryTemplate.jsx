export default function LaundryTemplate({ shop, products, utils }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>🧺 {shop.name}</h1>

      {products.map((p, i) => (
        <div key={i} style={{ padding: 10, borderBottom: "1px dashed #ccc" }}>
          <strong>{p.name}</strong>
          <div>Kategori: {p.category}</div>
          <div>Harga: {utils.formatRp(p.price)}</div>
        </div>
      ))}
    </div>
  );
}
