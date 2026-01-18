export const CartItem = ({ item }) => {
  return (
    <div className="flex gap-4 mb-6 relative">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="text-sm font-medium pr-6">{item.name}</h4>
        <p className="text-gray-400 text-sm">{item.size} 🖊️</p>
        <p className="font-bold mt-1 text-sm">
          Tk {item.price.toLocaleString()}
        </p>

        <div className="flex items-center border w-24 mt-3">
          <button className="px-3 py-1">-</button>
          <span className="flex-1 text-center text-sm">{item.quantity}</span>
          <button className="px-3 py-1">+</button>
        </div>
      </div>
      <button className="absolute top-0 right-0 text-xl">&times;</button>
    </div>
  );
};
