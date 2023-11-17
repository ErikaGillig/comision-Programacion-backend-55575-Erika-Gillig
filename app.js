const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require('express-handlebars');
const WebSocket = require("ws");

// Crea una instancia de Express
const app = express();

mongoose.connect("mongodb://localhost:27017/Cofeedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB"));
db.once("open", () => {
  console.log("Conexión a MongoDB exitosa");

  // Configura Handlebars como motor de plantillas
  app.engine('handlebars', expressHandlebars({ extname: 'hbs' }));
  app.set('view engine', 'handlebars');
  app.set('views', __dirname + '/views');

  // Resto del código (configuración de WebSocket, importación de rutas, etc.)

  // Puerto donde se ejecutará el servidor
  const PORT = process.env.PORT || 3000;

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

    // Resto de la configuración de WebSocket, como manejar eventos
    // y comunicación en tiempo real con los clientes
  });

  // Importa y configura el modelo de Producto (definido con Mongoose)
  const Product = require("./models/Product");

  // Carga las rutas de productos (ajusta según tus necesidades)
  const productRoutes = require("./routes/products");
  app.use("/api/products", productRoutes);

  // Carga las rutas de carritos (ajusta según tus necesidades)
  const cartRoutes = require("./routes/carts");
  app.use("/api/carts", cartRoutes);

  // Carga las rutas de vistas (ajusta según tus necesidades)
  const viewRoutes = require("./routes/views");
  app.use("/views", viewRoutes);

  setTimeout(() => {
    closeMongoDBConnection();
  }, 5000); // Cierra la conexión después de 5 segundos 
});

// Coneccion a DB 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbUser_Main:dbusermain90@cofeedb.rfkilot.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Tu lógica con MongoDB aquí

// Cerrar la conexión a MongoDB cuando sea necesario
async function closeMongoDBConnection() {
  try {
    await client.close();
    console.log("Conexión a MongoDB cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar la conexión a MongoDB:", error);
  }
}
