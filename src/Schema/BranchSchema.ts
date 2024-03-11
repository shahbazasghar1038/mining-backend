import mongoose from "mongoose";

export interface IBranches {
  id: string;
  branchName: string;
  branchId: string;
  address: string;
  pinCode: string;
  contact: string;
  manager: mongoose.Schema.Types.ObjectId;
  state: string;
  website: string;
  country: string;
  // year: string;
  status: string;
  // isGeneralSettings: boolean;
  // filterSettings: {
  //   name: boolean;
  //   manager: boolean;
  //   status: boolean;
  //   activeContract: boolean;
  //   annualValue: boolean;
  // };
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Branch:
 *      type: object
 *      required:
 *        - branchName
 *        - branchId
 *        - manager
 *        - address
 *        - state
 *        - country
 *        - code
 *        - contact
 *        - website
 *        - year
 *        - status
 *        - id
 *      properties:
 *        branchName:
 *          type: string
 *        branchId:
 *          type: string
 *        address:
 *          type: string
 *        manager:
 *          type: string
 *        state:
 *          type: string
 *        country:
 *          type: string
 *        code:
 *          type: string
 *        contact:
 *          type: string
 *        website:
 *          type: string
 *        year:
 *          type: number
 *        status:
 *          type: boolean
 *        id:
 *          type: string
 *    BranchResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const BranchSchema = new mongoose.Schema<IBranches>(
  {
    id: String,

    branchName: {
      required: true,
      type: String,
      unique: true,
    },
    address: {
      required: false,
      type: String,
    },
    pinCode: {
      required: false,
      type: String,
    },
    contact: {
      required: true,
      type: String,
    },
    manager: {
      ref: "cns.users",
      type: mongoose.Schema.Types.ObjectId,
    },
    state: {
      required: true,
      type: String,
    },
    website: {
      required: false,
      type: String,
    },
    country: {
      required: true,
      type: String,
    },
    branchId: {
      required: false,
      type: String,
      unique: true,
    },
    // year: {
    //   required: true,
    //   type: String,
    // },
    status: {
      required: false,
      type: String,
    },
    // filterSettings: {
    //   name: { type: Boolean, default: false },
    //   manager: { type: Boolean, default: false },
    //   status: { type: Boolean, default: false },
    //   activeContract: { type: Boolean, default: false },
    //   annualValue: { type: Boolean, default: false },
    // },
    // isGeneralSettings: {
    //   type: Boolean,
    //   default: false,
    // },
    // ..
  },

  {
    timestamps: true,
  },
);

// Define the Mongoose model for the form data
export const Branch = mongoose.model("cns.branch", BranchSchema);
