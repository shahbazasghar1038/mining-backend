import mongoose from "mongoose";
// import crypto from "crypto";
export const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUserDocument {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  role: number;
  bankDetail: string;
  emailVerified: boolean;
  image: string;
  status: string;
  disabled: boolean;
  twoFactorAuth: boolean;
  failedLoginAttempts: number;
  lockUntil: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  referralCode: string;
  referredUsers: string[];
  referralProfitProcessed: boolean;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    id: String,
    name: {
      type: String,
      // required: [true, "PLease Enter Your Name"],
      maxLength: [30, "Max length Exceeded"],
      minLength: [2, "Min 2 characters in firstname"],
    },
    mobile: String,
    email: {
      type: String,
      required: [true, "PLease Enter Your Email"],
      unique: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          return emailRegexPattern.test(String(email));
        },
        message: "Please enter a valid email!",
      },
    },
    bankDetail: String,
    password: {
      type: String,
      minLength: [8, "Password should be greater then 10 character"],
      select: false,
    },
    role: {
      type: Number,
      default: 0, //root
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: String,
    status: {
      type: String,
      default: "Active",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    referralProfitProcessed: Boolean,
    referralCode: {
      type: String,
      unique: true, // Ensure the referral code is unique
    },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "cns.users" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isNew) {
    // Generate a unique referral code. This is a simple implementation.
    // You might want a more complex one to ensure uniqueness
    this.referralCode = Math.random().toString(36).substr(2, 9);
  }
  next();
});

//converting Email to LowerCase
userSchema.pre("save", async function (next) {
  if (!this.isModified("email")) {
    next();
  }

  this.email = this.email.toLowerCase();
});

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  console.log("test");

  return jwt.sign(
    { _id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//Hashing Password Before Saving User
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
//Comparing Password for Login
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
// userSchema.methods.getResetPasswordToken = function () {
//   //Generating Token
//   const resetToken = crypto.randomBytes(20).toString("hex");
//   //hashing and adding to user Schema
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
//   return resetToken;
// };

export const UserModel = mongoose.model("cns.users", userSchema);
