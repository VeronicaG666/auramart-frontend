import localCart from "helpers/localStorage";
import { createContext, useContext, useEffect, useState } from "react";
import cartService from "services/cart.service";
import { useUser } from "./UserContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState();
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const { isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const syncCart = async () => {
      setIsLoading(true);
      try {
        if (isLoggedIn) {
          const items = localCart.getItems();
          if (items?.length > 0) {
            for (const { product_id, quantity } of items) {
              await cartService.addToCart(product_id, quantity);
            }
            localCart.clearCart();
          }
          const res = await cartService.getCart();
          setCartData(res.data);
        } else {
          const items = localCart.getItems() || [];
          setCartData({ items });
        }
      } catch (err) {
        console.error("Error syncing/fetching cart:", err.response?.data || err);
      } finally {
        setIsLoading(false);
      }
    };
    syncCart();
  }, [isLoggedIn]);

  useEffect(() => {
    const quantity = cartData?.items?.reduce((acc, cur) => acc + Number(cur.quantity), 0) || 0;
    const totalAmt = cartData?.items?.reduce((acc, cur) => acc + Number(cur.subtotal), 0) || 0;
    setCartSubtotal(totalAmt);
    setCartTotal(quantity);
  }, [cartData]);

  const addItem = async (productId, quantity) => {
    if (isLoggedIn) {
      const res = await cartService.addToCart(productId, quantity);
      setCartData(res.data);
    } else {
      try {
        const { data: product } = await axios.get(`${API.defaults.baseURL}/products/id/${productId}`);
        localCart.addItem(product, quantity);
        setCartData({ items: localCart.getItems() });
      } catch (error) {
        console.error("Error fetching product for guest cart:", error);
      }
    }
  };


  const deleteItem = async (product_id) => {
    if (isLoggedIn) {
      const res = await cartService.removeFromCart(product_id);
      setCartData(res.data);
    } else {
      localCart.removeItem(product_id);
      setCartData({ items: localCart.getItems() });
    }
  };

  const increment = async (product_id) => {
    if (isLoggedIn) {
      const res = await cartService.increment(product_id);
      const updatedItems = cartData.items.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      );
      setCartData({ ...cartData, items: updatedItems });
      return res;
    } else {
      localCart.incrementQuantity(product_id);
      setCartData({ ...cartData, items: localCart.getItems() });
    }
  };

  const decrement = async (product_id) => {
    if (isLoggedIn) {
      const res = await cartService.decrement(product_id);
      const updatedItems = cartData.items.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1), subtotal: (item.quantity - 1) * item.price }
          : item
      );
      setCartData({ ...cartData, items: updatedItems });
      return res;
    } else {
      localCart.decrementQuantity(product_id);
      setCartData({ ...cartData, items: localCart.getItems() });
    }
  };


  return (
    <CartContext.Provider
      value={{
        isLoading,
        cartData,
        setCartData,
        addToCart: addItem,
        deleteItem,
        increment,
        decrement,
        cartTotal,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export { CartProvider, useCart };
