import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminWallet extends Document {
    adminWallet: string;
}

const AdminWalletSchema: Schema = new Schema({
    adminWallet: {
        type: String,
        required: true
    }
});

export const AdminWallet = mongoose.model("adminWallet", AdminWalletSchema);