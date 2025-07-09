import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { chat } = req.body || {};
    const parts = [];

    // Add text input if provided
    if (chat) {
      parts.push({ text: chat });
    }

    // Ensure there's at least one part (text or image)
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
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
