const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

console.log("Environment Variables Loaded");

// Gets the environment variables
module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
