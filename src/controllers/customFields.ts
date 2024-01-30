import { Request, Response } from "express";
import { CustomField } from "../Schema/customFields";

export const createCustomField = async (req: Request, res: Response) => {
  try {
    const form = new CustomField(req.body);
    await form.save();
    return res.status(201).json({ ok: true, message: "Custom Field Created." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create custom field");
  }
};

export const getAllFeild = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const custoFeild = await CustomField.find();

    res.send(custoFeild);
    // res.status(200).json({ ok: true, data: custoFeild });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve custoFeild.",
      error: error.message,
    });
  }
};

export const updateField = async (req: Request, res: Response) => {
  const fieldId = req.params.id; // Assumes the ID is passed as a URL parameter
  const updateData = req.body;

  try {
    const updatedFolder = await CustomField.findByIdAndUpdate(
      fieldId,
      updateData,
      {
        new: true,
      },
    );

    if (updatedFolder) {
      res.status(200).json({
        ok: true,
        message: "Field name updated successfully ",
        updatedFolder,
      });
    } else {
      res.status(404).json({ ok: false, message: "Custom Field not found." });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCustomFieldsById = async (req: Request, res: Response) => {
  try {
    const forms = await CustomField.find({ id: req.params.id });
    res.send(forms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving form data");
  }
};

export const deleteCustomFields = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    await CustomField.deleteOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, message: "Custom Field Deleted." });
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete custom field");
  }
};
