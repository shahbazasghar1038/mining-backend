import { Request, Response } from "express";
import express from "express";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  return res.json({ ok: true, message: "Server is up & running" });
});

export default router;
