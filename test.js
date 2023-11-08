const ProductManager = require ('./ProductManager');

const productManager = new ProductManager('products.json'); 

const newProduct = {
  title: 'Producto de prueba',
  description: 'Este es un producto de prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

productManager.addProduct(newProduct);

const allProducts = productManager.getProducts();
console.log('Todos los productos + uno de prueba:', allProducts);

const productId = 3;
  const productById = productManager.getProductById(productId);
  console.log('traigo solo el Producto 3 por ID:', productById);

const productIdToUpdate = 1; 

const updatedProduct = {
  title: 'SIN STOCK - titulo actualizado',

};

productManager.updateProduct(productIdToUpdate, updatedProduct);

const updatedProducts = productManager.getProducts();
console.log('Productos actualizados:', updatedProducts);

