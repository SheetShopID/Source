// components/templates/FoodTemplate.jsx

export default function FoodTemplate({ products, utils }) {
  // --- LOGIC: GROUPING KATEGORI ---
  // Kita mengubah array produk flat menjadi object berdasarkan kategori
  // Contoh: { "Makanan Berat": [...], "Minuman": [...] }
  const groupedProducts = products.reduce((groups, product) => {
    // Jika kategori kosong, beri default "Menu Lainnya"
    const category = product.category && product.category.trim() !== "" ? product.category : "Menu Lainnya";
    
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    
    return groups;
  }, {});

  // Ambil semua nama kategori unik untuk di-loop
  const categories = Object.keys(groupedProducts);

  // Jika tidak ada produk sama sekali
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🍽️</div>
        <h3>Belum ada menu</h3>
        <p>Silakan cek kembali nanti.</p>
      </div>
    );
  }

  return (
    <div className="food-container">
      
      {/* --- 1. HEADER TOKO (Local Header) --- */}
      {/*
      <div className="store-header">
        <div className="store-avatar">
          🍔
        </div>
        <div className="store-info">
          <h1 className="store-name">Nama Toko Anda</h1>
          <p className="store-desc">Makanan lezat langsung dari dapur kami ke meja Anda.</p>
        </div>
      </div>
      */}

      {/* --- 2. LIST KATEGORI & PRODUK --- */}
      <div className="menu-list">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="category-section">
            
            {/* Judul Kategori */}
            <div className="category-header">
              <span className="category-title">{category}</span>
              <div className="category-line"></div>
            </div>

            {/* List Produk dalam Kategori */}
            <div className="product-group">
              {groupedProducts[category].map((item, idx) => (
                <div key={idx} className="food-card">
                  
                  {/* Kiri: Gambar Produk */}
                  <div className="card-image-wrapper">
                    {item.img ? (
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="card-img" 
                      />
                    ) : (
                      // Placeholder jika gambar kosong
                      <div className="card-img-placeholder">
                        📷
                      </div>
                    )}

                    {/* Badge Promo di pojok gambar */}
                    {item.promo && (
                      <span className="promo-badge">PROMO</span>
                    )}
                  </div>

                  {/* Kanan: Detail Produk */}
                  <div className="card-content">
                    <div className="product-top">
                      <h3 className="product-name">{item.name}</h3>
                      {item.promo && (
                        <span className="promo-text">{item.promo}</span>
                      )}
                    </div>

                    <p className="product-desc">Menu pilihan terbaik hari ini.</p>

                    <div className="price-wrapper">
                      <div className="price-info">
                        <div className="price-main">
                          {utils.formatRp(item.price)}
                        </div>
                        
                        {/* Fee Kecil di bawah harga */}
                        {item.fee > 0 && (
                          <div className="price-fee">
                            + Fee {utils.formatRp(item.fee)}
                          </div>
                        )}
                      </div>

                      {/* Tombol '+' ala GoFood */}
                      <button className="add-btn">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spacer di akhir kategori */}
            <div className="category-spacer" />
          </div>
        ))}
      </div>

      {/* --- STYLES (GoFood / ShopeeFood Vibe) --- */}
      <style jsx>{`
        /* CONTAINER */
        .food-container {
          background-color: #fafafa;
          min-height: 100vh;
          padding-bottom: 100px; /* Spacer untuk tombol WA yang ada di ShopPage */
        }

        /* --- HEADER TOKO --- */
        .store-header {
          background: white;
          padding: 24px 16px;
          display: flex;
          gap: 16px;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .store-avatar {
          width: 56px;
          height: 56px;
          background: #ff6b00;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
          flex-shrink: 0;
        }

        .store-info {
          flex: 1;
        }

        .store-name {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 4px 0;
          color: #1a1a1a;
        }

        .store-desc {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        /* --- KATEGORI --- */
        .menu-list {
          padding: 16px;
          max-width: 600px;
          margin: 0 auto;
        }

        .category-header {
          display: flex;
          align-items: center;
          margin: 24px 0 12px 0;
          gap: 12px;
        }

        .category-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .category-line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .category-spacer {
          height: 20px;
        }

        /* --- CARD PRODUK (Horizontal) --- */
        .food-card {
          background: white;
          border-radius: 12px;
          display: flex;
          margin-bottom: 16px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .food-card:active {
          transform: scale(0.99);
        }

        /* IMAGE AREA */
        .card-image-wrapper {
          position: relative;
          width: 100px; /* Lebar tetap agar rapi */
          flex-shrink: 0;
        }

        .card-img {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          object-fit: cover;
          background-color: #f3f4f6;
        }

        .card-img-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #9ca3af;
        }

        .promo-badge {
          position: absolute;
          top: 0;
          left: 0;
          background: #ff3b30;
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-top-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }

        /* CONTENT AREA */
        .card-content {
          flex: 1;
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-top {
          margin-bottom: 4px;
        }

        .product-name {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .promo-text {
          font-size: 11px;
          color: #ff3b30;
          font-weight: 600;
          background: #fff1f0;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }

        .product-desc {
          font-size: 12px;
          color: #9ca3af;
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* PRICE & ACTION AREA */
        .price-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-info {
          display: flex;
          flex-direction: column;
        }

        .price-main {
          font-size: 16px;
          font-weight: 800;
          color: #ff5722; /* Warna Harga khas GoFood/Shopee */
          line-height: 1.2;
        }

        .price-fee {
          font-size: 11px;
          color: #6b7280;
          margin-top: 2px;
        }

        .add-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e5e7eb;
          color: #ff5722;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-btn:hover {
          background: #ff5722;
          color: white;
          border-color: #ff5722;
        }

        /* EMPTY STATE */
        .empty-state {
          padding: 60px 20px;
          text-align: center;
          background: white;
          margin: 16px;
          border-radius: 12px;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; display: block; }
        .empty-state h3 { margin: 0 0 8px 0; color: #1a1a1a; }
        .empty-state p { margin: 0; color: #9ca3af; font-size: 14px; }

        @media (min-width: 600px) {
          .card-image-wrapper { width: 120px; }
          .card-img { width: 120px; height: 120px; }
        }
      `}</style>
    </div>
  );
}

