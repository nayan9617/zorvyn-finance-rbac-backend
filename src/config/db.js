const mongoose = require("mongoose");

const connectDb = async (mongodbUri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongodbUri);
};

module.exports = { connectDb };
