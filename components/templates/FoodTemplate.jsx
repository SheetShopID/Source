export default function FoodTemplate({ products, utils }) {
  return (
    <div className="p-4 space-y-4">
      {products.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden flex h-36 border border-gray-100">
          <div className="w-36 h-full bg-gray-100 flex-shrink-0">
             <img src={item.img || "https://via.placeholder.com/300"} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
              <span className="text-xs text-gray-500">{item.category}</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-orange-600 font-extrabold text-2xl">{utils.formatRp(item.price)}</div>
              {item.promo && <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">{item.promo}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/*tes*/
