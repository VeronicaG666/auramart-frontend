class LocalCart {
  key = "__cart";

  /** ✅ Get all items from cart */
  getItems = () => JSON.parse(localStorage.getItem(this.key)) || [];

  /** ✅ Save cart data to localStorage */
  saveItems = (data) => localStorage.setItem(this.key, JSON.stringify(data));

  /** ✅ Check if product exists */
  isExist = (id) => !!this.getItems().find((p) => p.product_id === id);

  /** ✅ Get single item */
  getItem = (id) => this.getItems().find((p) => p.product_id === id);

  /** ✅ Add product with full details */
  addItem = (product, quantity = 1) => {
    const items = this.getItems();
    const existing = items.find((p) => p.product_id === product.product_id);

    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = parseFloat(existing.price) * existing.quantity;
    } else {
      const newItem = {
        product_id: product.product_id,
        name: product.name,
        price: parseFloat(product.price),
        image_url: product.image_url || null,
        quantity,
        subtotal: parseFloat(product.price) * quantity,
      };
      items.push(newItem);
    }

    this.saveItems(items);
  };

  /** ✅ Remove product */
  removeItem = (id) => {
    this.saveItems(this.getItems().filter((p) => p.product_id !== id));
  };

  /** ✅ Increment quantity */
  incrementQuantity = (id) => {
    const items = this.getItems().map((p) => {
      if (p.product_id === id) {
        p.quantity += 1;
        p.subtotal = parseFloat(p.price) * p.quantity;
      }
      return p;
    });
    this.saveItems(items);
  };

  /** ✅ Decrement quantity */
  decrementQuantity = (id) => {
    const items = this.getItems().map((p) => {
      if (p.product_id === id) {
        p.quantity = Math.max(1, p.quantity - 1);
        p.subtotal = parseFloat(p.price) * p.quantity;
      }
      return p;
    });
    this.saveItems(items);
  };

  /** ✅ Clear cart */
  clearCart = () => localStorage.removeItem(this.key);
}

export default new LocalCart();
