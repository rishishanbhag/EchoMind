import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();

// CORS Setup - Allow all origins for now to debug
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Multer Setup for Image Uploads
const upload = multer({ storage: multer.memoryStorage() });

// For Vercel serverless function, we export a handler
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check
  if (req.url === '/api/health' || req.url === '/health') {
    res.status(200).json({ status: "OK", message: "Backend is running" });
    return;
  }

  // Root endpoint
  if (req.url === '/' || req.url === '/api') {
    res.status(200).json({ message: "EchoMind Backend API" });
    return;
  }

  // Image chat endpoint
  if (req.url === '/api/image-chat' || req.url === '/image-chat') {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      // Parse form data manually for Vercel
      const formData = new FormData();
      // This is simplified - in production you'd need proper multipart parsing
      
      const { chat } = req.body || {};
      const parts = [];

      // Add text input if provided
      if (chat) {
        parts.push({ text: chat });
      }

      // For now, let's handle text-only requests
      if (parts.length === 0) {
        res.status(400).json({ error: "No input provided" });
        return;
      }

      // Generate AI response
      const result = await model.generateContent({ contents: [{ parts }] });
      const responseText = result.response.text();

      res.status(200).json({ text: responseText });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    return;
  }

  // Catch all
  res.status(404).json({ error: "Route not found" });
}
