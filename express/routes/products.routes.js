const express = require("express");
const router = express.Router();

const ProductsService = require("../services/products.service");

router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await ProductsService.getProduct(productId);

    res.send(product);
  } catch (err) {
    res.status(403).send({
      code: 403,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, name, priceFrom, priceTo } = req.query;

    // Преобразуем page и limit в целые числа
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (isNaN(pageInt) || isNaN(limitInt)) {
      throw new Error("Invalid page or limit values");
    }

    const { products, totalCount } = await ProductsService.getAllProducts(
      pageInt,
      limitInt,
      { name, priceFrom, priceTo }
    );

    const totalPages = Math.ceil(totalCount / limitInt);

    res.send({
      currentPage: pageInt,
      products,
      totalPages,
      totalProducts: totalCount,
    });
  } catch (err) {
    res.status(403).send({
      code: 403,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

module.exports = router;
