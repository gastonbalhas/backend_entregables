import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import productsRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor de productos y carritos!");
});

app.use("/api/products", productsRouter); 
app.use("/api/carts", cartRouter);


server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
