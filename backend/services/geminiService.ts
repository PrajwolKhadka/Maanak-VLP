import { GoogleGenAI, Type, Schema } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL_NAME = 'gemini-2.5-flash';

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

const quizQuestionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Exactly 4 options, prefixed with A., B., C., D.',
      },
      correctAnswer: {
        type: Type.STRING,
        description: 'Must match the exact string from the options array',
      },
      explanation: { type: Type.STRING },
    },
    required: ['question', 'options', 'correctAnswer', 'explanation'],
  },
};

const quizInsightsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: '2-3 sentence overall performance summary' },
    strongAreas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          detail: { type: Type.STRING },
        },
        required: ['topic', 'detail'],
      },
    },
    weakAreas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          detail: { type: Type.STRING },
        },
        required: ['topic', 'detail'],
      },
    },
    recommendedStudy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['video', 'chapter'] },
          label: { type: Type.STRING },
        },
        required: ['type', 'label'],
      },
    },
  },
  required: ['summary', 'strongAreas', 'weakAreas', 'recommendedStudy'],
};

const lessonSummarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: '2-3 sentence summary of the lesson' },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-5 key points from the lesson',
    },
  },
  required: ['summary', 'keyPoints'],
};

// ── Functions ─────────────────────────────────────────────────────────────────

export const generateQuizQuestions = async (
  transcript: string,
  lessonTitle: string,
  count: number = 10
): Promise<QuizQuestion[]> => {
  const prompt = `
You are a chemistry teacher creating a quiz for Nepal +2 students.
Based on this lesson transcript about "${lessonTitle}", generate exactly ${count} multiple choice questions.
Questions should test conceptual understanding, not just memorization.
`;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: [prompt, `Transcript:\n${transcript}`],
    config: {
      responseMimeType: 'application/json',
      responseSchema: quizQuestionSchema,
    },
  });

  return JSON.parse(response.text!);
};

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
${questions
  .map(
    (q, i) => `
Q${i + 1}: ${q.question}
Student Answer: ${q.userAnswer}
Correct Answer: ${q.correctAnswer}
Result: ${q.isCorrect ? 'Correct' : 'Incorrect'}
`
  )
  .join('')}
`;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: quizInsightsSchema,
    },
  });

  return JSON.parse(response.text!);
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
`;

  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: lessonSummarySchema,
    },
  });

  return JSON.parse(response.text!);
};