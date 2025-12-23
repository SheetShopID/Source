export default function JastipTemplate({ products, utils }) {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {products.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
          <div className="aspect-square bg-gray-100 relative">
            <img src={item.img || "https://via.placeholder.com/300"} alt={item.name} className="w-full h-full object-cover" />
            {item.promo && <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded">{item.promo}</span>}
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <h3 className="font-bold text-sm text-gray-800 line-clamp-2">{item.name}</h3>
            <div className="mt-2">
              <div className="text-blue-600 font-bold text-base">{utils.formatRp(item.price)}</div>
              {item.fee > 0 && <div className="text-[10px] text-gray-400">Fee Jastip: {utils.formatRp(item.fee)}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/*testing*/

