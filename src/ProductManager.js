import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProductsFromFile();

    if (!product.title || !product.description || !product.price || !product.code || product.stock === undefined) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    if (products.some(existingProduct => existingProduct.code === product.code)) {
      console.log("Error: El código del producto ya existe. Debe ser único.");
      return;
    }

    const newProduct = {
      id: this.getNextProductId(products),
      ...product,
    };

    products.push(newProduct);
    this.saveProductsToFile(products);
  }

  updateProduct(id, updatedProduct) {
    const products = this.getProductsFromFile();
    const index = products.findIndex((product) => product.id === id);

    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      this.saveProductsToFile(products);
      return true;
    }

    return false;
  }

  deleteProduct(id) {
    let products = this.getProductsFromFile();
    const initialLength = products.length;
    products = products.filter((product) => product.id !== id);

    if (products.length !== initialLength) {
      this.saveProductsToFile(products);
      return true;
    }

    return false;
  }

  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading file:", error); 
      return [];
    }
  }

  saveProductsToFile(products) {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(this.path, data);
  }

  getProducts() {
    return this.getProductsFromFile();
  }

  getProductById(id) {
    const products = this.getProductsFromFile();
    return products.find((product) => product.id === id);
  }

  getNextProductId(products) {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }
}

export default ProductManager;