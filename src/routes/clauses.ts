import express from "express";
import {
  deleteClauses,
  changeStatus,
  getAllClauses,
  findOneById,
  EditClauses,
  handleWithdrawal,
  getAllClausesbyId,
} from "../controllers/clauses";

const router = express.Router();

router.post("/withdrawRequest", handleWithdrawal);

router.put("/update/:id", EditClauses);

router.patch("/updte-status/:id", changeStatus);

router.get("/list/:id", getAllClausesbyId);

router.get("/admin-list", getAllClauses);

router.get("/:id", findOneById);
/**
 * @openapi
 * /api/v1/clauses/{id}:
 *  delete:
 *     tags:
 *     - Clauses
 *     description: Delete a clauses by id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "message": "Clause Deleted Successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to delete Clause."
 */
router.delete("/:id", deleteClauses);

export default router;
