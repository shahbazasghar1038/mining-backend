import mongoose from "mongoose";

export interface ITag {
  id: string;
  name: string;
  status: string;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Tags:
 *      type: object
 *      required:
 *        - id
 *        - name
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *    TagResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const TagSchema = new mongoose.Schema<ITag>(
  {
    id: String,
    name: String,
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

// Define the Mongoose model for the form data
export const Tag = mongoose.model("cns.tags", TagSchema);
