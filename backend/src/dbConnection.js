//handle db connection 
const dotenv = require('dotenv');
const mongoose = require('mongoose');


/// Load environment variables from .env file
dotenv.config();

//getting env variable in a string
const connectionString = process.env.MONGO_URI;


const dbConnection = async () => {
    try {
      await mongoose.connect(connectionString, {
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected.');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    }
  };
  
module.exports = dbConnection;
