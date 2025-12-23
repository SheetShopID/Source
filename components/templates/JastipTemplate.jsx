export default function JastipTemplate({ products, utils, theme }) {
  return (
    <div className="p-4">
      {products.map((item, idx) => (
        <div 
          key={idx} 
          // Card Style: White, Shadow, Radius 8px (sesuai preview)
          className="bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex mb-4 border border-black/5"
        >
          {/* Kiri: Gambar (100px) */}
          <img 
            src={item.img || "https://via.placeholder.com/100"} 
            alt={item.name} 
            className="w-[100px] h-[100px] object-cover shrink-0 bg-gray-100"
          />

          {/* Kanan: Info */}
          <div className="p-3 flex flex-col justify-center w-full">
            
            {/* Badge Promo */}
            {item.promo && (
              <div className="bg-[#ffedd5] text-[#c2410c] text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-1.5">
                {item.promo}
              </div>
            )}

            {/* Nama Produk (Menggunakan theme.text) */}
            <h3 className={`font-semibold text-base leading-tight mb-1 ${theme.text}`}>
              {item.name}
            </h3>

            {/* Meta Info */}
            <div className="text-[0.8rem] text-[#64748b] mb-1.5">
              {item.fee > 0 ? `Fee: ${utils.formatRp(item.fee)}` : "Tanpa Fee Jastip"}
            </div>

            {/* Harga (Menggunakan theme.accent) */}
            <div className={`font-bold text-base ${theme.accent}`}>
              {utils.formatRp(item.price)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
