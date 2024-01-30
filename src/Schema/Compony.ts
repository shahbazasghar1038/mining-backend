import mongoose from "mongoose";

export interface ICompanyDocument extends mongoose.Document {
  id: string;
  name: string;
  amount: string;
  email: string;
  status: string;
  wallatAddress: string;
  profit: string;
  phone: string;
  image: string;
}

const companySchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    status: String,
    amount: String,
    email: String,
    wallatAddress: String,
    profit: {
      type: String,
      default: 0,
    },
    phone: String,
    image: String,
  },
  {
    timestamps: true,
  },
);

export const Deposit = mongoose.model<ICompanyDocument>(
  "deposit",
  companySchema,
);
