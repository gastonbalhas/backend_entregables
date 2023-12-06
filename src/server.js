import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productsRouter from './routes/productRoutes.js';
import cartsRouter from './routes/cartRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('.hbs', handlebars.engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', '.hbs');
app.set('views', join(__dirname, 'views'));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenidos!");
});

app.use("/api/products", productsRouter); 
app.use("/api/carts", cartsRouter);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('addProduct', (newProduct) => {
    io.emit('updateProducts', newProduct);
    console.log('Se agrego un nuevo producto:', newProduct);
  });

  socket.on('deleteProduct', (productId) => {
    io.emit('updateProducts', { deletedProductId: productId });
    console.log('Se eliminó un producto con ID:', productId);
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); 
});

app.get('/home', (req, res) => {
  const products = getProducts(); 
  res.render('home', { products }); 
});
