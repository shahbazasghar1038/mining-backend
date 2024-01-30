import { NextFunction, Request, Response } from "express";
import { Team } from "./../Schema/Team";
import { UserModel as User, emailRegexPattern } from "../Schema/User";
import { catchAsyncErrors } from "../utils/catchAsyncErrors";
import { createError } from "../utils/createrError";
import sendResponse from "../middleware/response";
import { SendEmail } from "../utils/sendEmail";
import { validateMongooseId } from "../utils/mongooseIdValidator";
import { setAccessToken } from "../utils/jwt";
import { ModifiedRequest } from "../middleware/auth";
import nodemailer from "nodemailer";
import { ERROR_CODES } from "../../constants/errorCodes";
import { SUCCESS_CODES } from "../../constants/successCode";
import crypto from "crypto";
const CLIENT_ID =
  "515496484897-k1rlv3mba7lm3fb5l3sseku8dkvh2msm.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04sNLIVBl7eOzCgYIARAAGAQSNgF-L9IrKmeVcawXBE1EA9hM9sN72_PCefp-d1FsWpiDuh02VzxGpdrks5ABfIMXPueZrIG6fQ";
const USER_EMAIL = "dev.alliancetech@gmail.com"; // This should be the Google user's email

const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000);
  return otp.toString();
};

import AWS from "aws-sdk";
import { sendEmail } from "../utils/nodeMailer";
// Configure AWS
AWS.config.update({
  accessKeyId: "AKIAYIZRJVUCAVYDISPU",
  secretAccessKey: "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",
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

async function uploadBase64ImageToS3(
  base64Image: string,
  bucketName: string,
  imageName: string,
): Promise<string> {
  const buffer = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );

  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: "cns-images-kyc",
    Key: imageName,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg", // Adjust the content type as needed
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location; // This is the URL of the uploaded image
  } catch (error) {
    console.error("Error in uploading image to S3", error);
    throw error;
  }
}

export const createUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { email, lastName, firstName } = req.body;
    if (!email || !firstName || !lastName)
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields." });

    const userExists = await User.findOne({ email: req.body.email }).where({
      id: req.body.id,
    });

    if (userExists) {
      return res
        .status(422)
        .json({ ok: false, message: "User already exits." });
    }
    // Image Upload

    let imageUrl;
    if (req.body.image) {
      const imageName = `user-images/${Date.now()}.jpg`;
      imageUrl = await uploadBase64ImageToS3(
        req.body.image,
        "your-s3-bucket-name",
        imageName,
      );
    }
    console.log(imageUrl);

    const userData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }), // Add the image URL if it exists
    };
    const user: any = await User.create(userData);

    if (req.body.team) {
      try {
        await Team.updateOne(
          { _id: req.body.team },
          {
            $push: {
              members: user,
            },
          },
        );
      } catch (error) {
        console.log(error);
        return res.json({ ok: false, message: "Fail to create  team user." });
      }
    }
    try {
      const resetToken = crypto.randomBytes(20).toString("hex");
      // const resetPasswordUrl = `http://127.0.0.1:3000/dashboard/create-password/${resetToken}`;
      const resetPasswordUrl = `http://dev.contractnsign.com/dashboard/create-password/${resetToken}`;
      const otpExpiry = Date.now() + 1000 * 60 * 10;
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = otpExpiry;
      await user.save();
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
        to: user.email,
        subject: "Create a password for your Account",
        html: `
          <h1> Create Password</h1>
          <p>Please click the link below to create a new password:</p>
          <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
          <p>This link is valid for a limited time only. If you did not request a password reset, please ignore this email.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${user.email}`);
        return res.status(200).json({
          ok: true,
          message: "Invitation sent to the user to complete the login process",
        });
      } catch (error) {
        console.error("Error sending email", error);
        return res
          .status(500)
          .json({ ok: false, message: "Could not send reset password email" });
      }
    } catch (error: any) {
      console.log(error);

      await user.deleteOne();
      if (req.body.team) {
        await Team.updateOne(
          { _id: req.body.team },
          {
            $pull: {
              members: user,
            },
          },
        );
      }

      return res
        .status(400)
        .json({ ok: false, message: "Fail to create user." });
    }
  },
);
// controllers/users.ts

