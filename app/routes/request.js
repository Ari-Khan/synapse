import express from "express";
import Collection from "../models/collection.js";

const router = express.Router();

router.put("/", async (req, res) => {
    const { selfEmail, friendEmail } = req.body;

    if (!selfEmail) {
        return res.status(400).json({ error: "Missing users email" });
    }

    if (!friendEmail) {
        return res.status(400).json({ error: "Missing new friend's email" });
    }

    const updatedRequest = await Collection.findOneAndUpdate(
        { ownerEmail: selfEmail },
        {
            $setOnInsert: { ownerEmail: selfEmail }, // create ownerEmail if document doesn't exist
            $addToSet: { contacts: { email: friendEmail } } // add friendEmail if it doesn't exist
        },
        { new: true, runValidators: true, upsert: true }
    );

    if (!updatedRequest) {
        return res.status(404).json({ error: "Profile not found for: " + selfEmail });
    }

    res.json({ ok: true, request: updatedRequest });
});

export default router;