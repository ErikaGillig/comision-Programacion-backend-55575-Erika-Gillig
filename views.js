// src/routes/views.js

const express = require("express");
const router = express.Router();

// Rutas para vistas
router.get("/", (req, res) => {
  // Lógica para renderizar una vista principal
  res.send("Renderizar la vista principal");
});

module.exports = router;

