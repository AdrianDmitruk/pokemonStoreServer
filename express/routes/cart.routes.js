const express = require("express");
const jwt = require("jsonwebtoken");
const СartService = require("../services/cart.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    const { id } = jwt.decode(token);

    const cart = await СartService.getCart(id);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const resData = cart.itemsList.reduce(
      (acc, item) => {
        return {
          ...acc,
          quantity: acc.quantity + item.quantity,
          totalPrice: acc.totalPrice + item.price * item.quantity,
        };
      },
      { ...cart, quantity: 0, totalPrice: 0 }
    );

    res.send(resData);
  } catch (err) {
    res.status(403).send({
      code: 403,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

router.post("/item", async (req, res) => {
  const { id, image, name, price, quantity } = req.body;

  if (!id || !image || !name || !price || !quantity) {
    res.status(400).send({
      code: 400,
      message: "bad request",
    });

    res.end();
    return;
  }

  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const { id } = jwt.decode(token);

    const cart = await СartService.setCartItem(req.body, id);

    const resData = cart.itemsList.reduce(
      (acc, item) => {
        return {
          ...acc,
          quantity: acc.quantity + item.quantity,
          totalPrice: acc.totalPrice + item.price * item.quantity,
        };
      },
      { ...cart, quantity: 0, totalPrice: 0 }
    );

    res.send(resData);
  } catch (err) {
    res.status(403).send({
      code: 403,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

router.patch("/item", async (req, res) => {
  if (!("id" in req.body) || !("quantity" in req.body)) {
    res.status(400).send({
      code: 400,
      message: "bad request",
    });

    res.end();
    return;
  }

  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const { id } = jwt.decode(token);

    const cart = await СartService.updateCartItem(req.body, id);

    const resData = cart.itemsList.reduce(
      (acc, item) => {
        return {
          ...acc,
          quantity: acc.quantity + item.quantity,
          totalPrice: acc.totalPrice + item.price * item.quantity,
        };
      },
      { quantity: 0, totalPrice: 0 }
    );

    const updatedItem = cart.itemsList.find((item) => item.id === req.body.id);

    res.send({ updatedItem, cartState: resData });
  } catch (err) {
    res.status(403).send({
      code: 403,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

router.delete("/item/:id", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const { id } = jwt.decode(token);
    const itemId = +req.params.id;

    const cart = await СartService.deleteCartItem(itemId, id);

    const resData = cart.itemsList.reduce(
      (acc, item) => {
        return {
          ...acc,
          quantity: acc.quantity + item.quantity,
          totalPrice: acc.totalPrice + item.price * item.quantity,
        };
      },
      { quantity: 0, totalPrice: 0 }
    );

    res.send({ removedItemId: itemId, cartState: resData });
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
