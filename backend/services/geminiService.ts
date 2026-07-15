// import { GoogleGenAI, Type, Schema } from '@google/genai';

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
// const MODEL_NAME = 'gemini-2.5-flash';

// export interface QuizQuestion {
//   question: string;
//   options: string[];
//   correctAnswer: string;
//   explanation: string;
// }

// export interface QuizInsights {
//   strongAreas: { topic: string; detail: string }[];
//   weakAreas: { topic: string; detail: string }[];
//   recommendedStudy: { type: 'video' | 'chapter'; label: string }[];
//   summary: string;
// }

// const quizQuestionSchema: Schema = {
//   type: Type.ARRAY,
//   items: {
//     type: Type.OBJECT,
//     properties: {
//       question: { type: Type.STRING },
//       options: {
//         type: Type.ARRAY,
//         items: { type: Type.STRING },
//         description: 'Exactly 4 options, prefixed with A., B., C., D.',
//       },
//       correctAnswer: {
//         type: Type.STRING,
//         description: 'Must match the exact string from the options array',
//       },
//       explanation: { type: Type.STRING },
//     },
//     required: ['question', 'options', 'correctAnswer', 'explanation'],
//   },
// };

// const quizInsightsSchema: Schema = {
//   type: Type.OBJECT,
//   properties: {
//     summary: { type: Type.STRING, description: '2-3 sentence overall performance summary' },
//     strongAreas: {
//       type: Type.ARRAY,
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           topic: { type: Type.STRING },
//           detail: { type: Type.STRING },
//         },
//         required: ['topic', 'detail'],
//       },
//     },
//     weakAreas: {
//       type: Type.ARRAY,
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           topic: { type: Type.STRING },
//           detail: { type: Type.STRING },
//         },
//         required: ['topic', 'detail'],
//       },
//     },
//     recommendedStudy: {
//       type: Type.ARRAY,
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           type: { type: Type.STRING, enum: ['video', 'chapter'] },
//           label: { type: Type.STRING },
//         },
//         required: ['type', 'label'],
//       },
//     },
//   },
//   required: ['summary', 'strongAreas', 'weakAreas', 'recommendedStudy'],
// };

// const lessonSummarySchema: Schema = {
//   type: Type.OBJECT,
//   properties: {
//     summary: { type: Type.STRING, description: '2-3 sentence summary of the lesson' },
//     keyPoints: {
//       type: Type.ARRAY,
//       items: { type: Type.STRING },
//       description: '3-5 key points from the lesson',
//     },
//   },
//   required: ['summary', 'keyPoints'],
// };

// // ── Functions ─────────────────────────────────────────────────────────────────

// export const generateQuizQuestions = async (
//   transcript: string,
//   lessonTitle: string,
//   count: number = 10
// ): Promise<QuizQuestion[]> => {
//   const prompt = `
// You are a chemistry teacher creating a quiz for Nepal +2 students.
// Based on this lesson transcript about "${lessonTitle}", generate exactly ${count} multiple choice questions.
// Questions should test conceptual understanding, not just memorization.
// `;

//   const response = await genAI.models.generateContent({
//     model: MODEL_NAME,
//     contents: [prompt, `Transcript:\n${transcript}`],
//     config: {
//       responseMimeType: 'application/json',
//       responseSchema: quizQuestionSchema,
//     },
//   });

//   return JSON.parse(response.text!);
// };

// export const generateQuizInsights = async (
//   lessonTitle: string,
//   questions: {
//     question: string;
//     userAnswer: string;
//     correctAnswer: string;
//     isCorrect: boolean;
//   }[]
// ): Promise<QuizInsights> => {
//   const prompt = `
// You are an AI tutor analyzing a student's quiz performance on "${lessonTitle}".

// Quiz Results:
// ${questions
//   .map(
//     (q, i) => `
// Q${i + 1}: ${q.question}
// Student Answer: ${q.userAnswer}
// Correct Answer: ${q.correctAnswer}
// Result: ${q.isCorrect ? 'Correct' : 'Incorrect'}
// `
//   )
//   .join('')}
// `;

//   const response = await genAI.models.generateContent({
//     model: MODEL_NAME,
//     contents: prompt,
//     config: {
//       responseMimeType: 'application/json',
//       responseSchema: quizInsightsSchema,
//     },
//   });

//   return JSON.parse(response.text!);
// };

// export const generateLessonSummary = async (
//   transcript: string,
//   lessonTitle: string
// ): Promise<{ summary: string; keyPoints: string[] }> => {
//   const prompt = `
// You are a chemistry teacher summarizing a lesson for Nepal +2 students.
// Summarize this transcript for the lesson "${lessonTitle}" in simple, clear language.

// Transcript:
// ${transcript}
// `;

//   const response = await genAI.models.generateContent({
//     model: MODEL_NAME,
//     contents: prompt,
//     config: {
//       responseMimeType: 'application/json',
//       responseSchema: lessonSummarySchema,
//     },
//   });

//   return JSON.parse(response.text!);
// };
import { GoogleGenAI, Type, Schema } from '@google/genai';
import OpenAI from 'openai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const GEMINI_MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash'];

