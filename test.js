
import ProductManager from "./src/ProductManager.js";

const productManager = new ProductManager('products.json');

const newProduct = {
  title: 'Producto agregado de prueba',
  description: 'Este es un producto agregado de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'a4',
  stock: 25,
};

productManager.addProduct(newProduct);

const allProducts = productManager.getProducts();
console.log('Todos los productos + uno de prueba:', allProducts);

const productIdToUpdate = 1;

const updatedProduct = {
  title: 'SIN STOCK - titulo actualizado',
};

// Actualiza solo el título del producto con el ID 1
productManager.updateProduct(productIdToUpdate, updatedProduct);




const updatedProducts = productManager.getProducts();
console.log('Productos actualizados:', updatedProducts);
