import express from "express";
import {
  createPermission,
  getPermissions,
  deletePermissions,
} from "../controllers/permissions";

const router = express.Router();

/**
 * @openapi
 * '/api/v1/permissions/create-permission':dddd
 *  post:
 *     tags:
 *     - Permissions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permissions'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/PermissionsResponse'
 *           example:
 *             "ok": true
 *             "message": "Role created successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "message": "Failed to add role & permission."
 */
router.post("/create-permission", createPermission);
/**
 * @openapi
 * /api/v1/permissions/{id}:
 *  get:
 *     tags:
 *     - Permissions
 *     description: Returns an array of permissions associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "permissions": []
 */
router.get("/:id", getPermissions);
/**
 * @openapi
 * /api/v1/permissions/{id}:
 *  delete:
 *     tags:
 *     - Permissions
 *     description: Delete a Permission by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "message": "Role deleted successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to delete roles & permission."
 */
router.delete("/:id", deletePermissions);

export default router;
