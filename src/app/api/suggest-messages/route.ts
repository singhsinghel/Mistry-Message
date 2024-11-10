import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST() {
  try {
    const prompt =
      "Create a list of three open ended and engaging questions formatted as a single string. Each question should be separated by '||', these questions are for an anonymous social messaging platform like Qooh.me and should be suitable for a diverse audience avoid personal or sensitive topics focus in instead on universal themes that in courage friendly interaction for example you are output should be like this what's the hobby you have recently started? '||' if you could have your dinner with your historical figure who did me what's the sample thing that makes you happy insure the questions environmental";

    const result = await streamText({
      model: openai("gpt-3.5-turbo-instruct"),
      maxTokens:12,
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const{name,status,headers,message}=error
      return NextResponse.json({success:false,name,status,headers,message})
    }else{
      console.error("An unexpected error occurred");
      
    }
  }
}
