const router = require("express").Router();

router.use("/ping", (req, res) => {
  return res.json({
    success: true,
    message: "pong",
  });
});

module.exports = {
  use: "/",
  router,
};
