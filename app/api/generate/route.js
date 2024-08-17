import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from '../../../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

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

    try {
        const { userId } = await req.json();
        
        console.log('req')
        console.log(req)
        if (!userId) {
            return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
        }

        // Fetch user profile data from Firestore
        const userRef = doc(db, 'users', userId); // Adjust the collection and document path as necessary
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userSnap.data();

        const { experiences, education, careerGoals, skills, additionalInfo } = userData;

        // Construct the background details
        const backgroundDetails = `
            Experiences: ${experiences}
            Education: Highest Education: ${education}, 
            Career Goals: Goals: ${careerGoals}
            Skills: Top Skills: ${skills},
            Additional Info: ${additionalInfo}
        `;

        const userPrompt = `
            Here is the user's background information: ${backgroundDetails}
            
            Now, generate flashcards based on this background.
        `;

        // Call the Groq API for generating flashcards
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' },
        });

        // Extract flashcards from the completion response
        console.log('lets see')
        console.log(completion.choices[0].message.content)
        const flashcards = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json(flashcards.flashcards);

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}