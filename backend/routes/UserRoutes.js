// import express from "express";
// import { userLogin, userRegister } from "../controllers/userController.js";

// const router = express.Router();

// router.post("/register", userRegister);
// router.post("/login", (req, res) => {
//   res.send("login api");
// });

// export default router; // Make sure to export as default
// import express from "express";
// import { userLogin, userRegister } from "../controllers/userController.js";

// const router = express.Router();

// router.post("/register", userRegister);
// router.post("/login", userLogin); // ✅ Fixed: use actual login controller

// export default router;
import express from "express";
import {
  userRegister,
  userLogin,
  logOut,
  requestPasswordReset,
  resetPassword,
  GetUserDetails,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import { verifyUserAuth } from "../middleware/UserAuth.js";
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", logOut);
router.post("/forget/password", requestPasswordReset);
router.post("/reset/:token", resetPassword);
router.get("/profile", verifyUserAuth, GetUserDetails);
router.post("/password/update", verifyUserAuth, updatePassword);
router.post("/profile/update", verifyUserAuth, updateProfile);

export default router;