const OPENROUTER_MODELS_TO_TRY = [
  'gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-1.2b-thinking:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'openrouter/free',
];

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
    summary: { 
      type: Type.STRING, 
      description: 'Detailed 6-10 sentence paragraph covering all major concepts from the transcript' 
    },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '6-10 key points, each a complete informative sentence extracted from the transcript',
    },
  },
  required: ['summary', 'keyPoints'],
};

// ── Shared helpers ───────────────────────────────────────────────────────────

function stripJsonFences(text: string): string {
  return text.replace(/```json|```/g, '').trim();
}

async function tryGeminiJSON<T>(
  prompt: string,
  schema: Schema,
  label: string
): Promise<T | null> {
  for (const modelName of GEMINI_MODELS_TO_TRY) {
    try {
      console.log(`[${label}] Trying Gemini model: ${modelName}`);

      const response = await genAI.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const text = response.text?.trim();
      if (!text) throw new Error(`Gemini model ${modelName} returned empty response`);

      console.log(`[${label}] Success with Gemini model: ${modelName}`);
      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`[${label}] Gemini model ${modelName} failed:`, error);
      continue;
    }
  }
  return null;
}

async function tryOpenRouterJSON<T>(
  prompt: string,
  jsonInstruction: string,
  label: string
): Promise<T | null> {
  const fullPrompt = `${prompt}\n\n${jsonInstruction}\nRespond with ONLY the JSON, no markdown fences, no preamble.`;

  for (const model of OPENROUTER_MODELS_TO_TRY) {
    try {
      console.log(`[${label}] Trying OpenRouter model: ${model}`);

      const response = await openrouter.chat.completions.create({
        model,
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (!text) throw new Error(`OpenRouter model ${model} returned empty response`);

      const parsed = JSON.parse(stripJsonFences(text)) as T;
      console.log(`[${label}] Success with OpenRouter model: ${model}`);
      return parsed;
    } catch (error) {
      console.error(`[${label}] OpenRouter model ${model} failed:`, error);
      continue;
    }
  }
  return null;
}

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

Transcript:
${transcript}
`;

  const geminiResult = await tryGeminiJSON<QuizQuestion[]>(
    prompt,
    quizQuestionSchema,
    'generateQuizQuestions'
  );
  if (geminiResult) return geminiResult;

  console.warn('[generateQuizQuestions] Gemini failed on all models, falling back to OpenRouter...');
  const openrouterResult = await tryOpenRouterJSON<QuizQuestion[]>(
    prompt,
    `Return a JSON array of exactly ${count} objects, each with keys: "question" (string), "options" (array of exactly 4 strings prefixed with A., B., C., D.), "correctAnswer" (string, must exactly match one of the options), "explanation" (string).`,
    'generateQuizQuestions'
  );
  if (openrouterResult) return openrouterResult;

  throw new Error('Server error! Try again');
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

  const geminiResult = await tryGeminiJSON<QuizInsights>(
    prompt,
    quizInsightsSchema,
    'generateQuizInsights'
  );
  if (geminiResult) return geminiResult;

  console.warn('[generateQuizInsights] Gemini failed on all models, falling back to OpenRouter...');
  const openrouterResult = await tryOpenRouterJSON<QuizInsights>(
    prompt,
    `Return a JSON object with keys: "summary" (string, 2-3 sentences), "strongAreas" (array of {topic, detail}), "weakAreas" (array of {topic, detail}), "recommendedStudy" (array of {type: "video"|"chapter", label}).`,
    'generateQuizInsights'
  );
  if (openrouterResult) return openrouterResult;

  throw new Error('Server error! Try again');
};

export const generateLessonSummary = async (
  transcript: string,
  lessonTitle: string
): Promise<{ summary: string; keyPoints: string[] }> => {
  const prompt = `You are an expert chemistry teacher creating a detailed study guide for Nepal +2 students.

You are given the full transcript of a video lesson titled "${lessonTitle}".

Your job is to generate:
1. A DETAILED SUMMARY (6-10 sentences) that covers all the major concepts, examples, and explanations from the transcript. Do not skip any important topic. Write it as a flowing paragraph that a student can use to understand the entire lesson without watching the video.
2. KEY POINTS (6-10 bullet points) — specific facts, rules, definitions, and examples mentioned in the transcript. Each point should be a complete, informative sentence.

IMPORTANT:
- Base everything STRICTLY on the transcript content below
- Do not add information not present in the transcript
- Use simple language suitable for +2 level students
- Include specific examples, reactions, and numbers mentioned in the transcript

Transcript:
${transcript}`;

  const geminiResult = await tryGeminiJSON<{ summary: string; keyPoints: string[] }>(
    prompt,
    lessonSummarySchema,
    'generateLessonSummary'
  );
  if (geminiResult) return geminiResult;

  console.warn('[generateLessonSummary] Gemini failed, falling back to OpenRouter...');
  const openrouterResult = await tryOpenRouterJSON<{ summary: string; keyPoints: string[] }>(
    prompt,
    `Return a JSON object with keys: 
"summary" (string — detailed 6-10 sentence paragraph covering all major concepts from the transcript), 
"keyPoints" (array of 6-10 strings — each a complete informative sentence about a specific fact, rule, or example from the transcript).`,
    'generateLessonSummary'
  );
  if (openrouterResult) return openrouterResult;

  throw new Error('Server error! Try again');
};