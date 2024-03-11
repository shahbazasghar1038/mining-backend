import { Request, Response } from "express";
import { AdminWallet, IAdminWallet } from "../Schema/AdminWallet";
// Replace with the correct path to your Approval model

// Create or Update AdminWallet address
export const createAdminWallet = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        let adminWallet = await AdminWallet.findOne();
        if (!adminWallet) {
            adminWallet = new AdminWallet(req.body);
        } else {
            adminWallet.adminWallet = req.body.adminWallet;
        }
        await adminWallet.save();
        return res
            .status(201)
            .json({ ok: true, message: "Admin Wallet address created successfully.", adminWallet });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ ok: false, message: "Server Error" });
    }
};


// Get AdminWallet address
export const getAdminWallet = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const adminWallet: IAdminWallet | null = await AdminWallet.findOne();
        if (!adminWallet) {
            return res.status(404).json({ ok: false, message: "Admin Wallet address not found" });
        }
        return res.status(200).json({ ok: true, address: adminWallet.adminWallet });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Server Error" });
    }
};