import express from "express";
import {
  createProducts,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
} from "../controllers/ProductsController.js";
import { roleBasedAccesed, verifyUserAuth } from "../middleware/UserAuth.js";
const router = express.Router();

router.post(
  "/products",
  verifyUserAuth,
  roleBasedAccesed("admin"),
  createProducts
);
router.get("/products", verifyUserAuth, getAllProducts);

router.put(
  "/products/:id",
  verifyUserAuth,
  roleBasedAccesed("admin"),
  updateProduct
);
router.delete(
  "/products/:id",
  verifyUserAuth,
  roleBasedAccesed("admin"),
  deleteProduct
);
router.get(
  "/products/:id",
  roleBasedAccesed("admin"),
  verifyUserAuth,
  getProductDetails
);

export default router;
