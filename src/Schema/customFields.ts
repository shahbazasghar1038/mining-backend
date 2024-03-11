import mongoose from "mongoose";

export interface ICustomField {
  id: string;
  name: string;
  uploaded_by: string;
  value: string;
}

/**
 * @openapi
 * components:
 *  schemas:
 *    CustomFields:
 *      type: object
 *      required:
 *        - name
 *        - type
 *      properties:
 *        name:
 *          type: string
 *        type:
 *          type: string
 *    CustomFieldsResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const CustomFieldSchema = new mongoose.Schema<ICustomField>(
  {
    id: String,
    name: String,
    uploaded_by: String,
    value: String,
  },
  {
    timestamps: true,
  },
);

// Define the Mongoose model for the form data
export const CustomField = mongoose.model(
  "cns.customFields",
  CustomFieldSchema,
);
