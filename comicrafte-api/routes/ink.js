import express from "express";
import { addInk } from "../services/inkService.js";

const router = express.Router();

router.post("/earn", async (req, res) => {

  try {

    const { uid, action } = req.body;

    let points = 0;

    if (action === "read") points = 2;
    if (action === "share") points = 10;
    if (action === "weekly_rank") points = 30;

    await addInk(uid, points, action);

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

export default router;