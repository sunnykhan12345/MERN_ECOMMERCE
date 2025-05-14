import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
} from "../controllers/ProductsController.js";
import { verifyUserAuth } from "../middleware/UserAuth.js";
const router = express.Router();

router.post("/products", createProducts);
// router.get("/products",verifyUserAuth, getAllProducts);
router.get("/products", verifyUserAuth, getAllProducts);

router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products/:id", getProductDetails);

export default router;
