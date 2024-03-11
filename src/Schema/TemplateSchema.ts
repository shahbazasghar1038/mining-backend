import mongoose from "mongoose";

export interface ITemplate {
  id: string;
  amount: string;
  status: string;
  date: string;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Templates:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - file
 *        - desc
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        file:
 *          type: string
 *        desc:
 *          type: string
 *    TemplatesResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const templateSchema = new mongoose.Schema<ITemplate>(
  {
    id: String,
    amount: {
      type: String,
    },
    status: { type: String },
    date: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Template = mongoose.model("cns.templates", templateSchema);
