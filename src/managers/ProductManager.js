import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '../data/products.json');
  }

  addProduct(product) {
    const products = this.getProductsFromFile();

    if (!product.title || !product.description || !product.price || !product.code || product.stock === undefined || !product.category || product.status === undefined) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    if (products.some(existingProduct => existingProduct.code === product.code)) {
      console.log("Error: El código del producto ya existe. Debe ser único.");
      return;
    }

    // Validación para el campo 'category' y 'status'
    if (!['Electronics', 'Clothing', 'Food', 'Books'].includes(product.category)) {
      console.log("Error: La categoría del producto es inválida.");
      return;
    }

    if (typeof product.status !== 'boolean') {
      console.log("Error: El estado del producto debe ser un booleano.");
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