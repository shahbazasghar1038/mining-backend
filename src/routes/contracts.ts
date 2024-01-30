import express from "express";
import {
  createContract,
  deleteContract,
  getAllContract,
  getContractsByUserId,
  updateContract,
} from "../controllers/contracts";

const router = express.Router();

router.get("/:userId", getContractsByUserId);
router.post("/create", createContract);
router.get("/list-contract/:id", getAllContract);
router.put("/:id", updateContract);
router.delete("/:id", deleteContract);

export default router;
