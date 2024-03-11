import express from "express";
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyById,
  changeStatus,
  getAllCompaniesbyId,
} from "../controllers/compony";

const router = express.Router();

router.post("/depositRequest", createCompany);
router.get("/list/:id", getAllCompaniesbyId);
router.get("/admin-list", getAllCompanies);
// router.get("/profit/:id", updateDailyProfit);
router.get("/single/:id", getCompanyById);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.patch("/updte-status/:id", changeStatus);

export default router;
