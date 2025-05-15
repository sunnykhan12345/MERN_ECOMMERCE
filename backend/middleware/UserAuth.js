import HandleError from "../utils/handleError.js";
import HandleAsyncError from "./HandleAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
export const verifyUserAuth = HandleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandleError(
        "Authentication is missing ! Please Login Continue...",
        400
      )
    );
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decodedToken);
  req.user = await User.findById(decodedToken.id);

  next();
});

export const roleBasedAccesed = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandleError(
          `role ${req.user.role} is not allowed to user access to the resouce`,
          400
        )
      );
    }
    next();
  };
};
