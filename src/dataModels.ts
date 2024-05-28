export interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface QuestionData {
  id: string;
  category: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  correct: boolean;
}

export interface QuizData {
  quizId: string;
  quizTitle: string;
  selectedCategories: string[];
  selectedTimeLimit: string;
  selectedNumOfQuestions: string;
  createdBy: string;
  questions: QuestionData[];
  userId: string;
}
