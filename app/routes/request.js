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
      { $push: { contacts: { email: friendEmail } } }, 
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
        return res.status(404).json({ error: "Profile not found for: " + selfEmail });
    }

    res.json({ ok: true, request: updatedRequest });
});

export default router;