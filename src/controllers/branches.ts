import { Request, Response } from "express";
import { Branch } from "../Schema/BranchSchema";

export const createBranch = async (req: Request, res: Response) => {
  try {
    const form = new Branch(req.body);
    await form.save();
    return res
      .status(200)
      .json({ ok: true, message: "Branch Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create branch.");
  }
};

export const getBranchById = async (req: Request, res: Response) => {
  try {
    // Using _id to find the document
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).send("Branch not found.");
    }

    res.status(200).send(branch);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving branch");
  }
};

export const updateBranchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the document by ID and update it
    const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBranch) {
      return res.status(404).send("Branch not found.");
    }

    res.status(200).json({
      ok: true,
      message: "Branch updated successfully.",
      updatedBranch,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating branch.");
  }
};

export const getAllBranch = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log(userId, "id");

    const branches = await Branch.find({ id: userId }).populate(
      "manager",
      "firstName _id",
    );
    // .select("branchName manager status");
    res.send(branches);
    // res.status(200).json({ ok: true, data: branches });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve branch.",
      error: error.message,
    });
  }
};

export const archiveBranchById = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.id;
    const newStatus = req.body.status;

    console.log(`Updating status for Branch ID: ${branchId} to ${newStatus}`);

    if (!branchId || newStatus === undefined) {
      return res.status(400).send({ ok: false, message: "Invalid input data" });
    }

    const updateResult = await Branch.updateOne(
      { _id: branchId },
      { $set: { status: newStatus } },
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).send({ ok: false, message: "Branch not found." });
    } else if (updateResult.modifiedCount === 0) {
      return res
        .status(200)
        .send({ ok: true, message: "No changes made to the branch." });
    } else {
      return res.status(200).send({
        ok: true,
        message: `Branch is ${
          newStatus ? "archived" : "unarchived"
        } successfully.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, message: "Failed to archive branch" });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const result = await Branch.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ ok: true, message: "Branch deleted successfully." });
    } else {
      res.status(404).json({ ok: false, message: "Branch not found." });
    }
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to delete Branch.",
      error: error.message,
    });
  }
};

// export const updateGeneralFilterSettings = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const updateData = req.body.filterSettings;

//     const updatedSettings = await Branch.findOneAndUpdate(
//       { isGeneralSettings: true },
//       { filterSettings: updateData },
//       { new: true, upsert: true }
//     );

//     if (!updatedSettings) {
//       return res.status(404).send("General settings not found.");
//     }

//     res.status(200).json({
//       ok: true,
//       message: "General settings updated successfully.",
//       updatedSettings,
//     });
//   } catch (err) {
//     res.status(500).send("Error updating general settings.");
//   }
// };
