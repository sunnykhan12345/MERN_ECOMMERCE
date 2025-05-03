import HandleAsyncError from "../middleware/HandleAsyncError.js";
import Product from "../Models/productModels.js";
import ApiFuncality from "../utils/apiFuncality.js";
import HandleError from "../utils/handleError.js";
// create new  product api api/v1/products
export const createProducts = HandleAsyncError(async (req, res, next) => {
  console.log(req.body);
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product,
  });
});
// get all prduct api api/v1/products
export const getAllProducts = HandleAsyncError(async (req, res, next) => {
  console.log(req.query);
  // new ApiFuncality(Product.find(), req.query);
  const product = await Product.find();
  console.log(product);
  res.status(201).json({
    success: true,
    message: "get all product  Successfully",
    product,
  });
});

// Update product API - PUT /api/v1/products/:id
export const updateProduct = HandleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  // if (!product) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});
// delete product API - PUT /api/v1/products/:id
export const deleteProduct = HandleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted successfully",
    product,
  });
});
// accessing single product
export const getProductDetails = HandleAsyncError(async (req, res, next) => {
  console.log(req.params.id);

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "SingleProduct  get successfully",
    product,
  });
});
