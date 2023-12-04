import express from 'express';
import CartManager from '../managers/CartsManager.js';

const cartsRouter = express.Router();
const cartManager = new CartManager('./cart.json');

cartsRouter.get("/:id", (req, res) => {
  try {
    const cartId = req.params.id;
    const cartData = cartManager.getCartById(cartId);

    if (cartData) {
      res.json(cartData);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


cartsRouter.post("/:id/products", (req, res) => {
  try {
    const cartId = req.params.id;
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);

    const added = cartManager.addProductToCart(cartId, productId, quantity);

    if (added) {
      res.status(201).send('Producto agregado al carrito');
    } else {
      res.status(404).send('No se pudo agregar el producto al carrito');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


cartsRouter.put("/:id/products/:productId", (req, res) => {
  try {
    const cartId = req.params.id;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const updated = cartManager.updateProductQuantity(cartId, productId, quantity);

    if (updated) {
      res.status(200).send('Cantidad de producto actualizada en el carrito');
    } else {
      res.status(404).send('No se pudo actualizar la cantidad del producto en el carrito');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


cartsRouter.delete("/:id/products/:productId", (req, res) => {
  try {
    const cartId = req.params.id;
    const productId = req.params.productId;

    const removed = cartManager.removeProductFromCart(cartId, productId);

    if (removed) {
      res.status(200).send('Producto eliminado del carrito');
    } else {
      res.status(404).send('No se pudo eliminar el producto del carrito');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

export default cartsRouter;
