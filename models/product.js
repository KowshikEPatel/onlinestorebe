const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    smallcase:{
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    price:{
      type:Number,
      required: true,
    },
    stock:{
      type:Number,
      required: true,
    },
    features:{
      type:[String],
      required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", ProductSchema);
