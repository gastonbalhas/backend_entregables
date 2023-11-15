import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; 
import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productFilePath = join(__dirname, 'products.json'); 

const productManager = new ProductManager(productFilePath);


app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor de productos!");
});

app.get("/products", async (req, res) => {
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

app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (!isNaN(productId)) {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    } else {
      res.status(400).send('ID de producto no válido');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(PORT, () => console.log(`Server Listening on port ${PORT}`));
