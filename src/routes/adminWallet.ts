import express from "express";
import { createAdminWallet, getAdminWallet } from "../controllers/adminWallet";

const router = express.Router();

// POST endpoint to create or update adminWallet address
router.post("/createAdminWallet", createAdminWallet);

// GET endpoint to get adminWallet address
router.get("/getAdminWallet", getAdminWallet);

export default router;