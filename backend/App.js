import express from "express";
const app = express();
import product from "./routes/productsRoutes.js";
import errorHandleMiddleware from "./middleware/error.js"
// middlwware
app.use(express.json());

app.use("/api/v1", product);
app.use(errorHandleMiddleware);

export default app;
