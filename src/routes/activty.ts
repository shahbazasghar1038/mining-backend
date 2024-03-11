import express from "express";
import {
  createApproval,
  updateApproval,
  findApprovalById,
  deleteApproval,
  findAllActivity,
} from "../controllers/activity";

const router = express.Router();

// Route to create an approval
router.post("/create", createApproval);

// Route to update an approval
router.put("/update/:id", updateApproval);

router.get("/list", findAllActivity);
// Route to find an approval by ID
router.get("/:id", findApprovalById);

// Route to delete an approval
router.delete("/delete/:id", deleteApproval);

export default router;
