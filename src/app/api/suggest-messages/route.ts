import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API key is missing");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      "Create a list of three open ended and engaging questions formatted as a single string. Each question should be separated by '||', these questions are for an anonymous social messaging platform like Qooh.me and should be suitable for a diverse audience avoid personal or sensitive topics focus in instead on universal themes that in courage friendly interaction for example you are output should be like this what's the hobby you have recently started? '||' if you could have your dinner with your historical figure who did me what's the sample thing that makes you happy insure the questions environmental";

    const result = await model.generateContent(prompt);
    const sendResult = result.response.text();
    return Response.json({sendResult});
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
