import mongoose from "mongoose";

export interface IPermissions {
  id: string;
  name: string;
  description: string;
  permissions: [];
}

/**
 * @openapi
 * components:
 *  schemas:
 *    Permissions:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - description
 *        - permissions
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        permissions:
 *          type: array
 *          items:
 *             type: object
 *    PermissionsResponse:
 *      type: object
 *      properties:
 *        ok:
 *          type: boolean
 *        message:
 *          type: string
 */
const PermissionSchema = new mongoose.Schema<IPermissions>(
  {
    name: String,
    id: String,
    description: String,
    permissions: [],
  },
  {
    timestamps: true,
  },
);

// Define the Mongoose model for the form data
export const Permissions = mongoose.model("cns.permissions", PermissionSchema);
