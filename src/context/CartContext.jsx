import { createContext, useContext, useEffect, useState } from "react";
import localCart from "helpers/localStorage";
import cartService from "services/cart.service";
import { useUser } from "./UserContext";
import API from "api/axios.config";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({ items: [] });
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useUser();

  // ✅ Sync Cart
  useEffect(() => {
    const syncCart = async () => {
      setIsLoading(true);
      try {
        if (isLoggedIn) {
          const items = localCart.getItems();
          if (items?.length > 0) {
            for (const { id, quantity } of items) {
              await cartService.addToCart(id, quantity);
            }
            localCart.clearCart();
          }
          const res = await cartService.getCart();
          setCartData(res.data);
        } else {
          setCartData({ items: localCart.getItems() || [] });
        }
      } catch (err) {
        console.error("Error syncing cart:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    syncCart();
  }, [isLoggedIn]);

  // ✅ Calculate totals
  useEffect(() => {
    const quantity =
      cartData?.items?.reduce((acc, cur) => acc + Number(cur.quantity || 0), 0) || 0;
    const totalAmt =
      cartData?.items?.reduce((acc, cur) => acc + Number(cur.subtotal || 0), 0) || 0;
    setCartSubtotal(totalAmt);
    setCartTotal(quantity);
  }, [cartData]);

  // ✅ Add Item
  const addItem = async (productSlug, quantity) => {
    if (isLoggedIn) {
      const res = await cartService.addToCart(productSlug, quantity);
      setCartData(res.data);
    } else {
      try {
        const { data: product } = await API.get(`/products/${productSlug}`);
        localCart.addItem(
          {
            id: product.product_id, // ✅ use product_id
            name: product.name,
            price: product.price,
          },
          quantity
        );
        setCartData({ items: localCart.getItems() });
      } catch (error) {
        console.error("Error fetching product for guest cart:", error);
      }
    }
  };

  const deleteItem = async (productId) => {
    if (isLoggedIn) {
      const res = await cartService.removeFromCart(productId);
      setCartData(res.data);
    } else {
      localCart.removeItem(productId);
      setCartData({ items: localCart.getItems() });
    }
  };

  const increment = async (productId) => {
    if (isLoggedIn) {
      const res = await cartService.increment(productId);
      setCartData(res.data);
      return res;
    } else {
      localCart.incrementQuantity(productId);
      setCartData({ items: localCart.getItems() });
    }
  };

  const decrement = async (productId) => {
    if (isLoggedIn) {
      const res = await cartService.decrement(productId);
      setCartData(res.data);
      return res;
    } else {
      localCart.decrementQuantity(productId);
      setCartData({ items: localCart.getItems() });
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
