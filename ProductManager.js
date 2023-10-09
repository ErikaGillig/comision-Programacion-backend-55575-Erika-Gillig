const fs = require("fs");
const express = require("express");
const app = express();
const expressHandlebars = require("express-handlebars");

// Configurar Handlebars como motor de plantillas
app.engine("hbs", expressHandlebars({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// Resto de la configuración de la aplicación, rutas, WebSockets, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});


class ProductManager {
  constructor(dataFilePath) {
    this.dataFilePath = dataFilePath;
    this.products = [];
    this.productIdCounter = 1;
  }

  async loadData() {
    try {
      const data = await fs.promises.readFile(this.dataFilePath, "utf-8");
      this.products = JSON.parse(data);
      if (Array.isArray(this.products)) {
        const maxId = Math.max(...this.products.map((product) => product.id), 0);
        this.productIdCounter = maxId + 1;
      }
    } catch (error) {
      this.products = [];
      throw error;
    }
  }

  saveDataToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.dataFilePath, data, "utf-8");
    } catch (error) {
      console.error("Error al guardar los datos en el archivo:", error);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      console.error("Ya existe un producto con el mismo código");
      return;
    }

    const newProduct = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);

    console.log("Producto agregado:", newProduct);
    this.saveDataToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
      return null;
    }
  }
}

module.exports = ProductManager;