export const updateUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      let imageUrl;

      // Check if there is a new image in the request body
      if (req.body.image) {
        const imageName = `user-images/${Date.now()}.jpg`;

        // Upload the new image to S3
        imageUrl = await uploadBase64ImageToS3(
          req.body.image,
          "your-s3-bucket-name",
          imageName,
        );

        req.body.image = imageUrl;
      }
      const result = await User.updateOne({ _id: id }, { $set: req.body });

      if (result.modifiedCount === 0) {
        return res.status(404).json({ ok: false, message: "User not found." });
      }

      return res
        .status(200)
        .json({ ok: true, message: "User updated successfully." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, message: "Internal Server Error." });
    }
  },
);

// add first time
export const createAdmin = async (req: Request, res: Response) => {
  const isAdminExists = await User.findOne({ email: req.body.email });
  if (isAdminExists) {
    return res.json({
      ok: false,
      message: ERROR_CODES.USER.ALREADY_EXISTS,
    });
  }

  const otp = generateOtp();
  const otpExpiry = Date.now() + 1000 * 60 * 10;

  const admin: any = new User({
    ...req.body,
    resetPasswordToken: otp,
    resetPasswordExpire: otpExpiry, // Ensure your Admin schema has a field for the OTP
  });
  // Referral logic
  const { referralCode } = req.body;
  if (referralCode) {
    const referrer: any = await User.findOne({ referralCode: referralCode });
    if (referrer) {
      referrer.referredUsers.push(admin._id); // Update referrer's referredUsers list
      await referrer.save();

      // Log only when referrer is not null
      console.log(referrer.referredUsers);
    } else {
      // Handle the case when no referrer is found
      console.log(`No referrer found for referral code: ${referralCode}`);
    }
  }

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
    subject: "Email Verification Code",
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

  await admin.save();
  return res.status(200).json({
    ok: true,
    message: SUCCESS_CODES.AUTH.ACCOUNT_CREATED,
    admin,
  });
};

export const referralsGet = async (req: any, res: any) => {
  const userId = req.params.id; // Assuming you have the user's ID from the session

  const user = await User.findById({ _id: userId })
    .populate("referredUsers", "name email bankDetail") // Adjust fields to display for referred users
    .select("referralCode referredUsers");

  res.json(user);
};

export const createPassword = catchAsyncErrors(
  async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      if (!token) {
        return res
          .status(404)
          .json({ ok: false, message: "Token is required" });
      }
      const { password } = req.body;

      const resetPasswordToken = token;

      const user: any = await User.findOne({
        resetPasswordToken,
      });
      // const Valid =
      //   resetPasswordToken === user.resetPasswordToken &&
      //   Date.now() <= user.resetPasswordExpire;
      // console.log(user, "user");
      // if (!Valid)
      //   return res.status(404).json({
      //     ok: false,
      //     message: "Reset Password Token  has been Expired.",
      //   });
      if (!user)
        return res.status(404).json({
          ok: false,
          message: "Reset Password Token is Invalid or has been Expired",
        });

      // const salt = await bcrypt.genSalt(config.get<number>("saltRound"));

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return res
        .status(200)
        .json({ ok: true, message: "Password Created sucessfuly." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, message: "internal server error." });
    }
  },
);

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Email & Password is required." });
    }

    const user: any = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send(ERROR_CODES.AUTH.INVALID_EMAIL);
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res
        .status(403)
        .json({ ok: false, message: "Account is temporarily locked." });
    }

    const isMatchedPassword = await user.comparePassword(password);

    if (!isMatchedPassword) {
      console.log("not");

      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 1000 * 60 * 10); // Lock account for 10 hour
      }
      await user.save();

      return res.status(400).send({
        ok: false,
        message:
          user.failedLoginAttempts >= 3
            ? "Account locked due to multiple failed login attempts. Please reset your password."
            : "Invalid password.",
        shouldNavigate: user.failedLoginAttempts >= 3, // This flag can be used in frontend to navigate
      });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    const { accessToken } = await setAccessToken(user, res);
    const { password: pass, ...otherDetails } = user._doc;

    if (user.twoFactorAuth === true) {
      const otp: any = generateOtp();
      const otpExpiry: any = Date.now() + 1000 * 60 * 10; // OTP expires in 10 minutes
      user.resetPasswordToken = otp;
      user.resetPasswordExpire = otpExpiry;
      await user.save();
      const emailOptions = {
        to: email,
        subject: "Two-Factor Authentication verification code",
        html: `
          <h1>Two-Factor Authentication</h1>
          <p>Your Two-Factor Authentication verification code is:</p>
          <p><b>${otp}</b></p>
          <p>This verification code is valid for 10 minutes and only for resetting your password.</p>
          <p>If you did not request a Two-Factor Authentication, please ignore this email.</p>
        `,
      };

      const emailSent = await sendEmail(emailOptions);
      if (!emailSent) {
        return res.status(500).json({
          ok: false,

          message: "Could not send Verification code to email",
        });
      }
      return res
        .status(200)
        .json({ ok: true, user: user, message: "Verification code sent" });
    } else {
      // user.loginHistory.push({ Date: new Date(Date.now()) });
      await user.save();

      return res.json({
        ok: true,
        message: "Login Sucessfuly.",
        accessToken,
        user: otherDetails,
      });
      console.log(pass);
    }
  },
);

