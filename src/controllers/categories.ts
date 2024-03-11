import { Request, Response } from "express";
import { Categories } from "../Schema/category";
import { SUCCESS_CODES } from "./../../constants/successCode";
import { ERROR_CODES } from "../../constants/errorCodes";

// Create a new category
export const create = async (req: Request, res: Response) => {
  try {
    await Categories.create(req.body);
    return res
      .status(201)
      .json({ ok: true, message: SUCCESS_CODES.CATEGORIES.CATEGORY_CREATED });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CATEGORIES.ERROR_CREATING_CATEGORY,
    });
  }
};
export const getAllCategory = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const category = await Categories.find();

    res.send(category);
    // res.status(200).json({ ok: true, data: category });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve branch.",
      error: error.message,
    });
  }
};

export const findOneById = async (req: Request, res: Response) => {
  try {
    const teams = await Categories.findById(req.params.id);
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving teams data");
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const category = await Categories.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true },
    );

    if (category) {
      return res.status(200).json({
        ok: true,
        message: "Category status updated successfully",
      });
    } else {
      return res.status(422).json({
        ok: false,
        message: "Failed to update Category status. Category not found.",
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};
// Edit a category by ID
export const EditCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Categories.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CATEGORIES.NOT_FOUND });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: SUCCESS_CODES.CATEGORIES.CATEGORY_UPDATED });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: ERROR_CODES.CATEGORIES.ERROR_UPDATING });
  }
};

// Disable a category by ID
export const DisableCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Extract status from req.body

    // Ensure that the status value is provided and valid
    if (!status) {
      return res.status(400).json({
        ok: false,
        message: "Status value is required.",
      });
    }

    const updatedCategory = await Categories.findByIdAndUpdate(
      id,
      { status: status }, // Update the status with the provided value
      { new: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({
        ok: false,
        message: ERROR_CODES.CATEGORIES.NOT_FOUND,
      });
    } else {
      return res.status(200).json({
        ok: true,
        message: "Category status updated successfully.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CATEGORIES.ERROR_UPDATING,
    });
  }
};

// Delete a category by ID
export const DeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Categories.findByIdAndRemove(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CATEGORIES.NOT_FOUND });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: SUCCESS_CODES.CATEGORIES.CATEGORY_DELETED });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: ERROR_CODES.CATEGORIES.ERROR_DELETING });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    console.log(req.params, "categoryId");

    const category = await Categories.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.subCategories = category.subCategories.filter(
      (subCat: any) => subCat.id !== subcategoryId,
    );
    await category.save();
    return res
      .status(200)
      .json({ ok: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error deleting subcategory" });
  }
};
