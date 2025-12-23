export default function JastipTemplate({ products, utils }) {
  return (
    <div className="product-list">
      {products.map((item, idx) => (
        <div key={idx} className="product-card">
          <img src={item.img || "https://via.placeholder.com/100"} alt={item.name} className="product-img" />
          <div className="product-info">
            {item.promo && <div className="badge-promo">{item.promo}</div>}
            <h3 className="product-name">{item.name}</h3>
            <div className="product-meta">Fee: {utils.formatRp(item.fee)}</div>
            <div className="product-price">{utils.formatRp(item.price)}</div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .product-list { display: flex; flex-direction: column; gap: 1rem; }
        
        .product-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          height: 100px; /* Sesuai Preview */
        }

        .product-img {
          width: 100px;
          height: 100%;
          object-fit: cover;
          background: #eee;
        }

        .product-info {
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .badge-promo {
          background: #ffedd5;
          color: #c2410c;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          align-self: flex-start;
          margin-bottom: 4px;
          display: inline-block;
        }

        .product-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b; /* Fallback jika var tidak load */
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .product-meta {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .product-price {
          font-weight: 700;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
