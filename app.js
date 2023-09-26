const express = require("express");
const app = express();
const ProductManager = require("./ProductManager");

app.use(express.json());

const dataFilePath = "products.json";
const productManager = new ProductManager(dataFilePath);

// Cargar los datos al iniciar la aplicación
productManager.loadData()
  .then(() => {
    // Ruta para agregar un producto
    app.post("/products", (req, res) => {
      const { title, description, price, thumbnail, code, stock } = req.body;
      productManager.addProduct(title, description, price, thumbnail, code, stock);
      res.status(201).json({ message: "Producto agregado con éxito" });
    });

    // Ruta para obtener todos los productos
    app.get("/products", (req, res) => {
      let limit = req.query.limit;
      limit = parseInt(limit);

      const allProducts = productManager.getProducts();

      if (!isNaN(limit)) {
        const limitedProducts = allProducts.slice(0, limit);
        res.json(limitedProducts);
      } else {
        res.json(allProducts);
      }
    });

    // Ruta para obtener un producto por ID
    app.get("/products/:pid", (req, res) => {
      const productId = parseInt(req.params.pid);
      const product = productManager.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al cargar los datos:", error);
  });
