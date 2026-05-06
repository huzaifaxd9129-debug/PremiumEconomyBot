const mongoose = require("mongoose");

const ecoSchema = new mongoose.Schema({
  userId: String,
  cash: { type: Number, default: 0 },
  bank: { type: Number, default: 0 }
});

module.exports = mongoose.model("Economy", ecoSchema);
