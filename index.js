const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const stripe = require("stripe")(process.env.SECRET_KEY);

const app = express();

app.use(express.json());
app.use(cors());

app.post("/gen_client_secret", async (req, res) => {
  try {
    const response = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
    });
    res.status(201).json({ clientSecret: response.client_secret });
  } catch (error) {
    console.log(error);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(process.env.PORT || 8000);
