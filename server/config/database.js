const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const { MONGODB_URI } = require("./env");

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

module.exports = db;

const store = MongoStore.create({
  client: db.getClient(),
});

exports.store = store;
