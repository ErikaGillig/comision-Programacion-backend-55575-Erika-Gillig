const express = require("express");
const router = express.Router();
const ProductManager = require("./ProductManager");

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


productManager.loadData().then(() => {
  // Ruta para agregar un producto
  app.post("/products", (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    productManager.addProduct(title, description, price, thumbnail, code, stock);
    res.status(201).json({ message: "Producto agregado con éxito" });
  });

  // Ruta para agregar un producto (otra versión)
  app.post("/api/products", (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Autogenerar el ID basado en el contador existente
    const id = productManager.getNextProductId();

    // Verificar que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock) {
      return res.status(400).json({ error: "Todos los campos obligatorios son requeridos" });
    }

    // Crear un nuevo producto con los campos proporcionados
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: true, // Valor predeterminado para status
      stock,
      category,
      thumbnails: thumbnails || [] // Si no se proporciona thumbnails, se establece como un arreglo vacío
    };

    // Agregar el nuevo producto utilizando el método de ProductManager
    productManager.addProduct(newProduct);

    // Responder con un mensaje de éxito
    res.status(201).json({ message: "Producto agregado con éxito" });
  });

  // Resto de las rutas...

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
  });
});
