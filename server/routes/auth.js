const router = require("express").Router();
const authController = require("../controllers/auth");

router.post("/oauth/google", authController.handleCallback);

module.exports = {
  use: "/",
  router,
};
