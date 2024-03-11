import mongoose from "mongoose";
/**
 * @openapi
 * components:
 *  schemas:
 *    Teams:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - manager
 *        - members
 *        - status
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        manager:
 *          type: string
 *        members:
 *          type: array
 *          items:
 *            type: object
 *        status:
 *          type: boolean
 *    TeamsResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const TeamSchema = new mongoose.Schema({
  name: String,
  id: String,
  // manager: {
  //   ref: "cns.users",
  //   type: mongoose.Schema.Types.ObjectId,
  // },
  email: String,
  status: String,
  amount: String,
});

// Define the Mongoose model for the form data
export const Team = mongoose.model("cns.team", TeamSchema);
