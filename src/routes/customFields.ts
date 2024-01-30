import express from "express";

import {
  createCustomField,
  getCustomFieldsById,
  deleteCustomFields,
  getAllFeild,
  updateField,
} from "../controllers/customFields";

const router = express.Router();
/**
 * @openapi
 * '/api/v1/customFields/create-custom-field':
 *  post:
 *     tags:
 *     - Custom Fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomFields'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/CustomFieldResponse'
 *           example:
 *             "ok": true
 *             "message": "Custom Field Created."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "message": "Failed to create custom field."
 */
router.post("/create", createCustomField);
router.get("/list", getAllFeild);
/**
 * @openapi
 * /api/v1/customFields/custom-field/{id}:
 *  get:
 *     tags:
 *     - Custom Fields
 *     description: Returns an array of custom fields associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "clauses": []
 */
router.get("/custom-field/:id", getCustomFieldsById);
router.put("/update/:id", updateField);

/**
 * @openapi
 * /api/v1/customFields/custom-field/{id}:
 *  delete:
 *     tags:
 *     - Custom Fields
 *     description: Delete a custom field by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "message": "Custom Field Deleted Successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to delete custom field."
 */
router.delete("/custom-field/:id", deleteCustomFields);

export default router;
