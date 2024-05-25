"use client";

import { createContext, useContext, useState } from "react";

export interface QuizContextValue extends QuizData {
  updateQuizData: (updateQuizData: Partial<QuizData>) => void;
}

export const QuizContext = createContext<QuizContextValue>({
  updateQuizData: () => {},
  createdBy: "",
  quizTitle: "",
  selectedCategories: [],
  selectedTimeLimit: "",
  selectedNumOfQuestions: "",
});

export interface QuizData {
  createdBy: string;
  quizTitle: string;
  selectedCategories: string[];
  selectedTimeLimit: string;
  selectedNumOfQuestions: string;
  updateQuizData: (updatedData: Partial<QuizData>) => void;
}

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quizData, setQuizData] = useState<QuizData>({
    createdBy: "", // Initialize with an empty string
    quizTitle: "",
    selectedCategories: [],
    selectedTimeLimit: "",
    selectedNumOfQuestions: "",
    updateQuizData: () => {},
  });

  const updateQuizData = (updateQuizData: Partial<QuizData>) => {
    setQuizData((prevData) => ({
      ...prevData,
      ...updateQuizData,
    }));
  };

  const value: QuizContextValue = {
    ...quizData,
    updateQuizData,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
