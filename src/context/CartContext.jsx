import localCart from "helpers/localStorage";
import { createContext, useContext, useEffect, useState } from "react";
import cartService from "services/cart.service";
import { useUser } from "./UserContext";
import API from "api/axios.config"; // ✅ To fetch product details for guest cart

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState();
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const { isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  /** ✅ Sync Cart on Load */
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

  /** ✅ Calculate Totals */
  useEffect(() => {
    const quantity =
      cartData?.items?.reduce((acc, cur) => acc + Number(cur.quantity), 0) || 0;
    const totalAmt =
      cartData?.items?.reduce((acc, cur) => acc + Number(cur.subtotal || cur.price * cur.quantity), 0) || 0;

    setCartSubtotal(totalAmt);
    setCartTotal(quantity);
  }, [cartData]);

  /** ✅ Add Item */
  const addItem = async (productId, quantity) => {
    if (isLoggedIn) {
      const res = await cartService.addToCart(productId, quantity);
      setCartData(res.data);
    } else {
      try {
        // ✅ Fetch product details for guest cart
        const { data: product } = await API.get(`/products/${productId}`);

        const newItem = {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
          subtotal: product.price * quantity,
        };

        localCart.addItem(newItem, quantity); // ✅ Store full details
        setCartData({ items: localCart.getItems() });
      } catch (error) {
        console.error("Error fetching product for guest cart:", error);
      }
    }
  };

  /** ✅ Delete Item */
  const deleteItem = async (product_id) => {
    if (isLoggedIn) {
      const res = await cartService.removeFromCart(product_id);
      setCartData(res.data);
    } else {
      localCart.removeItem(product_id);
      setCartData({ items: localCart.getItems() });
    }
  };

  /** ✅ Increment Quantity */
  const increment = async (product_id) => {
    if (isLoggedIn) {
      const res = await cartService.increment(product_id);
      const updatedItems = cartData.items.map((item) =>
        item.product_id === product_id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price,
            }
          : item
      );
      setCartData({ ...cartData, items: updatedItems });
      return res;
    } else {
      localCart.incrementQuantity(product_id);
      setCartData({ ...cartData, items: localCart.getItems() });
    }
  };

  /** ✅ Decrement Quantity */
  const decrement = async (product_id) => {
    if (isLoggedIn) {
      const res = await cartService.decrement(product_id);
      const updatedItems = cartData.items.map((item) =>
        item.product_id === product_id
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
              subtotal: (item.quantity - 1) * item.price,
            }
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
