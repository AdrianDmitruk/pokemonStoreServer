const { MongoClient } = require("mongodb");

const dotenv = require("dotenv");

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL);

class ProductsService {
  getAllProducts = async (page, limit, searchQuery) => {
    try {
      // Проверяем, что page и limit являются целыми числами
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);

      if (isNaN(pageInt) || isNaN(limitInt)) {
        throw new Error("Invalid page or limit values");
      }

      await client.connect();

      console.log("connect to mongo");

      const dbo = client.db("pokemonStore");

      const products = await dbo.collection("products");

      let query = {};

      if (searchQuery && searchQuery.name) {
        query.name = { $regex: new RegExp(searchQuery.name, "i") };
      }

      if (
        searchQuery &&
        searchQuery.priceFrom !== undefined &&
        searchQuery.priceTo !== undefined
      ) {
        query.price = {
          $gte: parseFloat(searchQuery.priceFrom),
          $lte: parseFloat(searchQuery.priceTo),
        };
      } else if (searchQuery && searchQuery.priceFrom !== undefined) {
        query.price = { $gte: parseFloat(searchQuery.priceFrom) };
      } else if (searchQuery && searchQuery.priceTo !== undefined) {
        query.price = { $lte: parseFloat(searchQuery.priceTo) };
      }

      const totalCount = await products.countDocuments(query);

      const productsCollection = await products
        .find(query)
        .skip((pageInt - 1) * limitInt)
        .limit(limitInt)
        .toArray();

      return { products: productsCollection, totalCount };
    } finally {
      await client.close();
      console.log("disconnect from mongo");
    }
  };

  getPaginatedProducts = async (page, limit, searchQuery) => {
    try {
      await client.connect();

      console.log("connect to mongo");

      const dbo = client.db("pokemonStore");

      const products = await dbo.collection("products");

      let query = {};

      if (searchQuery && searchQuery.name) {
        query.name = { $regex: new RegExp(searchQuery.name, "i") };
      }

      const totalCount = await products.countDocuments(query);

      const productsCollection = await products
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      return { products: productsCollection, totalCount };
    } finally {
      await client.close();
      console.log("disconnect to mongo");
    }
  };

  getProduct = async (id) => {
    try {
      await client.connect();

      const dbo = await client.db("pokemonStore");

      const products = await dbo.collection("products");

      const product = await products.findOne({ id });

      return product;
    } finally {
      client.close();

      console.log("disconnect to mongo");
    }
  };
}

module.exports = new ProductsService();
