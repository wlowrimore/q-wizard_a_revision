"use client";

import { IDBPCursorWithValue, openDB } from "idb";
import { createContext, useContext, useState, useEffect } from "react";
import { UserData } from "../dataModels";
import { UserContext } from "./UserContext";

export interface QuizData {
  stars: string | null;
  id: number;
  quizId: string;
  quizTitle: string;
  selectedCategories: string[];
  selectedTimeLimit: string;
  selectedNumOfQuestions: string;
  createdBy: string;
  quizzes: QuizData[];
  userId: string;
  dispatch: React.Dispatch<{
    type: string;
    quizData: QuizData;
    userId: string; // Add the userId property here
  }>;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  userQuiz: {
    id: number;
    quizId: string;
    quizTitle: string;
    selectedCategories: string[];
    selectedTimeLimit: string;
    selectedNumOfQuestions: string;
    createdBy: string;
    userId: string;
    stars: string | null;
  };
}

export interface QuizContextValue {
  quizData: QuizData;
  dispatch: React.Dispatch<{
    type: string;
    quizData: QuizData;
    userId: string; // Add the userId property here
  }>;
  userId: string;
  quizzes: QuizData[];
}

interface QuizContextProps {
  children: React.ReactNode;
}

export const QuizContext = createContext<QuizContextValue>({
  quizData: {
    quizId: "",
    quizTitle: "",
    selectedCategories: [],
    selectedTimeLimit: "",
    selectedNumOfQuestions: "",
    createdBy: "",
    quizzes: [],
    userId: "",
    id: 0,
    userQuiz: {
      id: 0,
      quizId: "",
      quizTitle: "",
      selectedCategories: [],
      selectedTimeLimit: "",
      selectedNumOfQuestions: "",
      createdBy: "",
      userId: "",
      stars: "",
    },
    dispatch: function (value: {
      type: string;
      quizData: QuizData;
      userId: string;
    }): void {
      throw new Error("Function not implemented.");
    },
    user: {
      id: "",
      name: undefined,
      email: undefined,
      image: undefined,
    },
    stars: "",
  },
  dispatch: function (value: {
    type: string;
    quizData: QuizData;
    userId: string; // Add the userId property here
  }): void {
    throw new Error("Function not implemented.");
  },
  userId: "",
  quizzes: [],
});

const addQuizToIndexedDB = async (quizData: QuizData) => {
  const db = await openDB("q-wizardDB", 1);
  const transaction = db.transaction("quizzes", "readwrite");
  const objectStore = transaction.objectStore("quizzes");
  await objectStore.add(quizData);
};

const removeQuizFromIndexedDB = async (quizId: string) => {
  const db = await openDB("q-wizardDB", 1);
  const transaction = db.transaction("quizzes", "readwrite");
  const objectStore = transaction.objectStore("quizzes");
  await objectStore.delete(quizId);
};

export const QuizProvider: React.FC<QuizContextProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  // const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [quizData, setQuizData] = useState<QuizData>({
    quizId: "",
    quizTitle: "",
    selectedCategories: [],
    selectedTimeLimit: "",
    selectedNumOfQuestions: "",
    createdBy: "",
    quizzes: [],
    userId: "",
    id: 0,
    userQuiz: {
      id: 0,
      quizId: "",
      quizTitle: "",
      selectedCategories: [],
      selectedTimeLimit: "",
      selectedNumOfQuestions: "",
      createdBy: "",
      userId: "",
      stars: "",
    },
    stars: "",
    dispatch: function (): void {
      throw new Error("Function not implemented.");
    },
    user: {
      id: "",
      name: undefined,
      email: undefined,
      image: undefined,
    },
  });

  const dispatch = async (value: {
    type: string;
    quizData: QuizData;
    userId: string;
  }) => {
    const { type, userId, quizData } = value;
    const db = await openDB("q-wizardDB", 1);
    try {
      const transaction = db.transaction("quizzes", "readwrite");
      const objectStore = transaction.objectStore("quizzes");
      if (quizData.quizId) {
        await objectStore.put({ ...quizData, userId });
      } else {
        await objectStore.add({ ...quizData, userId });
      }

      try {
        const quizzes = await objectStore.getAll();
        console.log("Quizzes before state update:", quizzes);
        setQuizData((prevQuizData) => ({
          ...prevQuizData,
          quizzes: updatedQuizzes,
        }));
        // setQuizData((prevQuizData) => {
        //   return {
        //     ...prevQuizData,
        //     quizzes: quizzes,
        //   };
        // });
        const updatedQuizzes = await objectStore.getAll();
        console.log("Quizzes after state update:", updatedQuizzes);
      } catch (error) {
        console.log("Error fetching quizzes:", error);
      }

      const updatedQuizzes = await objectStore.getAll();
      updatedQuizzes.forEach((quiz: QuizData) => {
        if (quiz.userId === userId) {
          quiz = { ...quiz, ...quizData };
        }
      });

      await objectStore.clear();
      await objectStore.add(updatedQuizzes);
      await objectStore.delete(quizData.quizId);
      setQuizData((prevQuizData) => ({
        ...prevQuizData,
        quizzes: updatedQuizzes,
      }));
      transaction.oncomplete = () => console.log("Quiz updated successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (user) {
        const db = await openDB("q-wizardDB", 1);
        const transaction = db.transaction("quizzes", "readonly");
        const objectStore = transaction.objectStore("quizzes");

        const request = await objectStore.openCursor();
        if (!request) {
          console.error("Failed to create cursor request!");
          return [];
        }
        const quizzes: QuizData[] = [];
        for await (const cursor of request) {
          if (cursor) {
            if (cursor.value.user === user?.id) {
              quizzes.push(cursor.value);
            }
          } else {
            break;
          }

          return quizzes;
        }

        setQuizData((prevQuizData) => ({
          ...prevQuizData,
          quizzes,
        }));
      }
    };

    fetchQuizzes();
  }, [user]); // Update effect only when user changes

  return (
    <QuizContext.Provider
      value={{
        quizData,
        dispatch,
        userId: user?.id || "",
        quizzes: quizData.quizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
