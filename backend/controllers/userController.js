// import User from "../Models/userModel.js";
// import HandleAsyncError from "../middleware/HandleAsyncError.js";

// const userRegister = HandleAsyncError(async (req, res, next) => {
//   const { name, email, password } = req.body;
//   const emilexsisting = await User.find({ email });
//   if (email) {
//     res.status(201).json({
//       message: "user already exist please Login.",
//     });
//   }
//   const user = await User.create({
//     name,
//     email,
//     password,
//     avatar: {
//       public_id: "This is temp id",
//       url: "This is temp url",
//     },
//   });

//   res.status(200).json({
//     success: true,
//     message: "User Created Successfully",
//     user,
//   });
// });

// export default userRegister;
import User from "../Models/userModel.js";
import HandleAsyncError from "../middleware/HandleAsyncError.js";
import bcrypt from "bcrypt";

// user register api
const userRegister = HandleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists. Please login.",
    });
  }

  // Create the new user
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is temp id",
      url: "This is temp url",
    },
  });
  const token = user.getJWTToken();

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    user,
    token,
  });
});

export const userLogin = HandleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter both email and password",
    });
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate token
  const token = user.getJWTToken();

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user,
    token,
  });
});

export default userRegister;
