import mongoose, { Schema } from "mongoose";

interface Overview {
  name: string;
  vendor: string;
  currency: string;
  value: number;
  category: string;
  tags: string[];
  branch: string;
  team: string;
  contractType: string;
  status: string;
}

interface Lifecycle {
  startDate: Date;
  endDate: Date;
  noticePeriodDate: Date;
  renewalOwners: string[];
}

interface Discussions {
  userid: string;
  comment: string;
  mentions: [];
  date_time: Date;
}

interface Contract extends mongoose.Document {
  userId: object;
  overview: Overview;
  lifecycle: Lifecycle;
  discussions: Discussions[];
  attachments: string[];
  shareWith: string[];
}

const contractSchema = new mongoose.Schema<Contract>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  overview: {
    name: String,
    vendor: String,
    currency: String,
    value: Number,
    category: String,
    tags: [String],
    branch: String,
    team: String,
    contractType: String,
    status: String,
  },
  lifecycle: {
    startDate: Date,
    endDate: Date,
    noticePeriodDate: Date,
    renewalOwners: [String],
  },
  discussions: [Schema.Types.Mixed],
  attachments: [String],
  shareWith: [String],
});

export const Contract = mongoose.model<Contract>(
  "cns.contracts",
  contractSchema,
);
