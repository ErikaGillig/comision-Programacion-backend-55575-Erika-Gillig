const express = require("express");
const app = express();
const expressHandlebars = require("express-handlebars");
const WebSocket = require("ws");
const fs = require("fs");
const ProductManager = require("./ProductManager");

// Configurar Handlebars como motor de plantillas
app.engine("hbs", expressHandlebars({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.json());

const dataFilePath = "products.json";
const productManager = new ProductManager(dataFilePath);

// Cargar los datos al iniciar la aplicación
productManager.loadData()
  .then(() => {
    // Rutas para productos (ya definidas)

    // Rutas para carritos (ya definidas)

    // Resto del código de rutas (si hay más)

    const PORT = process.env.PORT || 3000;

    // Crear servidor HTTP
    const server = app.listen(PORT, () => {
      console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
    });

    // Configurar WebSocket
    const wss = new WebSocket.Server({ server });

    // Manejar conexiones WebSocket
    wss.on("connection", (ws) => {
      console.log("Nueva conexión WebSocket");

      // Maneja mensajes WebSocket entrantes
      ws.on("message", (message) => {
        console.log(`Mensaje recibido: ${message}`);
        // Aquí puedes implementar la lógica para manejar los mensajes WebSocket
      });

      // Manejar cierre de conexión
      ws.on("close", () => {
        console.log("Conexión WebSocket cerrada");
      });

      // Resto de la configuración de WebSocket, como manejar eventos
      // y comunicación en tiempo real con los clientes
    });
  })
  .catch((error) => {
    console.error("Error al cargar los datos:", error);
  });

// Ruta para mostrar la vista de productos en tiempo real
app.get("/realtimeproducts", (req, res) => {
  // Obtén la lista de productos (puedes obtenerla de tu ProductManager)
  const products = productManager.getProducts();
  res.render("realTimeProducts", { products });
});
