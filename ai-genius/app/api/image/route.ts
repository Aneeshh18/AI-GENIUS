import  OpenAI   from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";


const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });

  async function main() {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo',
    });
  }
  
  main();

export async function POST(
    req:Request
){
    try{
        const {userId} = auth()
        const body = await req.json();
        const { prompt,amount = 1, resolution = "512x512" } = body

        if (!userId){
            return new NextResponse("Unauthorized",{status:401});
        }

        if (!openai.apiKey){
            return new NextResponse("Open AI key not configured",{status:500});
        }

        if (!prompt){
            return new NextResponse("Prompt is required",{status:400});
        }

        if (!amount){
            return new NextResponse("Amount is required",{status:400});
        }

        if (!resolution){
            return new NextResponse("Resolution is required",{status:400});
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
            
        });


        return NextResponse.json(response.data)
    }catch (error){
        console.log("[CONVERSATION_ERROR]",error);
        return new NextResponse("Internal error",{status:500});
    }
}