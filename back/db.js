const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://gardeniag434_db_user:mF1aCYLBkexUNbVy@cluster0.giktigh.mongodb.net/?retryWrites=true&w=majority');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
