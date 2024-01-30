import { Request, Response } from "express";
import { Contract } from "../Schema/contract";
import { SUCCESS_CODES } from "../../constants/successCode";
import { ERROR_CODES } from "../../constants/errorCodes";

export const getContractsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const contracts = await Contract.find({ userId });
    return res.status(201).json({
      ok: true,
      contracts,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CONTRACTS.ERROR_FETCHING_CONTRACT,
    });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const newContract = req.body;
    await Contract.create(newContract);
    return res
      .status(201)
      .json({ ok: true, message: SUCCESS_CODES.CONTRACTS.CONTRACT_CREATED });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CONTRACTS.ERROR_CREATING_CONTRACT,
    });
  }
};
export const getAllContract = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log(userId, "id");

    const contract = await Contract.find({ id: userId });
    // .select("branchName manager status");
    res.send(contract);
    // res.status(200).json({ ok: true, data: contract });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve branch.",
      error: error.message,
    });
  }
};
export const updateContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedContract = await Contract.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedContract) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CONTRACTS.NOT_FOUND });
    } else {
      return res.json(updatedContract);
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CONTRACTS.ERROR_UPDATING_CONTRACT,
    });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndRemove(id);
    if (!deletedContract) {
      return res
        .status(404)
        .json({ ok: false, message: ERROR_CODES.CONTRACTS.NOT_FOUND });
    } else {
      res.json(deletedContract);
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: ERROR_CODES.CONTRACTS.ERROR_DELETING_CONTRACT,
    });
  }
};
