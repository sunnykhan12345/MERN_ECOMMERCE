import { json } from "express";
import app from "./App.js";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });
import { connectDB } from "./config/db.js";


const PORT = process.env.PORT || 3000;

connectDB()
app.listen(PORT, () => {
  console.log(`server is running port  ${PORT}`);
});
