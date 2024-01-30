import mongoose from "mongoose";

interface IFile {
  name: string;
  desc: string;
  fileUrl: string;
  timestamp: Date;
}

const fileSchema = new mongoose.Schema<IFile>({
  name: { type: String, required: true },
  desc: String,
  fileUrl: String,
  timestamp: { type: Date, default: Date.now },
});

export interface IFolder {
  id: string;
  name: string;
  permissions: [];
  parent: object;
  subFolders: [];
  files: IFile[];
}

const folderSchema = new mongoose.Schema<IFolder>(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    files: [fileSchema],
  },
  {
    timestamps: true,
  },
);

export const Folder = mongoose.model("cns.folder", folderSchema);
