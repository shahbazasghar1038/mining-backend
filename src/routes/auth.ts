import { Request, Response } from "express";
import express from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import { Admin } from "../Schema/Admin";

const router = express.Router();

router.post("/checkUser", async (req: Request, res: Response) => {
  console.log(req.body);
  // const { error } = CheckValidate(req.body)

  // if (error) return res.status(400).json({ ok: false, message: error.details[0].message });
  // console.log(error)

  const user = await Admin.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ ok: false, message: "User already exits" });

  return res.status(200).json({ ok: true });
});
router.get("/", async (req: Request, res: Response) => {
  const results = await Admin.find();
  res.send(results);
});

router.post("/login", async (req: Request, res: Response) => {
  const { error } = validate(req.body);

  if (error)
    return res.json({ status: 400, message: error.details[0].message });

  const user = await Admin.findOne({ email: req.body.email });

  if (!user)
    return res.json({ status: 400, message: "Invalid user or password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.json({ status: 400, message: "Invalid user or password" });

  const token = user.generateAuthToken();

  return res.send(token);
});

router.post("/loginWithGoogle", async (req: Request, res: Response) => {
  console.log(req.body);

  const user = await Admin.findOne({ email: req.body.email });

  if (!user) return res.send("");

  const token = user.generateAuthToken();
  return res.send(token);
});

const validate = (req: Request) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
};

export default router;
