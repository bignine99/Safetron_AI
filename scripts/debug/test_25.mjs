import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadEnv, getGeminiKey } from '../env_loader.mjs';

loadEnv();
const genAI = new GoogleGenerativeAI(getGeminiKey());

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("hello");
    console.log("gemini-2.5-flash OK:", result.response.text());
  } catch(e) {
    console.error("gemini-2.5-flash ERROR:", e.message);
  }
}
run();
