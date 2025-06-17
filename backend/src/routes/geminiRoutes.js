const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `
You are a helpful weather assistant. Only answer questions related to weather, climate, or meteorology. If the question is not about weather, politely refuse.
User: ${question}
`;

  try {
    const geminiRes = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { "Content-Type": "application/json" }
    });
    const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";
    res.json({ text });
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

module.exports = router;