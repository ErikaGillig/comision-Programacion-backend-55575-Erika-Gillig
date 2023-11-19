const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const WebSocket = require("ws");

// Crea una instancia de Express
const app = express();

// Agrega esto en tu archivo app.js
app.use(express.static(__dirname + '/views'));

app.get('/products-real-time', (req, res) => {
  res.sendFile(__dirname + '/views/public.html'); // Ajusta la ruta según la ubicación de tu archivo HTML
});

// Importa los archivos de rutas
const productRoutes = require("./Routes/products");
const cartRoutes = require("./Routes/carts");
const viewRoutes = require("./Routes/views");

// Configurar las rutas en la aplicación
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/views", viewRoutes);

// Conección a la base de datos MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Cofeedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB"));
db.once("open", () => {
  console.log("Conexión a MongoDB exitosa");

  // Configura Handlebars como motor de plantillas
  app.engine("handlebars", expressHandlebars({ extname: "hbs" }));
  app.set("view engine", "handlebars");
  app.set("views", __dirname + "/views");

  // Configura WebSocket
  const server = app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
  });

  const wss = new WebSocket.Server({ server });

  // Maneja conexiones WebSocket
  wss.on("connection", (ws) => {
    console.log("Nueva conexión WebSocket");

    // Maneja mensajes WebSocket entrantes
    ws.on("message", (message) => {
      console.log(`Mensaje recibido: ${message}`);
      // Aquí puedes implementar la lógica para manejar los mensajes WebSocket
    });

    // Maneja cierre de conexión
    ws.on("close", () => {
      console.log("Conexión WebSocket cerrada");
    });

    // Maneja actualizaciones de productos enviadas al WebSocket
    ws.on("updateProducts", (products) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(products));
        }
      });
    });
  });
});

