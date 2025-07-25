class LocalCart {
  isExist = (id) => !!this.getItem(id);

  getItems = () => JSON.parse(localStorage.getItem("__cart")) || [];

  getItem = (id) => this.getItems().find((product) => product.id === id);

  saveItems = (data) => localStorage.setItem("__cart", JSON.stringify(data));

  removeItem = (id) =>
    this.saveItems(this.getItems().filter((product) => product.id !== id));

  incrementQuantity = (id) =>
    this.saveItems(
      this.getItems().map((prod) => {
        if (id === prod.id) {
          prod.quantity += 1;
          prod.subtotal = parseFloat(prod.price) * prod.quantity;
        }
        return prod;
      })
    );

  decrementQuantity = (id) =>
    this.saveItems(
      this.getItems().map((prod) => {
        if (id === prod.id) {
          prod.quantity = Math.max(1, prod.quantity - 1);
          prod.subtotal = parseFloat(prod.price) * prod.quantity;
        }
        return prod;
      })
    );

  addItem = (product, quantity = 1) => {
    const items = this.getItems();
    const existing = items.find((p) => p.id === product.id);

    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = parseFloat(existing.price) * existing.quantity;
    } else {
      const newItem = {
        ...product,
        quantity,
        subtotal: parseFloat(product.price) * quantity,
      };
      items.push(newItem);
    }

    this.saveItems(items);
  };

  clearCart = () => localStorage.removeItem("__cart");
}

export default new LocalCart();
