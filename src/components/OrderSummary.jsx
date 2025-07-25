import { useCart } from "context/CartContext";
import { formatCurrency } from "helpers/formatCurrency";

const OrderSummary = () => {
  const { cartData, cartSubtotal } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-purple-100">
      <h1 className="text-2xl font-semibold text-purple-700 mb-4">Order Summary</h1>

      {cartData?.items.map((item) => (
        <div
          key={item.product_id}
          className="flex border-b border-gray-200 py-3 items-center gap-4"
        >
          {/* Product Image */}
          <img
            className="w-24 h-24 object-cover rounded-md border border-purple-100"
            loading="lazy"
            decoding="async"
            src={item.image_url}
            alt={item.name}
          />

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <span className="text-lg font-semibold text-gray-800">{item.name}</span>
            <span className="text-purple-700 font-bold">{formatCurrency(item.price)}</span>
            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
          </div>
        </div>
      ))}

      {/* Total */}
      <p className="text-2xl font-bold text-right text-purple-700 mt-4">
        Total: {formatCurrency(cartSubtotal)}
      </p>
    </div>
  );
};

export default OrderSummary;
