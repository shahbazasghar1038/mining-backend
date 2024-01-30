import { Request, Response } from "express";
import { Deposit } from "../Schema/Compony";
import cron from "node-cron";
import AWS from "aws-sdk";
import { UserModel } from "../Schema/User";
import { Activity } from "../Schema/Activity";
// Configure AWS
AWS.config.update({
  accessKeyId: "AKIAQ3EGSDVRLKHUZIL2",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

async function uploadBase64ImageToS3(
  base64Image: string,
  bucketName: string,
  imageName: string,
): Promise<string> {
  const buffer = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );

  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: "mining-images-kyc",
    Key: imageName,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg", // Adjust the content type as needed
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location; // This is the URL of the uploaded image
  } catch (error) {
    console.error("Error in uploading image to S3", error);
    throw error;
  }
}
export const createCompany = async (req: Request, res: Response) => {
  try {
    let imageUrl;

    // Check if there is a new image in the request body
    if (req.body.image) {
      const imageName = `user-images/${Date.now()}.jpg`;

      // Upload the new image to S3
      imageUrl = await uploadBase64ImageToS3(
        req.body.image,
        "your-s3-bucket-name",
        imageName,
      );

      req.body.image = imageUrl;
    }
    console.log(imageUrl);
    console.log(req.body, "req.body");

    const company = new Deposit(req.body);
    await company.save();
    res
      .status(201)
      .json({ ok: true, message: "deposit Request sent successfully." });
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to create deposit.",
      error: error.message,
    });
  }
};

const updateDailyProfitForUsers = async () => {
  try {
    console.log("yes");

    // Fetch all users or a subset as per your requirement
    const users = await UserModel.find({
      /* Your criteria for selecting users, if any */
    });
    // console.log(users, "users");

    for (const user of users) {
      // Fetch companies associated with this user
      const companies = await Deposit.find({
        id: user._id,
        status: "approved",
      });

      for (const company of companies) {
        const profitt = parseFloat(company.amount) * 0.03; // 3% of the amount
        console.log(profitt, "profit");

        const newAmount = parseFloat(company.profit) + profitt;
        console.log(newAmount, "newAmount");

        // Update the company with the new amount
        await Deposit.updateOne(
          { _id: company._id },
          {
            $set: {
              profit: newAmount.toFixed(2),
            },
          },
        );
      }
    }

    console.log(
      "Daily profit updated for all approved companies of each user.",
    );
  } catch (error: any) {
    console.error("Failed to update daily profit for users:", error.message);
  }
};

// Schedule the task to run at midnight every day (00:00)
// cron.schedule(
//   "0 0 * * *",
//   () => {
//     console.log("Running the daily profit update job for users.");
//     updateDailyProfitForUsers();
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Dubai", // Set to Atyrau time zone
//   }
// );

cron.schedule(
  "*/30 * * * * *",
  () => {
    console.log(
      "Running the daily profit update job for users every 30 seconds.",
    );
    updateDailyProfitForUsers();
  },
  {
    scheduled: true,
    timezone: "Asia/Karachi", // Set to Pakistan's timezone
  },
);

export const getAllCompaniesbyId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const Compony = await Deposit.find({ id: userId });

    res.send(Compony);
    // updateDailyProfitForUsers();
    // res.status(200).json({ ok: true, data: Compony });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve compony.",
      error: error.message,
    });
  }
};
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const Compony = await Deposit.find({});

    res.send(Compony);
    // updateDailyProfitForUsers();
    // res.status(200).json({ ok: true, data: Compony });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve compony.",
      error: error.message,
    });
  }
};

// Function to update the daily profit

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const forms = await Deposit.updateOne(
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
        .json({ ok: true, message: "deposit status updated successfully" });
    } else {
      return res
        .status(422)
        .json({ ok: false, message: "Failed to update deposit status." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    let imageUrl;

    // Check if there is a new image in the request body
    if (req.body.image) {
      const imageName = `user-images/${Date.now()}.jpg`;

      // Upload the new image to S3
      imageUrl = await uploadBase64ImageToS3(
        req.body.image,
        "your-s3-bucket-name",
        imageName,
      );

      req.body.image = imageUrl;
    }
    console.log(imageUrl);
    console.log(req.body, "req.body");

    const company = await Deposit.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
    );
    if (!company) {
      return res.status(400).send("Company not found");
    }

    return res
      .status(200)
      .json({ ok: true, message: "compony updated successfully" });
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to update company.",
      error: error.message,
    });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const result = await Deposit.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ ok: true, message: "Company deleted successfully." });
    } else {
      res.status(404).json({ ok: false, message: "Company not found." });
    }
  } catch (error: any) {
    res.status(400).json({
      ok: false,
      message: "Failed to delete company.",
      error: error.message,
    });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const company = await Deposit.findOne({ id: companyId });

    if (!company) {
      res.status(404).json({ ok: false, message: "Company not found." });
    } else {
      res.status(200).json({ ok: true, data: company });
    }
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve company.",
      error: error.message,
    });
  }
};
