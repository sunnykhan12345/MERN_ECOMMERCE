import express from "express";
const app = express();
import product from "./routes/productsRoutes.js";
// middlwware
app.use(express.json());

app.use("/api/v1", product);

export default app;
