export default function JastipTemplate({ products, utils }) {
  return (
    <div className="p-4">
      {products.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden flex mb-4 border border-black/5 transition-transform hover:scale-[1.01]"
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

            {/* Nama Produk */}
            <h3 className={`font-semibold text-base leading-tight text-[#831843] mb-1 ${item.promo ? 'mb-1' : 'mb-2'}`}>
              {item.name}
            </h3>

            {/* Meta Info (Fee) */}
            <div className="text-xs text-gray-500 mb-1.5">
              {item.fee > 0 ? `Fee: ${utils.formatRp(item.fee)}` : "Tanpa Fee Jastip"}
            </div>

            {/* Harga */}
            <div className={`font-bold text-base text-[#be185d]`}>
              {utils.formatRp(item.price)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
