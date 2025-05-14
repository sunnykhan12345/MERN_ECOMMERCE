import cookieParser from "cookie-parser";
import express from "express";
import productRoutes from "./routes/productsRoutes.js";
import userRoutes from "./routes/UserRoutes.js"; // ✅ Correct path
import errorHandleMiddleware from "./middleware/error.js";

const app = express();

// middlware
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes); // ✅ Using proper user routes

app.use(errorHandleMiddleware);

export default app;
