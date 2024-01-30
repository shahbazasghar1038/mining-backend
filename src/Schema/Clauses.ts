import mongoose from "mongoose";

export interface IClauses {
  id: string;
  name: string;
  amount: string;
  email: string;
  status: string;
  wallatAddress: string;
  phone: string;
  profhit: string;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Clauses:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - description
 *        - content
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        content:
 *          type: string
 *    ClausesResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const ClausesSchema = new mongoose.Schema<IClauses>(
  {
    id: String,
    name: String,
    amount: String,
    status: String,
    email: String,
    wallatAddress: String,
    phone: String,
    profhit: String,
  },
  {
    timestamps: true,
  },
);

// Define the Mongoose model for the form data
export const Withdraw = mongoose.model("withdraw", ClausesSchema);