export const getUserLoginHistoryById = catchAsyncErrors(
  async (req: Request, res: Response) => {
    console.log(req.params.id);
    const isValidId = await validateMongooseId(req.params.id);
    if (!isValidId) {
      res.status(400).send({ ok: false, message: "Invalid user id." });
    }

    const user = await User.findById(req.params.id).select(
      "loginHistory firstName lastName",
    );

    if (!user)
      return res.status(400).send({ ok: false, message: " user not found ." });

    // Sort loginHistory in descending order based on the 'createdAt' field

    res.status(200).json({
      ok: true,
      user,
    });
  },
);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const users = await User.find();

    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to load users.");
  }
};
export const getAllUsersNameID = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const users = await User.find({ id: userId })
      .sort({ createdAt: -1 })
      .select("_id firstName lastName ");
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to load users.");
  }
};

export const disableUser = async (req: Request, res: Response) => {
  try {
    const forms = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    if (forms.modifiedCount > 0) {
      return res
        .status(200)
        .json({ ok: true, message: "User Status Changed." });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update user status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};

export const getSingleUserByID = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const isValidId = await validateMongooseId(req.params.id);
    if (!isValidId) return next(createError("Invalid user id.", 400));

    const user = await User.findById(req.params.id);
    if (!user) return next(createError("User not found.", 404));

    res.status(200).json({
      ok: true,
      user,
    });
  },
);

export const editUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const isValidId = await validateMongooseId(req.params.id);
    if (!isValidId) return next(createError("Invalid user id.", 400));
    const user: any = await User.findOne({ _id: req.params.id }).select(
      "+password",
    );
    if (!user) {
      return next(createError("user not found", 404));
    }
    await User.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        email: user.email,
        role: user.role,
        team: user?.team,
        branch: user?.branch,
        password: user?.password,
      },
    );
    sendResponse("profile updated successfully", 200, res);
  },
);

export const changePassword = catchAsyncErrors(
  async (req: ModifiedRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send("Missing required fields.");
    }

    const user: any = await User.findById(req?.params?.id).select("+password");

    if (!user) return res.status(404).send("user not found .");

    const isValidPassword = await user.comparePassword(currentPassword);

    if (!isValidPassword)
      return res.status(400).send("Current Password did not match.");

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendResponse("Password updated.", 200, res);
  },
);

