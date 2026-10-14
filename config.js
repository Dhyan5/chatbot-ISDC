// config.js - Settings for Sunrise Institute Chatbot
const CONFIG = {
  // Your Google Gemini API Key
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",

  // Gemini model to use
  MODEL: "gemini-3.1-flash-lite",

  // WHAT-IF SCENARIO:
  // false = Unrestricted (Sunny answers ANY question: coding, science, general knowledge, etc.)
  // true  = Restricted (Strict: ONLY answers college facts; rejects outside questions)
  RESTRICTED_MODE: true
};
