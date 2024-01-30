import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";
import Joi from "joi";

export interface IAdmin {
  id: string;
  email: string;
  password: string;
  role: number;
  emailVerified: boolean;
  otp: number;
  generateAuthToken: () => void;
  comparePassword: (candidatePassword: string) => boolean;
  resetToken?: string;
  resetTokenExpiry?: number;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Admin:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *    AdminResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 */
const adminSchema = new mongoose.Schema<IAdmin>({
  id: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  otp: {
    type: Number,
    default: 0,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Number },
});

adminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

adminSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const admin = this as IAdmin;

  return bcrypt.compare(candidatePassword, admin.password).catch(() => false);
};

export const validateAdminLogin = (admin: IAdmin) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required(),
  });
  return schema.validate(admin);
};

export const Admin = mongoose.model("cns.admin", adminSchema);
