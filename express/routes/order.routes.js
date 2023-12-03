const express = require("express");
const jwt = require("jsonwebtoken");
const OrderService = require("../services/order.service");
const CartService = require("../services/cart.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    const { id } = jwt.decode(token);

    const { orders } = await OrderService.getOrders(id);

    if (!orders) {
      throw new Error("Orders not found");
    }

    res.send(orders);
  } catch (err) {
    res.status(403).send({
      code: 403,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

router.post("/", async (req, res) => {
  try {
    const order = await OrderService.setOrder(req.body);

    if (!order) {
      throw new Error("Error place order");
    }

    await CartService.clearCart(req.body.customerId);

    res.send(order);
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
