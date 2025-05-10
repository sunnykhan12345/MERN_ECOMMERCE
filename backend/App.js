import express from "express";
const app = express();
import product from "./routes/productsRoutes.js";
import errorHandleMiddleware from "./middleware/error.js"
// import  userRoutes  from "./controllers/userController.js";
import userRoutes from "./controllers/userController.js";

// middlwware
app.use(express.json());

app.use("/api/v1", product);
app.use("/api/v1", userRoutes);
app.use(errorHandleMiddleware);

export default app;
