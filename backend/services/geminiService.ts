import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizInsights {
  strongAreas: { topic: string; detail: string }[];
  weakAreas: { topic: string; detail: string }[];
  recommendedStudy: { type: 'video' | 'chapter'; label: string }[];
  summary: string;
}

// Generate quiz questions from lesson transcript
export const generateQuizQuestions = async (
  transcript: string,
  lessonTitle: string,
  count: number = 10
): Promise<QuizQuestion[]> => {
  const prompt = `
You are a chemistry teacher creating a quiz for Nepal +2 students.
Based on this lesson transcript about "${lessonTitle}", generate exactly ${count} multiple choice questions.

Transcript:
${transcript}

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer
- Include a short explanation for the correct answer
- Questions should test conceptual understanding, not just memorization

Respond ONLY with a valid JSON array, no markdown, no extra text:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A. ...",
    "explanation": "..."
  }
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

// Yeta bata quiz ko summary AI le dinxa! 
export const generateQuizInsights = async (
  lessonTitle: string,
  questions: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[]
): Promise<QuizInsights> => {
  const prompt = `
You are an AI tutor analyzing a student's quiz performance on "${lessonTitle}".

Quiz Results:
${questions.map((q, i) => `
Q${i + 1}: ${q.question}
Student Answer: ${q.userAnswer}
Correct Answer: ${q.correctAnswer}
Result: ${q.isCorrect ? 'Correct' : 'Incorrect'}
`).join('')}

Based on this, generate performance insights.

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "summary": "2-3 sentence overall performance summary",
  "strongAreas": [
    { "topic": "topic name", "detail": "why they did well" }
  ],
  "weakAreas": [
    { "topic": "topic name", "detail": "what needs improvement" }
  ],
  "recommendedStudy": [
    { "type": "video", "label": "suggested video or chapter title" }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

export const generateLessonSummary = async (
  transcript: string,
  lessonTitle: string
): Promise<{ summary: string; keyPoints: string[] }> => {
  const prompt = `
You are a chemistry teacher summarizing a lesson for Nepal +2 students.
Summarize this transcript for the lesson "${lessonTitle}" in simple, clear language.

Transcript:
${transcript}

Respond ONLY with valid JSON, no markdown:
{
  "summary": "2-3 sentence summary of the lesson",
  "keyPoints": ["key point 1", "key point 2", "key point 3"]
}
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};