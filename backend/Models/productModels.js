import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Desciption"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [7, "Price canot exceed 7 Digits"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product Stock"],
    maxLength: [5, "quantity canot exceed 5 Digits"],
    default: 1,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAdt:{
    type:Date,
    default:Date.new
  }
});

export default mongoose.model("Product", productSchema);
