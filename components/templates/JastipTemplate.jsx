export default function JastipTemplate({ shop, products, utils }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>{shop.name}</h1>
      <p>{shop.desc}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
        {products.map((p, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 12 }}>
            {p.img && <img src={p.img} style={{ width: "100%", height: 120, objectFit: "cover" }} />}
            <h4>{p.name}</h4>
            <p>{utils.formatRp(p.price)}</p>
            <small>Fee: {utils.formatRp(p.fee)}</small>
            {p.promo && <span style={{ color: "green" }}> {p.promo}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
