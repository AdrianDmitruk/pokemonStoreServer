const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const AuthService = require("../services/users.service");

router.post("/signIn", async (req, res) => {
  const user = await AuthService.getUser(req.body);
  if (!user) {
    res.status(403).send({
      code: 403,
      message: "User couldn't be found",
    });
  } else {
    const token = jwt.sign(
      { email: user.email, password: user.password, id: user._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.send({
      accessToken: token,
      ...user,
    });
  }

  res.end();
});

router.post("/signUp", async (req, res) => {
  const userData = req.body;

  if (!userData.email) {
    req.status(400).send({
      code: 400,
      message: "email is required field",
    });
    res.end();
    return;
  }

  if (!userData.password) {
    req.status(400).send({
      code: 400,
      message: "password is required field",
    });
    res.end();
    return;
  }

  if (!userData.phone) {
    req.status(400).send({
      code: 400,
      message: "phone is required field",
    });
    res.end();
    return;
  }

  try {
    const user = await AuthService.setUser(req.body);

    res.send({
      email: user.email,
      password: user.password,
      success: true,
      message: "success",
    });
  } catch (err) {
    res.status(400).send({
      code: 400,
      message: err.message,
    });
  } finally {
    res.end();
  }
});

module.exports = router;
