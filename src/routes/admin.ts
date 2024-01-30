import express from "express";
import {
  createAdmin,
  verifyEmail,
  login,
  updatePassword,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  verifyForgotPasswordOtp,
} from "../controllers/admin";
const router = express.Router();

/**
 * @openapi
 * '/api/v1/admin/create-user':
 *  post:
 *     tags:
 *     - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Please verify email address to active account
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/AdminResponse'
 *           example:
 *             "ok": true
 *             "message": "Please check your email to activate your account."
 */
router.post("/create-user", createAdmin);
/**
 * @openapi
 * '/api/v1/admin/verify-email':
 *  post:
 *     tags:
 *     - Admin
 *     responses:
 *       200:
 *         description: Email Verified. Please continue to login.
 *       400:
 *         description: Unable to verfiy email address.
 */
router.post("/verify-email", verifyEmail);

/**
 * @openapi
 * '/api/v1/admin/login':
 *  post:
 *     tags:
 *     - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Login Successfull
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/AdminResponse'
 *           example:
 *             "ok": true
 *             "_id": "23easf24q23d2234af34234"
 *             "name": "john doe"
 *             "emailVerified" : true
 *       401:
 *         description: Please verify your email address.
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/AdminResponse'
 *       400:
 *         description: Invalid username & password.
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/AdminResponse'
 *
 *
 */
router.post("/login", login);

/**
 * @openapi
 * '/api/v1/admin/update-password':
 *  post:
 *     tags:
 *     - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             "password": "strangerpassword123"
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/AdminResponse'
 *           example:
 *             "ok": true
 *             "message": "Password has been changed."
 *       401:
 *         content:
 *          application/json:
 *           example:
 *              "ok": false
 *              "message": "Old password incorrect."
 *       400:
 *         content:
 *          application/json:
 *           example:
 *              "ok": false
 *              "message": "Failed to change password."
 *
 */
router.post("/update-password", updatePassword);

router.post("/verify-otp", verifyOtp);

router.post("/request-password-reset", requestPasswordReset);

router.post("/verify-ForgotPass-otp", verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;
