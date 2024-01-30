import express from "express";
import {
  DeleteTags,
  EditTags,
  changeStatus,
  createTag,
  findOneById,
  getAllTags,
} from "../controllers/tags";

const router = express.Router();

/**
 * @openapi
 * '/api/v1/tags/create-tag':
 *  post:
 *     tags:
 *     - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tags'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TagsResponse'
 *           example:
 *             "ok": true
 *             "message": "Tag Created Successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TagsResponse'
 *           example:
 *             "message": "Failed to create tag."
 */
router.post("/create", createTag);

router.put("/update/:id", EditTags);

router.delete("/:id", DeleteTags);

router.patch("/updte-status/:id", changeStatus);

router.get("/list-tags", getAllTags);

router.get("/:id", findOneById);

export default router;
