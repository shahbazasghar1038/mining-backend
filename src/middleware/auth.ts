import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { ERROR_CODES } from "../../constants/errorCodes";
import { createError } from "../utils/createrError";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
// import { UserModel as User } from "../Schema/User";

export interface ModifiedRequest extends Request {
  user?: any;
}

export const auth = (
  req: ModifiedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send(ERROR_CODES.AUTH.ACCESS_TOKEN);

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};

export const isAuthenticated = catchAsyncErrors(
  async (req: ModifiedRequest, res: Response, next: NextFunction) => {
    const access_token = req.header("x-auth-token");

    if (!access_token)
      return next(createError("Unauthorized User, please login first!", 401));
    const decodeData: any = await jwt.verify(
      access_token,
      process.env.JWT_SECRET as string,
    );
    if (!decodeData) return next(createError("Access Token in Invalid!", 401));
    // const user = await User.findById(decodeData._id);
    // if (!user) return next(createError("User not found!", 404));
    req.user = decodeData;
    return next();
  },
);

export const validateUserRole = (...roles: string[]) => {
  return (req: ModifiedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return next(
        createError(
          `Role: ${req.user.role} is not allowed to access this resourse!`,
          400,
        ),
      );

    next();
  };
};
