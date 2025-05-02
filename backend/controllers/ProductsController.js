import Product from "../Models/productModels.js";

// create new  product api api/v1/products
export const createProducts = async (req, res) => {
  console.log(req.body);
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product,
  });
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "product error",
    });
  }
};
// get all prduct api api/v1/products
export const getAllProducts = async (req, res) => {
  const product = await Product.find();
  console.log(product);
  res.status(201).json({
    success: true,
    message: "get all product  Successfully",
    product,
  });

  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "product error",
    });
  }
};

// Update product API - PUT /api/v1/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || "Product update failed",
    });
  }
};
// delete product API - PUT /api/v1/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || "Product update failed",
    });
  }
};
// accessing single product
export const getProductDetails = async (req, res) => {
  console.log(req.params.id);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "SingleProduct  get successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || "get SingleProduct  failed",
    });
  }
};
