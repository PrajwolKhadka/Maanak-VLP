export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  streak: number;
  contact?: string;
  gender?: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface TopicCategory {
  category: string;
  subjects: Topic[];
}

export interface Chapter {
  _id: string;
  name: string;
  description?: string;
  topicId: string;
  order: number;
}

export interface Lesson {
  _id: string;
  title: string;
  youtubeUrl: string;
  transcript?: string;
  chapter: string;
  topicId: string;
  order: number;
  duration?: string;
}

export interface Note {
  _id: string;
  content: string;
  type: 'personal' | 'class' | 'review';
  lessonId?: string;
  topicId?: string;
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  questions: {
    question: string;
    options: string[];
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  aiInsights: {
    summary: string;
    strongAreas: { topic: string; detail: string }[];
    weakAreas: { topic: string; detail: string }[];
    recommendedStudy: { type: string; label: string }[];
  };
  attemptId: string;
}

export interface DashboardData {
  stats: {
    totalQuizzes: number;
    topicsFinished: number;
    avgScore: number;
    accuracy: number;
  };
  continueItems: {
    topicId: string;
    chapterId: string;
    chapterName: string;
    lessonId: string;
    lessonTitle: string;
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  }[];
  exploreTopics: Topic[];
  streak: number;
}