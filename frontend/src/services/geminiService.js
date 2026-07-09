import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Gemini API Key not found.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/**
 * General AI Chat
 */
export async function askGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.error("Gemini Error:", err);

    return "❌ Unable to generate AI response.";
  }
}

/**
 * Summarize uploaded PDF/DOCX
 */
export async function summarizeDocument(text) {
  try {
    const prompt = `
You are an Industrial Knowledge Assistant.

Summarize the following company document.

Return in this format:

## Purpose
(Explain the purpose)

## Main Procedures
- Point 1
- Point 2
- Point 3

## Safety Precautions
- Point 1
- Point 2

## Important Notes
- Point 1
- Point 2

Document:

${text}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.error("Summary Error:", err);

    return "❌ Unable to summarize this document.";
  }
}

/**
 * Explain industrial keywords
 */
export async function explainKeyword(keyword) {
  try {
    const prompt = `
You are KnowForge AI.

Explain the following industrial keyword in simple language.

Keyword:
${keyword}

Return:
- Definition
- Uses
- Advantages
- Safety Tips (if applicable)
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.error("Explain Error:", err);

    return "❌ Unable to explain this topic.";
  }
}

/**
 * Answer questions using uploaded document text only
 */
export async function askDocument(documentText, question) {
  try {
    const prompt = `
You are KnowForge AI.

Answer ONLY using the following company document.

If the answer is not present, reply exactly:

Information not found in this document.

Document:

${documentText}

Employee Question:

${question}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.error("Document QA Error:", err);

    return "❌ Unable to answer from this document.";
  }
}