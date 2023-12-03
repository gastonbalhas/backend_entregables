import fs from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCartById(cartId) {
    const cartData = this.getCartFromFile();
    return cartData.find((cart) => cart.id === cartId);
  }

  addProductToCart(cartId, productId, quantity) {
    const cartData = this.getCartFromFile();
    const cartIndex = cartData.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      const productToAdd = { productId, quantity };
      cartData[cartIndex].products.push(productToAdd);
      this.saveCartToFile(cartData);
      return true;
    }

    return false;
  }

  updateProductQuantity(cartId, productId, newQuantity) {
    const cartData = this.getCartFromFile();
    const cartIndex = cartData.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      const productIndex = cartData[cartIndex].products.findIndex(
        (product) => product.productId === productId
      );

      if (productIndex !== -1) {
        cartData[cartIndex].products[productIndex].quantity = newQuantity;
        this.saveCartToFile(cartData);
        return true;
      }
    }

    return false;
  }

  removeProductFromCart(cartId, productId) {
    const cartData = this.getCartFromFile();
    const cartIndex = cartData.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      cartData[cartIndex].products = cartData[cartIndex].products.filter(
        (product) => product.productId !== productId
      );
      this.saveCartToFile(cartData);
      return true;
    }

    return false;
  }

  getCartFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  saveCartToFile(cartData) {
    const data = JSON.stringify(cartData, null, 2);
    fs.writeFileSync(this.path, data);
  }
}

export default CartManager;
