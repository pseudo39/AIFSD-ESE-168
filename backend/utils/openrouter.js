const axios = require("axios");

/**
 * Call OpenRouter with a prompt and return text response.
 * @param {string} systemPrompt - Role/context for the AI
 * @param {string} userPrompt  - The actual user message
 * @returns {Promise<string>}  - AI response text
 */
const callOpenRouter = async (systemPrompt, userPrompt) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",   // required by OpenRouter
        "X-Title": "Complaint Management System",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
};

module.exports = { callOpenRouter };
