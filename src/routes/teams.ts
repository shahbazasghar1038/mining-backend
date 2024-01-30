import express from "express";

import {
  getTeamsById,
  updateTeam,
  createTeam,
  getAllTeam,
  deleteTeam,
  updateTeamById,
  archiveTeamById,
} from "../controllers/teams";
const router = express.Router();

/**
 * @openapi
 * '/api/v1/teams/create-team':
 *  post:
 *     tags:
 *     - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teams'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TeamsResponse'
 *           example:
 *             "ok": true
 *             "message": "Team Created Successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TeamsResponse'
 *           example:
 *             "message": "Failed to create team."
 */
router.post("/create-team", createTeam);
/**
 * @openapi
 * /api/v1/teams/{id}:
 *  get:
 *     tags:
 *     - Teams
 *     description: Returns an array of teams associated with given Id
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/BranchResponse'
 *           example:
 *             "ok": true
 *             "teams": []
 */

router.get("/list-teams/:id", getAllTeam);

router.get("/:id", getTeamsById);

/**
 * @openapi
 * '/api/v1/teams/{id}':
 *  post:
 *     tags:
 *     - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teams'
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TeamsResponse'
 *           example:
 *             "ok": true
 *             "message": "Team archive successfully."
 *       400:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TeamsResponse'
 *           example:
 *             "ok": false
 *             "message": "Failed to archive team."
 *       404:
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/TeamsResponse'
 *           example:
 *             "ok": false
 *             "message": "Team not found"
 */
router.post("/team/:id", updateTeam);
router.put("/update/:id", updateTeamById);
router.delete("/:id", deleteTeam);
router.patch("/archive/:id", archiveTeamById);

export default router;
