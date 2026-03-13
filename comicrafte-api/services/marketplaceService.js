import express from "express";
import { marketplace } from "../database/db.js";

const router = express.Router();

// créer produit
router.post("/create", (req, res) => {

  const { title, priceInk } = req.body;

  const item = {
    id: "p" + Date.now(),
    title,
    priceInk
  };

  marketplace.push(item);

  res.json(item);
});

// liste produits
router.get("/", (req, res) => {
  res.json(marketplace);
});

export default router;