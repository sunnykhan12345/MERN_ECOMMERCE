// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URI);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectDB;
import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB Connected succesfully`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};