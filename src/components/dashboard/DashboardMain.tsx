"use client";

import React from "react";
import { getFirstName } from "../../helpers";
import CreateNewQuiz from "./CreateNewQuiz";

const DashboardMain: React.FC = () => {
  const firstName = getFirstName();
  return (
    <div className="my-10 flex flex-col w-full space-y-6">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-semibold">{firstName}&apos;s Dashboard</h1>
        <p className="text-orange-700">&#40;High Score Here&#41;</p>
      </div>
      <div className="font-light text-blue-600 text-xl">
        <h1>&#40;Previous Quizzes Container&#41;</h1>
      </div>
      <div>
        <CreateNewQuiz />
      </div>
    </div>
  );
};

export default DashboardMain;
