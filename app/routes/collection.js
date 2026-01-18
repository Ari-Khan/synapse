import express from "express";
import Collection from "../models/collection.js";
import Profile from "../models/profile.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const collection = await Collection.findOne({ ownerEmail: email });

  if (!collection || !collection.contacts.length) {
    return res.json([]);
  }

  const emails = collection.contacts.map(c => c.email);

  const profiles = await Profile.find({
    email: { $in: emails }
  });

  res.json(profiles);
});

router.put("/", async (req, res) => {
  const { selfEmail, friendEmail } = req.body;

  if (!selfEmail || !friendEmail) {
    return res.status(400).json({ error: "Missing emails" });
  }

  const updated = await Collection.findOneAndUpdate(
    { ownerEmail: selfEmail },
    {
      $addToSet: {
        contacts: { email: friendEmail }
      }
    },
    { upsert: true, new: true }
  );

  res.json({ ok: true, collection: updated });
});

export default router;
