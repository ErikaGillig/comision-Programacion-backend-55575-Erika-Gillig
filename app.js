const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const WebSocket = require("ws");

// Crea una instancia de Express
const app = express();

// Configura Handlebars como motor de plantillas
app.engine("hbs", expressHandlebars({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// Puerto de escucha
const PORT = process.env.PORT || 5500;

// Conección a la base de datos MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://dbUser_Main:dbusermain@cofeedb.rfkilot.mongodb.net/"; 
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB"));
db.once("open", () => {
  console.log("Conexión a MongoDB exitosa");

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
