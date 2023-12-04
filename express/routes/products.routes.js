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
    const { page = 1, limit = 10, name } = req.query;

    if (name) {
      const { products, totalCount } = await ProductsService.getAllProducts({
        name,
      });
      res.send({
        currentPage: 1,
        products,
        totalPages: 1,
        totalProducts: totalCount,
      });
    } else {
      const { products, totalCount } =
        await ProductsService.getPaginatedProducts(+page, +limit, { name });

      const totalPages = Math.ceil(totalCount / +limit);

      res.send({
        currentPage: +page,
        products,
        totalPages,
        totalProducts: totalCount,
      });
    }
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
