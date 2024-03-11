import { Request, Response } from "express";
import { Team } from "./../Schema/Team";

export const createTeam = async (req: Request, res: Response) => {
  try {
    const form = new Team(req.body);
    await form.save();
    return res
      .status(200)
      .json({ ok: true, message: "Team Created Successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to create team.");
  }
};

export const getAllTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const teams = await Team.find({ id: userId });
    res.send(teams);
    // res.status(200).json({ ok: true, data: teams });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve branch.",
      error: error.message,
    });
  }
};

export const getTeamsById = async (req: Request, res: Response) => {
  try {
    const teams = await Team.findById(req.params.id);
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving teams data");
  }
};

export const updateTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateTeams = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updateTeams) {
      return res.status(404).send("Teams not found");
    }
    res.status(200).json({
      ok: true,
      message: "Team updated successfully.",
      updateTeams,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating teams");
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const form = await Team.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
        },
      },
    );
    if (form.modifiedCount > 0) {
      return res
        .status(200)
        .send(
          `Team ${req.body.status ? "Un-archive" : "Archive"} successfully.`,
        );
    } else {
      return res.status(404).send("Team not found.");
    }
  } catch (err) {
    return res
      .status(400)
      .send(`Failed to ${req.body.status ? "Un-archive" : "Archive"} team.`);
  }
};
export const archiveTeamById = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const newStatus = req.body.status;

    console.log(`Updating status for Branch ID: ${teamId} to ${newStatus}`);

    if (!teamId || newStatus === undefined) {
      return res.status(400).send({ ok: false, message: "Invalid input data" });
    }

    const updateResult = await Team.updateOne(
      { _id: teamId },
      { $set: { status: newStatus } },
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).send({ ok: false, message: "Team not found." });
    } else if (updateResult.modifiedCount === 0) {
      return res
        .status(200)
        .send({ ok: true, message: "No changes made to the Team." });
    } else {
      return res.status(200).send({
        ok: true,
        message: `This team ${
          newStatus ? "archived" : "unarchived"
        } successfully.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, message: "Failed to archive Team" });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const result = await Team.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.status(200).json({ ok: true, message: "team deleted successfully." });
    } else {
      res.status(404).json({ ok: false, message: "team not found." });
    }
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to delete team.",
      error: error.message,
    });
  }
};
