import QuizContainer from "@/components/dashboard/QuizContainer";
import React from "react";

const Quiz = () => {
  return (
    <main className="w-screen min-h-screen flex flex-col justify-center items-center p-12">
      <h1 className="text-4xl font-bold">Quiz Page</h1>
      <QuizContainer />
    </main>
  );
};

export default Quiz;
