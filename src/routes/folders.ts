import express from "express";
import {
  createFolder,
  getFolderById,
  getoFolderContent,
  deleteFolder,
  uploadDocument,
  deleteFile,
  getAllFolders,
  updateFolder,
} from "../controllers/folders";
import multer from "multer";
const router = express.Router();

const upload = multer();

router.post("/upload", upload.single("file"), uploadDocument);

router.post("/create-folder", createFolder);
router.put("/update/:id", updateFolder);
router.get("/list-folder/:id", getAllFolders);
router.get("/:id", getFolderById);
router.get("/getFolderContents/:id", getoFolderContent);
router.delete("/folders/:id", deleteFolder);
router.delete("/:folderId/files/:fileId", deleteFile);
router.delete("/file/:folderId/:id", deleteFile);
router.post("/document", uploadDocument);

export default router;
