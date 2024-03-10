import  OpenAI   from "openai";
import { NextResponse } from "next/server";
import  Replicate  from "replicate";


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

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
})

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

        if (!prompt){
            return new NextResponse("Message is required",{status:400});
        }

        const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
        {
            input: {
                prompt_a: prompt,
              }
            
        });


        return NextResponse.json(response)
    }catch (error){
        console.log("[MUSIC_ERROR]",error);
        return new NextResponse("Internal error",{status:500});
    }
}