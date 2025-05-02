import express from "express";
import {
  createProducts,
  getAllProducts,
  updateProduct,
} from "../controllers/ProductsController.js";
const router = express.Router();

router.post("/products", createProducts);
router.get("/products", getAllProducts);
router.put("/products/:id", updateProduct);

export default router;
