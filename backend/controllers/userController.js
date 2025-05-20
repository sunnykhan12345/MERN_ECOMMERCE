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
import { sendEmail } from "../utils/SendEmail.js";
import crypto from "crypto";

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
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    console.log(`error ${err}`);
    return next(
      new HandleError("could not save reset token, Please try again leter", 400)
    );
  }
  const resetPasswordURL = `http://localhost:8000/reset/${resetoken}`;
  const message = `use the following link to reset your password: ${resetPasswordURL}. \n\n this link well expire with in 30 minuts \n\n if you dont request a password reset, please ignore this mail.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Email could not be send. Please try again later", 500)
    );
  }
});

// Reset Password Controller
export const resetPassword = HandleAsyncError(async (req, res, next) => {
  // 1. Hash the token from URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("Token from URL:", req.params.token);
  console.log("Hashed token:", resetPasswordToken);

  // 2. Find user with valid token and unexpired time
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // 3. If no user is found, send error
  if (!user) {
    return next(
      new HandleError("Reset Password token is invalid or has expired", 404)
    );
  }

  const { password, Confirmpassword } = req.body;

  // 4. Validate password match
  if (!password || !Confirmpassword) {
    return next(new HandleError("Please provide both password fields", 400));
  }

  if (password !== Confirmpassword) {
    return next(new HandleError("Passwords do not match", 400));
  }

  // 5. Update password and clear reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // 6. Send new token or success response
  sendToken(user, 200, res);
});

// Getting user details
export const GetUserDetails = HandleAsyncError(async (req, res, next) => {
  // const {data} =  req.body

  const user = await User.findById(req.user.id);
  console.log(user);
  return res.status(200).json({
    success: true,
    user,
  });
});

// update password
export const updatePassword = HandleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, Confirmpassword } = req.body;

  if (newPassword !== Confirmpassword) {
    return next(new HandleError("New passwords do not match", 400));
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  const isMatch = await user.verifyPassword(oldPassword);
  if (!isMatch) {
    return next(new HandleError("Old password is incorrect", 400));
  }
  if (newPassword !== Confirmpassword) {
    return next(new HandleError("Password doesn't match", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// updatae profile
export const updateProfile = HandleAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const updateuserDetails = {
    name: name,
    email: email,
  };
  const userProfile = await User.findByIdAndUpdate(
    req.user.id,
    updateuserDetails,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "User Profile Updated Successfully",
    userProfile,
  });
});
