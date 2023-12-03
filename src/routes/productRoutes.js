import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager('./products.json');

// Obtener todos los productos
productsRouter.get("/", async (req, res) => {
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

// Obtener producto por ID
productsRouter.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
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

// Agregar un nuevo producto
productsRouter.post("/", (req, res) => {
  try {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).send('Producto agregado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor al agregar el producto');
  }
});

// Actualizar un producto existente
productsRouter.put("/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
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

// Eliminar un producto
productsRouter.delete("/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);

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

export default productsRouter;
