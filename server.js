const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require('express-handlebars');
const WebSocket = require("ws");
const bcrypt = require('bcrypt');

const app = express();

// Middleware para autenticación
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Falta encabezado de autorización' });
  }

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  // Comparar con el usuario y contraseña permitidos
  if (username === 'dbUser_Main' && bcrypt.compareSync(password, hashedPassword)) {
    return next();
  } else {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

// Usa el middleware de autenticación en las rutas que requieran autenticación
app.use('/api', authenticate);

// Configura Handlebars como motor de plantillas
app.engine('handlebars', expressHandlebars({ extname: 'hbs' }));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configuración de WebSocket y otros
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Resto del código de WebSocket y otras configuraciones
