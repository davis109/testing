const app = require("./app");

const env = require("./config/env");
require("./config/database");

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception: ", error);
});
