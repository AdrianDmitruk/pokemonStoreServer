const express = require("express");
const router = express.Router();

const ProductsService = require("../services/products.service");

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;

    const { products, totalCount } = await ProductsService.getAllProducts(
      +page,
      +limit,
      { name }
    );

    const totalPages = Math.ceil(totalCount / +limit);

    res.send({
      currentPage: +page,
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
