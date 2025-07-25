import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import { useCart } from "context/CartContext";
import { formatCurrency } from "helpers/formatCurrency";
import Layout from "layout/Layout";
import { ShoppingCart } from "react-feather";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartData, isLoading, cartSubtotal } = useCart();
  const isCartEmpty = !cartData?.items?.length;

  /** ✅ Empty Cart State */
  if (isCartEmpty) {
    return (
      <Layout title="Cart" loading={isLoading}>
        <div className="flex flex-col justify-center items-center py-20 text-center space-y-6">
          <ShoppingCart size={140} className="text-[#7A0BC0]" />
          <h1 className="text-4xl font-heading font-bold text-gray-800">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 text-lg">
            Looks like you haven’t added anything yet.
          </p>
          <Button
            tag={Link}
            to="/"
            className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-md"
          >
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  /** ✅ Cart Table */
  return (
    <Layout title="Cart" loading={isLoading || cartData === undefined}>
      <div className="max-w-6xl mx-auto px-4">
        {/* ✅ Title */}
        <h1 className="my-12 text-center text-4xl font-heading font-extrabold text-[#7A0BC0]">
          Your Shopping Cart
        </h1>

        <TableContainer className="bg-white shadow-lg rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#FFD6E0] to-[#E4B1F0]">
                <TableCell className="font-semibold text-gray-800 text-lg">Product</TableCell>
                <TableCell className="font-semibold text-gray-800 text-lg">Price</TableCell>
                <TableCell className="font-semibold text-gray-800 text-lg">Quantity</TableCell>
                <TableCell className="font-semibold text-gray-800 text-lg">Total</TableCell>
                <TableCell className="font-semibold text-gray-800 text-lg">Remove</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartData?.items?.map((item) => (
                <TableRow
                  key={item.product_id}
                  className="hover:bg-gray-50 transition"
                >
                  {/* ✅ Show Product Image + Name */}
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={item.image_url || "https://placehold.co/60x60?text=No+Image"}
                      alt={item.name || "Product"}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </TableCell>

                  {/* ✅ Price */}
                  <TableCell className="text-gray-700 font-semibold">
                    {formatCurrency(item.price)}
                  </TableCell>

                  {/* ✅ Quantity */}
                  <TableCell>
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-l"
                        onClick={() => item.decrement(item.product_id)}
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-r"
                        onClick={() => item.increment(item.product_id)}
                      >
                        +
                      </button>
                    </div>
                  </TableCell>

                  {/* ✅ Total */}
                  <TableCell className="font-semibold text-gray-800">
                    {formatCurrency(item.subtotal)}
                  </TableCell>

                  {/* ✅ Remove */}
                  <TableCell>
                    <button
                      onClick={() => item.remove(item.product_id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* ✅ Footer */}
          <TableFooter className="flex flex-col sm:flex-row justify-between items-center p-6 bg-[#FFF0F5] border-t border-[#FFD6E0] space-y-4 sm:space-y-0">
            <div className="text-xl font-semibold text-gray-800">
              Total:{" "}
              <span className="text-[#7A0BC0] font-bold">
                {formatCurrency(cartSubtotal)}
              </span>
            </div>
            <Button
              tag={Link}
              to="/cart/checkout"
              state={{ fromCartPage: true }}
              className="bg-[#03DAC6] hover:bg-[#018786] text-gray-900 font-bold px-8 py-3 rounded-lg shadow-md transition-all"
            >
              Proceed to Checkout
            </Button>
          </TableFooter>
        </TableContainer>
      </div>
    </Layout>
  );
};

export default Cart;
