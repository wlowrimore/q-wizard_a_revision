"use client";

import { createContext, useEffect, useReducer, useState } from "react";
import {
  useSession,
  signIn as signInNextAuth,
  signOut as signOutNextAuth,
  signIn,
  signOut,
} from "next-auth/react";
import { QuizData } from "./QuizContext";
import React, { Dispatch } from "react";

const initialState = {
  user: null,
  signIn: signInNextAuth,
  signOut: signOutNextAuth,
  dispatch: () => {},
};

const reducer = (state: UserContextValue, action: UserContextAction) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        user: action.payload,
      };
    case "SIGN_OUT":
      return {
        ...state,
        user: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    // Quiz Management Cases

    case "ADD_QUIZ":
      if (action.quizData) {
        const validatedQuizData = action.quizData as QuizData;
        return {
          ...state,
          user: {
            ...state.user,
            quizzes: [...(state.user?.quizzes || []), validatedQuizData],
          },
        };
      }
      return state;
    case "REMOVE_QUIZ":
      if (action.id) {
        return {
          ...state,
          user: {
            ...state.user,
            quizzes: state.user?.quizzes?.filter(
              (quiz) => quiz.quizId !== action.id
            ),
          },
        };
      }
      return state;
    default:
      return state;
  }
};

export interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  quizzes?: QuizData[];
  userId?: string;
  quizSettings?: {
    selectedCategory?: string;
    selectedTimeLimit?: string;
    selectedNumOfQuestions?: string;
  };
}

export interface UserContextValue {
  user: User | null;
  signIn: typeof signInNextAuth;
  signOut: typeof signOutNextAuth;
  dispatch: Dispatch<UserContextAction>;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  signIn: signInNextAuth,
  signOut: signOutNextAuth,
  dispatch: () => {},
});

export interface UserContextProps {
  children: React.ReactNode;
}

export interface UserContextAction {
  id: any;
  type: string;
  quizData?: QuizData;
  userId?: string;
  payload?: any;
}

export interface UserContextType {
  user: User | null;
  dispatch: React.Dispatch<{
    type: string;
    quizzes: QuizData;
    userId: string;
    payload: any;
    id: string;
    quizSettings: {
      selectedCategory: string;
      selectedTimeLimit: string;
      selectedNumOfQuestions: string;
    };
  }>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id ?? "",
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      });
    }
  }, [session?.user]);
  console.log("USER in UserProvider", user);

  return (
    <UserContext.Provider
      value={{
        user,
        signIn,
        signOut,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
function addQuizToIndexedDB(quizData: QuizData) {
  throw new Error("Function not implemented.");
}

function removeQuizFromIndexedDB(id: any) {
  throw new Error("Function not implemented.");
}
