const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB Connected Successfully");
  } catch (err) {
    console.log("🔴 MongoDB Connection Error:", err);
  }
};
