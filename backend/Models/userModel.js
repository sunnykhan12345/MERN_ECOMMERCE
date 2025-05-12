// import mongoose from "mongoose";
// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your name"],
//     maxLength: [25, "Name must be less than 25 characters"],
//     minLength: [3, "Name must be more than 3 characters"],
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter your email"],
//     unique: true,
//     validate: [validator.isEmail, "Please enter a valid email"],
//   },
//   password: {
//     type: String,
//     required: [true, "Please enter your password"],
//     select: false,
//   },
//   avatar: {
//     public_id: {
//       type: String,
//       required: true,
//     },
//     url: {
//       type: String,
//       required: true,
//     },
//   },
//   role: {
//     type: String,
//     default: "user",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
// });

// // password hashing
// userSchema.pre("save", async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
//   if (!this.isModified("password")) {
//     return next();
//   }
// });
// // jwt
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [25, "Name must be less than 25 characters"],
    minLength: [3, "Name must be more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false, // Ensures that password is not returned in queries by default
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Password hashing before saving a user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token generation
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default mongoose.model("User", userSchema);
