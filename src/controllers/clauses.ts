import { Request, Response } from "express";
import { Withdraw } from "../Schema/Clauses";
import { Deposit } from "../Schema/Compony";
import { Activity } from "../Schema/Activity";

export const handleWithdrawal = async (req: Request, res: Response) => {
  try {
    const { id, withdrawalAmount } = req.body;
    const userDeposits = await Deposit.find({ id: id, status: "approved" });
    console.log(userDeposits, "userDeposits");

    // Check if user has enough profit to withdraw
    let totalProfit = 0;
    userDeposits.forEach(
      (deposit) => (totalProfit += parseFloat(deposit.profit)),
    );
    console.log(totalProfit, "totalProfit", withdrawalAmount);

    if (totalProfit < withdrawalAmount) {
      return res
        .status(400)
        .json({ ok: false, message: "Insufficient profit for withdrawal." });
    }

    // Deduct withdrawal amount from user's profit starting from the oldest deposit
    let remainingWithdrawalAmount = withdrawalAmount;
    for (const deposit of userDeposits) {
      if (remainingWithdrawalAmount <= 0) break;
      let currentProfit = parseFloat(deposit.profit);
      const deduction = Math.min(currentProfit, remainingWithdrawalAmount);
      remainingWithdrawalAmount -= deduction;
      currentProfit -= deduction;

      await Deposit.updateOne(
        { _id: deposit._id },
        { $set: { profit: currentProfit.toFixed(2) } },
      );
    }

    // Create withdrawal record
    const newWithdrawal = new Withdraw(req.body);
    await newWithdrawal.save();
    res
      .status(201)
      .json({ ok: true, message: "Withdrawal processed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to process withdrawal.");
  }
};

export const getClausesById = async (req: Request, res: Response) => {
  try {
    const forms = await Withdraw.find({ id: req.params.id });
    res.status(200).send(forms);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to retrieving withdraw data.");
  }
};
export const findOneById = async (req: Request, res: Response) => {
  try {
    const teams = await Withdraw.findById(req.params.id);
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving withdraw data");
  }
};

export const getAllClausesbyId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const clauses = await Withdraw.find({ id: userId });

    res.send(clauses);
    // res.status(200).json({ ok: true, data: clauses });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve withdraw.",
      error: error.message,
    });
  }
};
export const getAllClauses = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const clauses = await Withdraw.find({});

    res.send(clauses);
    // res.status(200).json({ ok: true, data: clauses });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve withdraw.",
      error: error.message,
    });
  }
};
export const EditClauses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTags = await Withdraw.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTags) {
      return res.status(404).json({ ok: false, message: "withdraw not found" });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: "withdraw Updated Successfully  " });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const forms = await Withdraw.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    if (forms.modifiedCount > 0) {
      const activity = new Activity(req.body);
      await activity.save();
      // return res
      //   .status(200)
      //   .json({ ok: true, message: "activity Created Successfully." });
      return res
        .status(200)
        .json({ ok: true, message: "withdraw status updated successfully" });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update withdraw status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};

export const deleteClauses = async (req: Request, res: Response) => {
  try {
    const forms = await Withdraw.deleteOne({ _id: req.params.id });
    if (forms.deletedCount > 0) {
      return res.json({ ok: true, message: "withdraw Deleted Successfully." });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete withdraw.");
  }
};
