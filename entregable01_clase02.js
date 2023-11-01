class ProductManager {
  constructor() {
    this.products = [];
    this.nextProductId = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("El código ya existe. No se pueden duplicar códigos.");
      return;
    }

    const newProduct = {
      id: this.nextProductId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
      return null;
    }
  }
}


const productManager = new ProductManager();

productManager.addProduct("Luz de pie", "Luz de pie de 36w. Construida en madera de cedro macizo", 30000, "img1.jpg", "A1", 10);
productManager.addProduct("Lampara de lectura", "Lampara de lectura 72w. Articulada. Construida en madera de cedro macizo", 45000, "img2.jpg", "A2", 5)
productManager.addProduct("Lampara rinconera RGB", "Lampara rinconera RGB con control remoto", 37000, "img3.jpg", "A3", 5)



console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(3));
