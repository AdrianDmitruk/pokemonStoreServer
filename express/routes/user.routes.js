const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const AuthService = require("../services/users.service");

router.get("/", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).send({
        code: 401,
        message: "Not authorized",
      });

      return;
    }

    const jwtDecoded = jwt.decode(token);
    if (jwtDecoded.exp * 1000 < new Date().getTime()) {
      res.status(401).send({
        code: 401,
        message: "Token expired",
      });

      return;
    }

    const user = await AuthService.getUser({ email: jwtDecoded.email });

    if (!user) {
      res.status(404).send({
        code: 404,
        message: "User not found",
      });

      return;
    }

    res.send({
      _id: user._id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      address: user.address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
