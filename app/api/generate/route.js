import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const systemPrompt = `
You are a flashcard creator. Your task is to create a set of flashcards to help the user prepare for an interview. Each flashcard should have a clear question or prompt on the front, and a concise, accurate answer on the back. Use the user's background details to generate interview questions and help structure the answers based on their experience.

Guidelines:

Question/Prompt Format:

- Ask questions that are commonly asked in interviews.
- Tailor questions to the user's experience, skills, and the job role they are targeting.
- For behavior-based questions, use "Describe a time when..." or "How did you handle...?"
- For technical questions, use "Explain how you would..." or "What is your experience with...?"

Answer Format:

- Provide a concise, direct response based on the user's background.
- Highlight the user's achievements, skills, and relevant experience.
- Structure answers using the STAR method (Situation, Task, Action, Result) for behavioral questions.

Subject Coverage:

- Ensure the questions cover key areas relevant to the user's background and the job role.
- Include questions that explore the user's technical skills, problem-solving abilities, and cultural fit.

Flashcard Set Requirements:

- Generate 10 personalized flashcards.
- Balance between behavioral, technical, and situational questions.

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`;

export async function POST(req) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    //const { backgroundDetails } = await req.json(); // Only background details needed
    const backgroundDetails = `RAG Powered Website Chatbot Jul 2024 - Aug 2024
            Implemented RAG with Llama 3 via Groq API by using Pinecone to store embeddings of a knowledge document fed into a sentence transformer model,
            reducing hallucinations by 75%.
            Architected specific and clear prompts to further reduce hallucinations by 25%, extracting knowledge mainly from Pinecone to answer user queries.
            Deployed and scaled chatbot onto AWS EC2 server to server the needs of a thousand customers for a rising start up`
    const userPrompt = `
    Here is the user's background information: ${backgroundDetails}
    
    Now, generate flashcards based on this background.
    `;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: 'user',
                content: userPrompt
            },
        ],
        model: "llama3-8b-8192",
        response_format: { type: 'json_object' },
    });

    const flashcards = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(flashcards.flashcards);
}
