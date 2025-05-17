// import User from "../Models/userModel.js";
// import HandleAsyncError from "../middleware/HandleAsyncError.js";
// import bcrypt from "bcrypt";

// // user register api
// const userRegister = HandleAsyncError(async (req, res, next) => {
//   const { name, email, password } = req.body;

//   // Check if the user already exists
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     return res.status(409).json({
//       success: false,
//       message: "User already exists. Please login.",
//     });
//   }

//   // Create the new user
//   const user = await User.create({
//     name,
//     email,
//     password,
//     avatar: {
//       public_id: "This is temp id",
//       url: "This is temp url",
//     },
//   });
//   const token = user.getJWTToken();

//   res.status(201).json({
//     success: true,
//     message: "User created successfully.",
//     user,
//     token,
//   });
// });

// export const userLogin = HandleAsyncError(async (req, res, next) => {
//   const { email, password } = req.body;

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter both email and password",
//     });
//   }

//   // Find user and explicitly select password
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }

//   // Compare password
//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }

//   // Generate token
//   const token = user.getJWTToken();

//   res.status(200).json({
//     success: true,
//     message: "Logged in successfully",
//     user,
//     token,
//   });
// });

// export default userRegister;
import User from "../Models/userModel.js";
import HandleAsyncError from "../middleware/HandleAsyncError.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import HandleError from "../utils/handleError.js";
// Register Controller
export const userRegister = HandleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists. Please login.",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is temp id",
      url: "This is temp url",
    },
  });

  // const token = user.getJWTToken();
  // res.status(201).json({
  //   success: true,
  //   message: "User created successfully.",
  //   user,
  //   token,
  // });
  sendToken(user, 200, res);
});

// Login Controller
export const userLogin = HandleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter both email and password",
    });
  }

  // Find the user by email
  const user = await User.findOne({ email }).select("+password");

  // Log the user data for debugging
  console.log("User found:", user);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Log the passwords for debugging (DO NOT do this in production)
  console.log("Password from req.body:", password);
  console.log("Password from DB (hashed):", user.password);

  // Compare the entered password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate JWT token for the user
  // const token = user.getJWTToken();

  // // Send response back with success
  // res.status(200).json({
  //   success: true,
  //   message: "Logged in successfully",
  //   user: {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.role,
  //     avatar: user.avatar, // Include necessary fields
  //   },
  //   token,
  // });
  sendToken(user, 200, res);
});

// logout api
export const logOut = HandleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Successfuly logout",
  });
});

// forget password user link

export const requestPasswordReset = HandleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User doesnt exist", 404));
  }
  let resetoken;
  try {
     resetoken = user.generatePasswordResetoken();
    await user.save({validateBeforeSave:false})
  } catch (err) {
    console.log(`error ${err}`);
    return next(
      new HandleError("could not save reset token, Please try again leter", 400)
    );
  }
});