export const forgetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.email) return next(createError("Email is required.", 400));

    const isValidEmail = await emailRegexPattern.test(String(req.params.email));

    if (!isValidEmail) return next(createError("Invalid email address..", 400));

    const user: any = await User.findOne({ email: req.params.email });

    if (!user) return next(createError("User not found.", 404));

    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host",
    )}/password/reset/${resetToken}`;

    const message = `Your password recovery link :- \n\n ${resetPasswordUrl} \n\nIf your have not requested this email then please ignore it`;

    await SendEmail({
      email: user.email,
      subject: "Password Recovery Link",
      message,
    });

    sendResponse("Password recovery link has been sent.", 200, res);
  },
);

export const deleteUser = async (req: Request, res: Response) => {
  console.log("user");

  try {
    const form = await User.deleteOne({ _id: req.params.id });
    if (form.deletedCount > 0) {
      return res
        .status(200)
        .send({ ok: true, message: `User Deleted Sucessfuly.` });
    } else {
      return res.status(404).send({ ok: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(400).send({ ok: false, message: "Fail to delete user." });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ ok: false, message: "user not found" });
  }

  // Generate an OTP and its expiry time
  const otp: any = generateOtp();
  const otpExpiry: any = Date.now() + 1000 * 60 * 10; // OTP expires in 10 minutes

  // Update user with OTP and its expiry time
  console.log(otp, "otp");

  user.resetPasswordToken = otp;
  user.resetPasswordExpire = otpExpiry;
  await user.save();

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

export const requestSendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ ok: false, message: "user not found" });
  }

  // Generate an OTP and its expiry time
  const otp: any = generateOtp();
  const otpExpiry: any = Date.now() + 1000 * 60 * 10; // OTP expires in 10 minutes
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = otpExpiry;
  await user.save();

  let emailOptions;
  if (req.body.is2FA) {
    emailOptions = {
      to: email,
      subject: "Two-Factor Authentication verification code",
      html: `
      <h1>Two-Factor Authentication</h1>
      <p>Your Two-Factor Authentication verification code is:</p>
      <p><b>${otp}</b></p>
      <p>This verification code is valid for 10 minutes and only for resetting your password.</p>
      <p>If you did not request a Two-Factor Authentication, please ignore this email.</p>
    `,
    };
  } else {
    emailOptions = {
      to: email,
      subject: "Change Password verification code",
      html: `
      <h1>Change Password</h1>
      <p>Your Change Password verification code is:</p>
      <p><b>${otp}</b></p>
      <p>This verification code is valid for 10 minutes and only for resetting your password.</p>
      <p>If you did not request a Change Password, please ignore this email.</p>
    `,
    };
  }

  // Send the email
  const emailSent = await sendEmail(emailOptions);
  if (!emailSent) {
    return res.status(500).json({
      ok: false,
      message: "Could not send Verification code to email",
    });
  }

  return res.status(200).json({ ok: true, message: "Verification code sent" });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user: any = await User.findOne({ email });

  if (!user || !user.resetPasswordToken || !user.resetPasswordExpire) {
    return res.status(400).json({ ok: false, message: "Invalid request" });
  }

  const isOtpValid =
    otp === user.resetPasswordToken && Date.now() <= user.resetPasswordExpire;

  if (!isOtpValid) {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid or expired Verfication code" });
  }
  const { accessToken } = await setAccessToken(user, res);
  const { password: pass, ...otherDetails } = user._doc;
  if (req.body.is2FA === "true" || req.body.is2FA === "false") {
    user.twoFactorAuth = req.body.is2FA;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Verified code sent and updated 2FA " });
  } else {
    console.log(req.body.twoFactorloginAuth);
    if (req.body.twoFactorloginAuth === true) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.json({
        ok: true,
        message: "Login Sucessfuly.",
        accessToken,
        user: otherDetails,
      });
      console.log(pass);
    } else {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(200).json({ ok: true, message: "OTP verified" });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const user: any = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ ok: false, message: "user not found" });
  }

  // const salt = await bcrypt.genSalt(config.get<number>("saltRound"));
  // const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  return res
    .status(200)
    .json({ ok: true, message: "Password reset successfully" });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { newPassword, old } = req.body;
  const user: any = await User.findOne({ _id: req.body.id });
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
