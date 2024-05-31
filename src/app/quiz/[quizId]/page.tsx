"use client";
import QuizContainer from "@/components/dashboard/QuizContainer";
import { openDB } from "idb";
import { useParams } from "next/navigation";
import React from "react";

const Quiz = () => {
  const { quizId } = useParams();
  const singleQuizId = Array.isArray(quizId) ? quizId[0] : quizId;
  return (
    <main className="w-screen min-h-screen flex flex-col justify-center items-center p-12">
      <QuizContainer quizId={singleQuizId} />
    </main>
  );
};

export default Quiz;
