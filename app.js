// Importa los módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require('express-handlebars');
const WebSocket = require("ws");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ProductManager = require("./ProductManager");

// Crea una instancia de Express
const app = express();

// Conecta a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/CofeeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB"));
db.once("open", () => {
  console.log("Conexión a MongoDB exitosa");
});

// Configura Handlebars como motor de plantillas
app.engine("hbs", expressHandlebars({ extname: "hbs" }));
app.set("view engine", "hbs");
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

  // Resto de la configuración de WebSocket, manejar eventos
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

// Agrega otras rutas y configuraciones si es necesario

// Puerto donde se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
  
// Coneccion a DB 
// user= dbUser_main password= dbusermain90
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbUser_Main:<dbusermain90>@cofeedb.rfkilot.mongodb.net/?retryWrites=true&w=majority";

// Creacion MongoCLient con MongoClientOption para setear la API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Coneccion cliente-servidor
    await client.connect();
    // envio de señal para confirmar la correcta ejecución 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
