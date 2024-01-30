import mongoose from "mongoose";

interface SubCategory {
  name: string;
}

interface Category extends Document {
  id: string;
  name: string;
  status: string;
  createdByName: string;
  subCategories: SubCategory[];
}

const subCategorySchema = new mongoose.Schema<SubCategory>({
  name: String,
});

const categorySchema = new mongoose.Schema<Category>({
  id: String,
  name: String,
  createdByName: String,
  status: { type: String, default: "Active" },
  subCategories: [subCategorySchema],
});

export const Categories = mongoose.model("cns.categories", categorySchema);
