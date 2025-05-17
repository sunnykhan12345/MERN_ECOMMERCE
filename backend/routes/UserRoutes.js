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
import { userRegister, userLogin, logOut, requestPasswordReset } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", logOut);
router.post("/forget/password", requestPasswordReset);

export default router;
