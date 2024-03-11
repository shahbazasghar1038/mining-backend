import { Request, Response } from "express";
import { Permissions } from "../Schema/Permissions";

export const createPermission = async (req: Request, res: Response) => {
  try {
    const permissions = new Permissions(req.body);
    await permissions.save();
    return res.json({ ok: true, message: "Role created successfully." });
  } catch (err) {
    return res.json({ ok: false, message: "Failed to add roles & permission" });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  console.log(req.params);
  try {
    const permissions = await Permissions.find({ id: req.params.id }).select(
      "-permissions",
    );
    return res.json({ ok: true, data: permissions });
  } catch (err) {
    return res.json({
      ok: false,
      message: "Failed to load add roles & permission",
    });
  }
};

export const deletePermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await Permissions.deleteOne({ _id: req.params.id });
    if (permissions.deletedCount > 0) {
      return res
        .status(200)
        .json({ ok: true, message: "Role deleted successfully." });
    }
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: "Failed to delete roles & permission.",
    });
  }
};
