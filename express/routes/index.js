const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authRoutes = require("./auth");
const productsRoutes = require("./products.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./order.routes");
const userRoutes = require("./user.routes");

router.use((req, res, next) => {
  try {
    if (
      req?.url?.startsWith("/auth") /* || req.url.startsWith("/set_pokemons") */
    ) {
      next();
    } else {
      const token = req.headers?.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).send({
          code: 401,
          message: "Not authorized",
        });

        res.end();

        return;
      }

      const jwtDecoded = jwt.decode(token);

      if (jwtDecoded.exp * 1000 < new Date().getTime()) {
        res.status(401).send({
          code: 401,
          message: "Not authorized",
        });

        res.end();

        return;
      }

      next();
    }
  } catch (err) {
    res.status(401).send({
      code: 401,
      message: "Not authorized",
    });
  }
});

router.use("/set_pokemons", async (req, res) => {
  await client.connect();

  const dbo = await client.db("pokemonStore");

  const collection = await dbo.collection("products");

  const products = await collection.insertMany(req.body);

  res.end();
});

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/user", userRoutes);

module.exports = router;
