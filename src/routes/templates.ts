import express from "express";
import {
  EditTemplate,
  archiveTempById,
  createTemplate,
  deleteTemplate,
  findOneById,
  getAllTemp,
} from "../controllers/templates";
import multer from "multer";
const router = express.Router();
const upload = multer();

router.post("/create-template", upload.single("file"), createTemplate);
router.get("/list", getAllTemp);
/**
 * @openapi
 * /api/v1/templates/{id}:
 *  get:
 *     tags:
 *     - Templates
 *     description: Returns an array of templates associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TemplatesResponse'
 *           example:
 *             "ok": true
 *             "templates": []
 */
router.get("/:id", findOneById);

router.put("/update/:id", upload.single("file"), EditTemplate);
/**
 * @openapi
 * /api/v1/templates/delete-template/{id}:
 *  delete:
 *     tags:
 *     - Templates
 *     description: Delete a template by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Templates'
 *           example:
 *             "ok": true
 *             "message": "Template deleted."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TemplatesResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to delete template."
 */
router.delete("/:id", deleteTemplate);
router.patch("/archive/:id", archiveTempById);

export default router;
