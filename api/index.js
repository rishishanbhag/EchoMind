import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // 📸 For image uploads
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

// CORS Setup - Allow all origins for Vercel deployment
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For Vercel, we don't need app.listen() as it's handled by the platform
// But for local development, we need to listen on a port
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Multer Setup for Image Uploads
const upload = multer({ storage: multer.memoryStorage() });

/** Handle Text & Image Input */
app.post("/api/image-chat", upload.single("image"), async (req, res) => {
  try {
    const { chat } = req.body;
    const parts = [];

    // Add text input if provided
    if (chat) {
      parts.push({ text: chat });
    }

    // Add image input if provided
    if (req.file) {
      parts.push({
        inlineData: {
          mimeType: req.file.mimetype,
          data: req.file.buffer.toString("base64"),
        },
      });
    }

    // Ensure there's at least one part (text or image)
    if (parts.length === 0) {
      return res.status(400).json({ error: "No input provided" });
    }

    // Generate AI response
    const result = await model.generateContent({ contents: [{ parts }] });
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a catch-all handler for Vercel
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
