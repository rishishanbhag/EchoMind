import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend's URL
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/gemini", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: req.body.history || [],
    });

    const msg = req.body.text || "Hello, Gemini!";
    const result = await chat.sendMessage(msg, {
      temperature: 0.5,
      maxOutputTokens: 50,
    });

    const response = result.getResponse();
    const text = response.getText();
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});