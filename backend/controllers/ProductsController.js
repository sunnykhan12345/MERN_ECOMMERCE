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

// export const getAllProducts = HandleAsyncError(async (req, res, next) => {
//   console.log(req.query);
//   const resultsPerPage = 3;
//   const apiFeatures = new ApiFuncality(Product.find(), req.query)
//     .Search()
//     .filter();
//   // .pagination(currentPage);
//   const filteredQuery = apiFeatures.query.clone();
//   const productCount = await filteredQuery.countDocuments();
//   const totalPages = Math.ceil(productCount / resultsPerPage);
//   const product = await apiFeatures.query;

//   res.status(201).json({
//     success: true,
//     message: "Get all products successfully",
//     product,
//     productCount,
//     totalPages
//   });
// });
export const getAllProducts = HandleAsyncError(async (req, res, next) => {
  console.log(req.query);

  const resultsPerPage = 3;

  const apiFeatures = new ApiFuncality(Product.find(), req.query)
    .Search()
    .filter();

  const filteredQuery = apiFeatures.query.clone(); // for count
  const productCount = await filteredQuery.countDocuments();

  apiFeatures.pagination(resultsPerPage); // ✅ Apply pagination here

  const product = await apiFeatures.query;

  const totalPages = Math.ceil(productCount / resultsPerPage);
  const page = Number(req.query.page) || 1;
  if (page > totalPages && productCount > 0) {
    return next(new HandleError("this page doesnt exixt"));
  }

  res.status(201).json({
    success: true,
    message: "Get all products successfully",
    product,
    productCount,
    totalPages,
    currentPage: page,
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
  apiFeatures.pagination(resultsPerPage);
  if (!product || product == 0) {
    return next(new HandleError("No products found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    resultsPerPage,
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
