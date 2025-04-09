require("dotenv").config();

const {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL,
} = process.env;

const config = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL,
};

module.exports = config;
