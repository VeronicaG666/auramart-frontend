import API from "../api/axios.config";

class CartService {
  getCart() {
    return API.get("/cart");
  }

  addToCart(productId, quantity) {
    return API.post("/cart/add", { product_id: productId, quantity });
  }

  removeFromCart(product_id) {
    return API.delete("/cart/delete", { data: { product_id } });
  }

  increment(product_id) {
    return API.put("/cart/increment", { product_id });
  }

  decrement(product_id) {
    return API.put("/cart/decrement", { product_id });
  }
}

export default new CartService();
