import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    name: String,
    id: String,
    UserId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cns.users",
      },
    ],
    status: String,
    amount: String,
    email:String,
    type: String,
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  },
);

export const Activity = mongoose.model("activity", ActivitySchema);
