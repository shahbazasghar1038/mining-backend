import mongoose from "mongoose";

export const validateMongooseId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};
