"use strict";
const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const setupSwagger = require("./swagger");
const UserService = require("./services/users.service");

env.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

setupSwagger(app);

routes.post("/auth/signIn", async (req, res) => {
  const user = await UserService.getUser(req.body);
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
      },
    );

    res.send({
      accessToken: token,
      ...user,
    });
  }

  res.end();
});

app.use("/", routes);
