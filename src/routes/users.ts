import express from "express";
import {
  createUser,
  getAllUsers,
  disableUser,
  getSingleUserByID,
  deleteUser,
  editUser,
  changePassword,
  createPassword,
  forgetPassword,
  loginUser,
  getUserLoginHistoryById,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  createAdmin,
  updateUser,
  requestSendOtp,
  getAllUsersNameID,
  referralsGet,
} from "../controllers/users";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create-user", createAdmin);

router.get("/referrals/:id", referralsGet);

router.post("/add-user", createUser);

router.post("/login", loginUser);

router.post("/login-history/:id", loginUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  get:
 *     tags:
 *     - Users
 *     description: Return users
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": true
 *             "data": []
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "message": "failed to load users."
 */
router.get("/list-user", getAllUsers);

router.get("/list-userIDName/:id", getAllUsersNameID);
/**
 * @openapi
 * /api/v1/users/disable-user/{id}/{status}:
 *  get:
 *     tags:
 *     - Users
 *     description: Active/De-active the user
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": true
 *             "message": 'User Status Changed.'
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "message": "failed to update user status."
 *       422:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "Something went wrong, try again."
 */
router.patch("/disable-user/:id", disableUser);

/**
 * @openapi
 * /api/v1/users/user/{id}:
 *  delete:
 *     tags:
 *     - Users
 *     description: Delete a user by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/User'
 *           example:
 *             "ok": true
 *             "message": "User Deleted."
 *       404:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "User not found."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserResponse'
 *           example:
 *             "ok": false
 *             "message": "Fail to delete user."
 */
router.delete("/:id", deleteUser);
router.put("/edit-profile/:id", isAuthenticated, editUser);
router.put("/change-password/:id", changePassword);
router.put("/create-password/:token", createPassword);
router.put("/forgot-password/:email", forgetPassword);
router.get("/loginHistory/:id", getUserLoginHistoryById);
// router.post("/update-password/:id", updatePassword);
router.post("/verify-otp", verifyOtp);
router.post("/request-password-reset", requestPasswordReset);
router.post("/req-send-otp", requestSendOtp);
router.post("/verify-ForgotPass-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/user/:id", getSingleUserByID);
router.put("/update-users/:id", updateUser);
export default router;

// import express from "express";
// import {
//   createUser,
//   getUsersById,
//   disableUser,
//   userStats,
//   deleteUser,
//   getAllUsers,
// } from "../controllers/users";

// const router = express.Router();

// /**
//  * @openapi
//  * '/api/v1/users/add-user':
//  *  post:
//  *     tags:
//  *     - Users
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": true
//  *             "message": "User created successfully."
//  *       400:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "message": "Fail to create user."
//  *       422:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": false
//  *             "message": "User already exits."
//  */
// router.post("/add-user", createUser);

// /**
//  * @openapi
//  * /api/v1/users/{id}:
//  *  get:
//  *     tags:
//  *     - Users
//  *     description: Return users
//  *     responses:
//  *       200:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": true
//  *             "data": []
//  *       400:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "message": "failed to load users."
//  */
// router.get("/users/:id", getUsersById);

// router.get("/list-user", getAllUsers);

// /**
//  * @openapi
//  * /api/v1/users/disable-user/{id}/{status}:
//  *  get:
//  *     tags:
//  *     - Users
//  *     description: Active/De-active the user
//  *     responses:
//  *       200:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": true
//  *             "message": 'User Status Changed.'
//  *       400:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "message": "failed to update user status."
//  *       422:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": false
//  *             "message": "Something went wrong, try again."
//  */
// router.patch("/disable-user/:id", disableUser);

// router.get("/user-status/:stat", userStats);

// /**
//  * @openapi
//  * /api/v1/users/user/{id}:
//  *  delete:
//  *     tags:
//  *     - Users
//  *     description: Delete a user by id
//  *     responses:
//  *       200:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/User'
//  *           example:
//  *             "ok": true
//  *             "message": "User Deleted."
//  *       404:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": false
//  *             "message": "User not found."
//  *       400:
//  *         content:
//  *          application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/UserResponse'
//  *           example:
//  *             "ok": false
//  *             "message": "Fail to delete user."
//  */
// router.delete("/:id", deleteUser);

// export default router;
