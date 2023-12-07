// src/routes/products.js

const express = require("express");
const router = express.Router();

// Rutas para productos
router.get("/", (req, res) => {
  // Lógica para obtener todos los productos
  res.json({ message: "Obtener todos los productos" });
});

router.post("/", (req, res) => {
  // Lógica para agregar un nuevo producto
  res.json({ message: "Agregar un nuevo producto" });
});

module.exports = router;
