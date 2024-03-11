import { Request, Response } from "express";
import { Tag } from "../Schema/Tags";

export const createTag = async (req: Request, res: Response) => {
  try {
    const form = new Tag(req.body);
    await form.save();
    return res
      .status(200)
      .json({ ok: true, message: "Tag Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create tag.");
  }
};

export const findOneById = async (req: Request, res: Response) => {
  try {
    const teams = await Tag.findById(req.params.id);
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving tags data");
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const category = await Tag.find();

    res.send(category);
    // res.status(200).json({ ok: true, data: category });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve tags.",
      error: error.message,
    });
  }
};
export const EditTags = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTags = await Tag.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTags) {
      return res.status(404).json({ ok: false, message: "Tags not found" });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: "Tags Updated Successfully  " });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const forms = await Tag.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    if (forms.modifiedCount > 0) {
      return res
        .status(200)
        .json({ ok: true, message: "tags status updated successfully" });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update tags status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};

export const DeleteTags = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTags = await Tag.findByIdAndRemove(id);
    if (!deletedTags) {
      return res.status(404).json({ ok: false, message: "Tags not found" });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: "Tags deleted Successfully " });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};
