import { Request, Response } from "express";
import { Template } from "../Schema/TemplateSchema";
import AWS from "aws-sdk";

function getContentTypeByFile(fileName: string) {
  const ext = fileName.toLowerCase().split(".").pop();

  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "txt":
      return "text/plain";
    case "doc":
    case "docx":
      return "application/msword";
    // Add other file types as needed
    default:
      return "application/octet-stream";
  }
}

// Configure AWS
AWS.config.update({
  accessKeyId: "AKIAYIZRJVUCAVYDISPU",
  secretAccessKey: "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",
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

async function uploadFileToS3(
  fileBuffer: Buffer,
  bucketName: string,
  fileName: string,
): Promise<string> {
  const contentType = getContentTypeByFile(fileName);

  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `template/${fileName}`, // Modify this path as needed
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();
    return uploadResult.Location; // URL of the uploaded file
  } catch (error) {
    console.error("Error in uploading file to S3", error);
    throw error;
  }
}

export const createTemplate = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    if (req.file) {
      const file: any = req.file;
      const fileUrl = await uploadFileToS3(
        file.buffer,
        "cns-images-kyc",
        file.originalname,
      );
      console.log(fileUrl);
      req.body.file = fileUrl;
    }
    const template = new Template(req.body);
    await template.save();
    return res.json({
      ok: true,
      message: "Template upload successfully.",
      template,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ ok: false, message: "Failed to upload template" });
  }
};
export const getAllTemp = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const folder = await Template.find();

    res.send(folder);
    // res.status(200).json({ ok: true, data: folder });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: "Failed to retrieve folder.",
      error: error.message,
    });
  }
};

export const findOneById = async (req: Request, res: Response) => {
  try {
    const teams = await Template.findById(req.params.id);
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving template data");
  }
};

export const EditTemplate = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "body");
    if (req.file) {
      const file: any = req.file;
      const fileUrl = await uploadFileToS3(
        file.buffer,
        "cns-images-kyc",
        file.originalname,
      );
      console.log(fileUrl);
      req.body.file = fileUrl;
    }
    const { id } = req.params;
    const template = await Template.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!template) {
      return res.status(404).json({ ok: false, message: "Template not found" });
    } else {
      return res
        .status(200)
        .json({ ok: true, message: "Template Updated Successfully  " });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Something went wrong, try again." });
  }
};
export const deleteTemplate = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const r = await Template.deleteOne({ _id: req.params.id });
    if (r.deletedCount > 0) {
      return res.json({ ok: true, data: r, message: "Template deleted." });
    } else {
      return res
        .status(400)
        .json({ ok: false, data: r, message: "Failed to delete template." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ ok: false, message: "Failed to delete template." });
  }
};

export const archiveTempById = async (req: Request, res: Response) => {
  try {
    const temId = req.params.id;
    const newStatus = req.body.status;

    const updateResult = await Template.updateOne(
      { _id: temId },
      { $set: { status: newStatus } },
    );

    if (updateResult.matchedCount === 0) {
      return res
        .status(404)
        .send({ ok: false, message: "template not found." });
    } else if (updateResult.modifiedCount === 0) {
      return res
        .status(200)
        .send({ ok: true, message: "No changes made to the template." });
    } else {
      return res.status(200).send({
        ok: true,
        message: `template is ${newStatus} successfully.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, message: "Failed to archive template" });
  }
};
