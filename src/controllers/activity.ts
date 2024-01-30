import { Request, Response } from "express";
import { Activity } from "../Schema/Activity";
// Replace with the correct path to your Approval model

// Create Approval
export const createApproval = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    return res
      .status(200)
      .json({ ok: true, message: "activity Created Successfully." });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "activity to create approval." });
  }
};

// Update Approval
export const updateApproval = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const updatedApproval = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    return res.status(200).json({
      ok: true,
      message: "Approval Updated Successfully.",
      updatedApproval,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Failed to update approval." });
  }
};

// Find Approval by ID
export const findApprovalById = async (req: Request, res: Response) => {
  try {
    const approval = await Activity.findById(req.params.id);
    if (!approval) {
      return res
        .status(404)
        .json({ ok: false, message: "Approval not found." });
    }
    res.send(approval);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Error in finding approval." });
  }
};

// Find All Approvalsdd

export const findAllActivity = async (req: Request, res: Response) => {
  try {
    const approvals = await Activity.find().populate({
      path: "UserId",
      select: "",
    });

    res.send(approvals);
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve approvals.",
      error: error.message,
    });
  }
};

// Delete Approval
export const deleteApproval = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ ok: true, message: "Approval deleted successfully." });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Error in deleting approval." });
  }
};
