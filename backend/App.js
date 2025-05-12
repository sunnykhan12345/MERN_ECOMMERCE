// import express from "express";
// const app = express();
// import product from "./routes/productsRoutes.js";
// import errorHandleMiddleware from "./middleware/error.js";
// // import  userRoutes  from "./controllers/userController.js";
// import userRoutes from "./controllers/userController.js";

// // middlwware
// app.use(express.json());

// app.use("/api/v1", product);
// // app.use("/api/v1", userRoutes);
// app.use("/api/v1", userRoutes); // For users
// app.use(errorHandleMiddleware);

// export default app;
import express from "express";
import productRoutes from "./routes/productsRoutes.js";
import userRoutes from "./routes/UserRoutes.js"; // ✅ Correct path
import errorHandleMiddleware from "./middleware/error.js";

const app = express();
app.use(express.json());


app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes); // ✅ Using proper user routes

app.use(errorHandleMiddleware);

export default app;
