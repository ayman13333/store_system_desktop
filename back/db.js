const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://gardeniag434:gardeniag434@cluster0.jjf40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


// new 
// mongodb+srv://gardeniag434:gardeniag434@cluster0.qh72r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// old
// mongodb+srv://aymanmohamed15595:12345@cluster0.br2z0ag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// mongodb+srv://gardeniag434:gardeniag434@cluster0.jjf40.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
module.exports = connectDB;
