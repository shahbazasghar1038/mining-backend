import { Request, Response } from "express";
import { Folder } from "../Schema/FolderSchema";
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
    Key: `folder/${fileName}`, // Modify this path as needed
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
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const folderId = req.body.folderId;
    const fileUrl = await uploadFileToS3(
      file.buffer,
      "cns-images-kyc",
      file.originalname,
    );
    console.log(fileUrl);

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      {
        $push: {
          files: {
            name: file.originalname,
            desc: req.body.desc,
            fileUrl: fileUrl,
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    );

    if (updatedFolder) {
      res.status(200).json({
        ok: true,
        message: "File uploaded successfully.",
        updatedFolder,
      });
    } else {
      return res.status(404).json({ ok: false, message: "Folder not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
};

export const createFolder = async (req: Request, res: Response) => {
  const newFolder = new Folder(req.body);
  try {
    await newFolder.save();
    res.status(200).json({ ok: true, message: "Folder Created." });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const updateFolder = async (req: Request, res: Response) => {
  const folderId = req.params.id; // Assumes the ID is passed as a URL parameter
  const updateData = req.body;

  try {
    const updatedFolder = await Folder.findByIdAndUpdate(folderId, updateData, {
      new: true,
    });

    if (updatedFolder) {
      res.status(200).json({
        ok: true,
        message: "Folder updated successfully.",
        updatedFolder,
      });
    } else {
      res.status(404).json({ ok: false, message: "Folder not found." });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllFolders = async (req: Request, res: Response) => {
  try {
    // const userId = req.params.id;
    const folder = await Folder.find();

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
export const getFolderById = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find({ id: req.params.id });
    return res.json(folders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getoFolderContent = async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find({ _id: req.params.id });
    return res.json(folders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  const r = await Folder.deleteOne({ _id: req.params.id });
  if (r.deletedCount > 0) {
    return res.json({ ok: true, message: "Folder Deleted." });
  } else {
    res.json({ ok: false, message: "Failed to delete folder" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { folderId, fileId } = req.params;

    console.log(req.params, "folderId");

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "folder not found" });
    }

    folder.files = folder.files.filter((subCat: any) => subCat.id !== fileId);
    await folder.save();
    return res
      .status(200)
      .json({ ok: true, message: "file deleted successfully" });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Error deleting file" });
  }
};

// export const deleteFile = async (req: Request, res: Response) => {
//   const r = await Folder.findOne({ _id: req.params.folderId });

//   const result = r?.files.filter((file: any) => file._id != req.params.id);
//   const query = await Folder.updateOne(
//     { _id: req.params.folderId },
//     {
//       $set: {
//         files: result,
//       },
//     }
//   );
//   if (query.modifiedCount > 0) {
//     return res.json({ ok: true, message: "File Deleted" });
//   } else {
//     return res.json({ ok: false, message: "Failed to delete file" });
//   }
// };

// export const uploadDocument = async (req: Request, res: Response) => {
//   try {
//     const form: any = await Folder.updateOne(
//       { _id: req.body.id },
//       {
//         $push: {
//           files: req.body.payload,
//         },
//       },
//     );
//     if (form.modifiedCount < 0) {
//       res.status(404).json({ ok: false });
//     } else {
//       res.status(200).json({ ok: true });
//     }
//   } catch (err) {
//     res.status(500).send("Error deleting form data");
//   }
// };
