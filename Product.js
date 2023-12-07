// src/models/Product.js

const express = require("express");
const router = express.Router();
const ProductManager = require("../services/ProductManager");

// Crea una instancia de ProductManager
const productManager = new ProductManager();

// Ruta para agregar un producto
router.post("/api/products", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  try {
    // Verificar que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock) {
      return res.status(400).json({ error: "Todos los campos obligatorios son requeridos" });
    }

    // Crear un nuevo producto en la base de datos
    await productManager.addProduct(title, description, price, category, code, stock, thumbnails);

    // Responder con un mensaje de éxito
    res.status(201).json({ message: "Producto agregado con éxito" });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Resto de tus rutas para productos...

module.exports = router;
