import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from '../../../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const systemPrompt = `
Ceate flashcards to help the user prepare for interviews. 
Each flashcard should have a clear generic behavioral interview question, and a concise, accurate answer on the back based on the user's given background ONLY and nothing else. 
Use the user's background ONLY to structure the answers.


- Tailor questions to the user's experience, skills, and the job role they are targeting.
- For behavior-based questions, use "Describe a time when..." or "How did you handle...?"
- For technical questions, use "Explain how you would..." or "What is your experience with...?"
- Structure answers using the STAR method (Situation, Task, Action, Result) for behavioral questions.
- Ensure questions are relevant to the user's background.
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
        
        console.log('req');
        console.log(req);
        if (!userId) {
            return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
        }

        // Fetch user profile data from Firestore
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userSnap.data();
        const { experiences, education, careerGoals, skills, additionalInfo } = userData;
        console.log(userData)

        // Extract experiences
        const experienceDetails = experiences.map(exp => `
            Position: ${exp.Position}
            Company: ${exp.Company}
            Description: ${exp.Description}
            Start Date: ${exp['Start Date']}
            Currently Working: ${exp.currentlyWorking ? 'Yes' : 'No'}
            Skills: ${exp.Skills}
            Personal Experience: ${exp['Personal Experience']}
        `).join('\n');

        // Extract skills
        const skillDetails = `
            Top Skills: ${skills.topSkills}
            Strengths and Areas of Improvement: ${skills.strengthsAndAreas}
        `;

        // Extract education
        const educationDetails = `
            Highest Education: ${education.highestEducation}
            Certifications: ${education.certifications}
        `;

        // Extract career goals
        const careerGoalDetails = `
            Goals: ${careerGoals.goals}
            Vision in 5 Years: ${careerGoals.visionIn5Years}
        `;

        // Extract additional info
        const additionalInfoDetails = `
            Additional Info: ${additionalInfo.otherInfo}
        `;

        const experiencesStr = typeof experiences === 'string' ? experiences : JSON.stringify(experiences);
        const educationStr = typeof education === 'string' ? education : JSON.stringify(education);
        const careerGoalsStr = typeof careerGoals === 'string' ? careerGoals : JSON.stringify(careerGoals);
        const skillsStr = typeof skills === 'string' ? skills : JSON.stringify(skills);
        const additionalInfoStr = typeof additionalInfo === 'string' ? additionalInfo : JSON.stringify(additionalInfo);


        // Construct the background details
        const backgroundDetails = `
            Experiences: ${experiencesStr}. 
            Education: Highest Education: ${educationStr}. 
            Career Goals: Goals: ${careerGoalsStr}. 
            Skills: Top Skills: ${skillsStr}. 
            Additional Info: ${additionalInfoStr}.
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