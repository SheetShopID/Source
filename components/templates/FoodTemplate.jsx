export default function FoodTemplate({ shop, products, utils }) {
  return (
    <div style={{ padding: 20, background: "#fff8f0" }}>
      <h1>🍽 {shop.name}</h1>

      {products.map((p, i) => (
        <div key={i} style={{ display: "flex", marginBottom: 12, borderBottom: "1px solid #eee" }}>
          {p.img && <img src={p.img} width={100} height={80} style={{ objectFit: "cover" }} />}
          <div style={{ marginLeft: 12 }}>
            <h4>{p.name}</h4>
            <strong>{utils.formatRp(p.price)}</strong>
            {p.promo && <div style={{ color: "green" }}>{p.promo}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
