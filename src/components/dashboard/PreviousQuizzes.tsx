"use client";

import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { QuizContext, QuizData } from "../../contexts/QuizContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getFirstName } from "../../helpers";
const PreviousQuizzes: React.FC = () => {
  const { data: session } = useSession();
  const { quizzes } = useContext(QuizContext);

  const firstName = getFirstName();

  return (
    <div className="flex flex-col bg-blue-100 border border-neutral-500 w-fit p-6 rounded-lg">
      <h2 className="text-neutral-950 font-semibold text-2xl mb-4">
        {session?.user?.name}&apos;s Stats
      </h2>
      <div className="flex gap-4">
        <div>
          <Image
            src={session?.user?.image as string}
            alt={session?.user?.name as string}
            width={500}
            height={500}
            className="border-4 border-yellow-400 rounded-full w-40 h-40 my-3"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="text-2xl text-neutral-800 font-bold">Average Score</h2>
          <p className="text-5xl py-2 px-4 bg-yellow-200 border-2 border-neutral-800 rounded-2xl text-neutral-600 font-normal">
            89<span className="text-4xl">%</span>
          </p>
          <p className="text-xl text-neutral-700 font-bold">
            Quizzes Completed:&nbsp;
            <span className="text-xl px-2 border border-white bg-white rounded-full">
              {quizzes.length}
            </span>
          </p>
        </div>
      </div>
      <hr className="w-full h-[0.3%] mt-6 bg-black"></hr>
      <div className="border-2 border-neutral-950 rounded-xl p-4 my-10 bg-gray-800/60">
        <p className="text-white tracking-wide text-2xl font-semibold">
          Previous Quizzes
        </p>
        <div className="flex flex-wrap gap-x-2 my-2">
          {quizzes.map((quiz: QuizData, index: number) => (
            <div
              key={index}
              className="mt-2 bg-white/70 py-2 px-3 border border-neutral-950 rounded-lg"
            >
              <p className="text-neutral-950 font-semibold">{quiz.quizTitle}</p>
              {/* {quiz.selectedCategories.map((category: string, index) => (
                <div key={index} className="flex items-center gap-2">
                  <p className="text-neutral-600">{category}</p>
                </div>
              ))} */}
              {/* <p className="text-neutral-600">{quiz.selectedNumOfQuestions}</p>
              <p className="text-neutral-600">{quiz.selectedTimeLimit}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousQuizzes;
