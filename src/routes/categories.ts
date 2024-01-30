import express from "express";

import {
  DeleteCategory,
  DisableCategory,
  EditCategory,
  changeStatus,
  create,
  deleteSubCategory,
  findOneById,
  getAllCategory,
} from "../controllers/categories";

const router = express.Router();

router.post("/create", create);

router.put("/update/:id", EditCategory);

router.patch("/:id", DisableCategory);

router.delete("/:id", DeleteCategory);

router.patch("/updte-status/:id", changeStatus);

router.get("/list-category/:id", getAllCategory);

router.get("/:id", findOneById);

router.delete("/:categoryId/subcategories/:subcategoryId", deleteSubCategory);

export default router;
