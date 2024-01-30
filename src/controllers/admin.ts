/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateAdminLogin } from "./../Schema/Admin";
// const shortUrl = require("node-url-shortener");
// import sgMail from "@sendgrid/mail";
import config from "config";
import { Request, Response } from "express";
import { UserModel as User } from "../Schema/User";
import bcrypt from "bcrypt";
import { Admin } from "../Schema/Admin";
import { ERROR_CODES } from "../../constants/errorCodes";
import { SUCCESS_CODES } from "../../constants/successCode";
import nodemailer from "nodemailer";

const CLIENT_ID =
  "515496484897-k1rlv3mba7lm3fb5l3sseku8dkvh2msm.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04sNLIVBl7eOzCgYIARAAGAQSNgF-L9IrKmeVcawXBE1EA9hM9sN72_PCefp-d1FsWpiDuh02VzxGpdrks5ABfIMXPueZrIG6fQ";
const USER_EMAIL = "dev.alliancetech@gmail.com";

const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000);
  return otp.toString();
};

export const createAdmin = async (req: Request, res: Response) => {
  const isAdminExists = await Admin.findOne({ email: req.body.email });
  if (isAdminExists) {
    return res.json({
      ok: false,
      message: ERROR_CODES.USER.ALREADY_EXISTS,
    });
  }

  const otp = generateOtp();
  const admin = new Admin({
    ...req.body,
    otp: otp, // Ensure your Admin schema has a field for the OTP
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: USER_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: USER_EMAIL,
    to: req.body.email,
    subject: "Email Verification Cpde",
    html: `
          <h1>Email Verification</h1>
          <p>Your Code for email verification is:</p>
          <p><b>${otp}</b></p>
          <p>This Verification code is to be used for verifying your email address only.</p>
          <p>If you did not request this verification, please ignore this email.</p>
        `,
  };

  // Send Email
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Error sending email", error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  const salt = await bcrypt.genSalt(config.get<number>("saltRound"));
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();
  return res.status(200).json({
    ok: true,
    message: SUCCESS_CODES.AUTH.ACCOUNT_CREATED,
  });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // Find the admin by email
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({
      ok: false,
      message: ERROR_CODES.USER.NOT_FOUND,
    });
  }
  if (admin.otp == otp) {
    return res.status(200).json({
      ok: true,
      message: SUCCESS_CODES.AUTH.OTP_VERIFIED,
    });
  } else {
    return res.status(400).json({
      ok: false,
      message: ERROR_CODES.AUTH.INVALID_OTP,
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const usr = await Admin.updateOne(
    { _id: req.body.id },
    {
      $set: {
        emailVerified: true,
      },
    },
  );
  if (usr.modifiedCount > 0) {
    return res.json({
      ok: true,
      message: SUCCESS_CODES.AUTH.EMAIL_VERIFICATION_SUCCESS,
    });
  } else {
    return res.json({
      ok: false,
      message: ERROR_CODES.COMMON.EMAIL_VERIFICATION,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateAdminLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return res
      .status(400)
      .json({ ok: false, message: ERROR_CODES.USER.INCORRECT_CREDENTIALS });
  }

  const isPasswordValid = await admin.comparePassword(req.body.password);

  if (!isPasswordValid)
    return res.status(400).send(ERROR_CODES.AUTH.INVALID_PASSWORD);

  const token = admin.generateAuthToken();

  return res.status(200).json({ ok: true, token });
};
// ... (other imports)

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(404).json({ ok: false, message: "Admin not found" });
  }

  // Generate an OTP and its expiry time
  const otp = generateOtp();
  const otpExpiry = Date.now() + 1000 * 60 * 10; // OTP expires in 10 minutes

  // Update admin with OTP and its expiry time
  admin.resetToken = otp;
  admin.resetTokenExpiry = otpExpiry;
  await admin.save();

  // Setup email transport configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: USER_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Email content
  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Password Reset verification code",
    html: `
      <h1>Password Reset</h1>
      <p>Your password reset verification code is:</p>
      <p><b>${otp}</b></p>
      <p>This verification code is valid for 10 minutes and only for resetting your password.
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
  };

  // Send the email with the OTP
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Error sending email", error);
      return res.status(500).json({
        ok: false,
        message: "Could not send Verfication code to email",
      });
    } else {
      console.log(`Email sent: ${info.response}`);
      return res
        .status(200)
        .json({ ok: true, message: "Verfication code sent" });
    }
  });
};

export const verifyForgotPasswordOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !admin.resetToken || !admin.resetTokenExpiry) {
    return res.status(400).json({ ok: false, message: "Invalid request" });
  }

  // Check if the OTP is valid and not expired
  const isOtpValid =
    otp === admin.resetToken && Date.now() <= admin.resetTokenExpiry;

  if (!isOtpValid) {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid or expired OTP" });
  }

  return res.status(200).json({ ok: true, message: "OTP verified" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(404).json({ ok: false, message: "Admin not found" });
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltRound"));
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  admin.password = hashedPassword;
  admin.resetToken = undefined;
  admin.resetTokenExpiry = undefined;
  await admin.save();

  return res
    .status(200)
    .json({ ok: true, message: "Password reset successfully" });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { newPassword, old } = req.body;
  const user: any = await Admin.findOne({ _id: req.body.id });
  if (user.password == old) {
    const w = await User.updateOne(
      { _id: req.body.id },
      {
        $set: {
          password: newPassword,
        },
      },
    );
    if (w.modifiedCount > 0) {
      return res.status(200).json({
        ok: true,
        message: SUCCESS_CODES.USER.PASSWORD_CHANGED_SUCCESS,
      });
    } else {
      return res
        .status(400)
        .json({ ok: false, message: ERROR_CODES.USER.PASSWORD_CHANGE_ERROR });
    }
  } else {
    return res
      .status(401)
      .json({ ok: false, message: ERROR_CODES.USER.PASSWORD_VALIDATION });
  }
};
