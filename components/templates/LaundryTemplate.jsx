export default function LaundryTemplate({ products, utils }) {
  return (
    <div className="bg-white min-h-screen">
      {products.map((item, idx) => (
        <div key={idx} className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-sky-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-2xl">🧺</div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{item.category}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-sky-700 text-lg">{utils.formatRp(item.price)}</div>
            <div className="text-[10px] text-gray-400">/ item</div>
          </div>
        </div>
      ))}
      <div className="h-24"></div>
    </div>
  );
}
