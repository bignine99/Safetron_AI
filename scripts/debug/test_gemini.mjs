import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadEnv, getGeminiKey } from '../env_loader.mjs';

loadEnv();
const genAI = new GoogleGenerativeAI(getGeminiKey());

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    console.log("Testing gemini-1.5-flash-latest...");
    const result = await model.generateContent("Say hello");
    console.log(result.response.text());
  } catch (err) {
    console.error("gemini-1.5-flash-latest failed:", err.message);
    try {
      const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("Testing gemini-pro...");
      const result2 = await model2.generateContent("Say hello");
      console.log(result2.response.text());
    } catch (e2) {
      console.error("gemini-pro failed:", e2.message);
    }
  }
}
run();
