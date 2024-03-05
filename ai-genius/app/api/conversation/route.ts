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
        const { messages } = body

        if (!userId){
            return new NextResponse("Unauthorized",{status:401});
        }

        if (!openai.apiKey){
            return new NextResponse("Open AI key not configured",{status:500});
        }

        if (!messages){
            return new NextResponse("Message is required",{status:400});
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
            
        });


        return NextResponse.json(response.choices[0].message)
    }catch (error){
        console.log("[CONVERSATION_ERROR]",error);
        return new NextResponse("Internal error",{status:500});
    }
}