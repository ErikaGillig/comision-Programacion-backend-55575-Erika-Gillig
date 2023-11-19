const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const ProductModel = mongoose.model('Product', productSchema);

class ProductManager {
  async loadData() {
    try {
      // Aquí puedes realizar la lógica necesaria para cargar datos desde MongoDB
      this.products = await ProductModel.find();
      // Resto del código...
    } catch (error) {
      this.products = [];
      throw error;
    }
  }

  // Resto de tu código adaptado para trabajar con Mongoose...

  // Por ejemplo, el método para agregar un producto podría ser así:
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const existingProduct = await ProductModel.findOne({ code });
      if (existingProduct) {
        console.error("Ya existe un producto con el mismo código");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });

      await newProduct.save();

      console.log("Producto agregado:", newProduct);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  // Resto de tus métodos adaptados para trabajar con Mongoose...
}

module.exports = ProductManager;