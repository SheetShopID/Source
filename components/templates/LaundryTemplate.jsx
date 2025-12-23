export default function LaundryTemplate({ products, utils }) {
  return (
    <div className="product-list">
      {products.map((item, idx) => (
        <div key={idx} className="product-card">
          {/* Kiri: Gambar / Ikon Area 100px tes */}
          <img 
            src={item.img || "https://via.placeholder.com/100"} 
            alt={item.name} 
            className="product-img" 
          />
          
          {/* Kanan: Info */}
          <div className="product-info">
            
            {/* Badge Promo */}
            {item.promo && (
              <div className="badge-promo">{item.promo}</div>
            )}

            {/* Nama Produk */}
            <h3 className="product-name">{item.name}</h3>

            {/* Meta Info (Layanan) */}
            <div className="product-meta">
              {item.category || "Layanan Cuci"}
            </div>

            {/* Harga (Warna Biru) */}
            <div className="product-price">
              {utils.formatRp(item.price)}
            </div>
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
          /* Penting: Sesuai ukuran preview */
        }

        .product-img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          background: #eee;
          flex-shrink: 0;
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
          font-size: 14px; /* 0.95rem */
          color: #0c4a6e; /* Warna Teks Laundry */
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .product-meta {
          font-size: 12px; /* 0.8rem */
          color: #64748b;
          margin-bottom: 6px;
        }

        .product-price {
          color: #0369a1; /* Warna Aksen Laundry */
          font-weight: 700;
          font-size: 16px; /* 1rem */
        }
      `}</style>
    </div>
  );
}

