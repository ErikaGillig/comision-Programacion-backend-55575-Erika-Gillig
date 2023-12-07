const express = require("express");
const mongoose = require("mongoose");
const expressHandlebars = require('express-handlebars');
const WebSocket = require("ws");
const bcrypt = require('bcrypt');
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const session = require('express-session');

const app = express();

// Configuración de sesión
app.use(session({ secret: 'bdaaca0541adfa7097e6e035408bb26ea21a4ce', resave: true, saveUninitialized: true }));

// Inicialización de Passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Función ficticia para verificar la contraseña con bcrypt
const verificarContraseña = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    return false;
  }
};

// Middleware para autenticación
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Falta encabezado de autorización' });
  }

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  // Comparar con el usuario y contraseña permitidos (ajusta esto según tu lógica)
  try {
    if (username === 'dbUser_Main' && await verificarContraseña(password, 'hashedPassword')) {
      return next();
    } else {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Usa el middleware de autenticación en las rutas que requieran autenticación
app.use('/api', authenticate);

// Ruta de callback después de la autorización de GitHub
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/unauthorized' }),
  (req, res) => {
    // Autenticación exitosa, redirige a la URL de ingreso exitoso
    res.redirect('/success');
  }
);

// Ruta de ingreso exitoso
app.get('/success', (req, res) => {
  // Verifica si el usuario está autenticado
  if (req.isAuthenticated()) {
    // Acceso permitido al ingreso exitoso
    res.send('Ingreso exitoso');
  } else {
    // Usuario no autenticado, redirige a la página de inicio de sesión
    res.redirect('/unauthorized');
  }
});

// Ruta de no autorizado
app.get('/unauthorized', (req, res) => {
  res.send('Lo sentimos, usted no está autorizado');
});

// Puerto de escucha
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
