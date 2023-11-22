import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productFilePath = join(__dirname, 'products.json');
const cartFilePath = join(__dirname, 'cart.json');

const productManager = new ProductManager(productFilePath);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor de productos y carritos!");
});

app.get("/api/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const allProducts = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.json(allProducts.slice(0, limit));
    } else {
      res.json(allProducts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (isNaN(productId) || !product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post("/api/products", (req, res) => {
  try {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).send('Producto agregado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor al agregar el producto');
  }
});

app.put("/api/products/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;

    if (isNaN(productId)) {
      res.status(400).send('ID de producto no válido');
      return;
    }

    const success = productManager.updateProduct(productId, updatedProduct);

    if (success) {
      res.status(200).send('Producto actualizado exitosamente');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor al actualizar el producto');
  }
});

app.delete("/api/products/:pid", (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    if (isNaN(productId)) {
      res.status(400).send('ID de producto no válido');
      return;
    }

    const success = productManager.deleteProduct(productId);

    if (success) {
      res.status(200).send('Producto eliminado exitosamente');
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor al eliminar el producto');
  }
});

app.post("/api/carts", (req, res) => {
  try {
    const newCartId = generateUniqueId();
    const newCart = { id: newCartId, products: [] };

    fs.writeFileSync(cartFilePath, JSON.stringify(newCart, null, 2));

    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get("/api/carts/:cid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartData = fs.readFileSync(cartFilePath, 'utf-8');
    const cart = JSON.parse(cartData);

    if (cart.id === cartId) {
      res.json(cart.products);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post("/api/carts/:cid/product/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity);

    const cartData = fs.readFileSync(cartFilePath, 'utf-8');
    const cart = JSON.parse(cartData);

    if (cart.id === cartId) {
      const productToAdd = { id: productId, quantity: quantity || 1 };

      const existingProductIndex = cart.products.findIndex(product => product.id === productId);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity || 1;
      } else {
        cart.products.push(productToAdd);
      }

      fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));

      res.status(200).send('Producto agregado al carrito');
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(PORT, () => console.log(`Server Listening on port ${PORT}`));

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
