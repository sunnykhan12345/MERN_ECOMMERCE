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

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "This is temp id",
      url: "This is temp url",
    },
  });

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    user,
  });
});

export default userRegister;
