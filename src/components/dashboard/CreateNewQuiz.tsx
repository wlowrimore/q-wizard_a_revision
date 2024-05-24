"use client";

import { useState, useEffect, useContext } from "react";
import { Category, NumOfQuestions, TimeLimit } from "../../interfaces";
import {
  getCategories,
  getNumberOfQuestions,
  getTimeLimit,
} from "@/fetch-json-data";

const CreateNewQuiz: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  const [numOfQuestions, setNumOfQuestions] = useState<NumOfQuestions[]>([]);
  useEffect(() => {
    getNumberOfQuestions().then((numOfQuestions) => {
      setNumOfQuestions(numOfQuestions);
    });
  }, []);

  const [timeLimit, setTimeLimit] = useState<TimeLimit[]>([]);
  useEffect(() => {
    getTimeLimit().then((timeLimit) => {
      setTimeLimit(timeLimit);
    });
  }, []);

  console.log("categories", categories);
  return (
    <div className="flex flex-col border border-neutral-500 w-fit p-6 rounded-lg">
      <h2 className="text-neutral-950 font-semibold text-2xl mb-4">
        Create a New Quiz
      </h2>
      <form className="flex flex-col">
        <label
          htmlFor="title"
          id="title"
          className="text-xl font-semibold mb-2"
        >
          1. Give it a Title
        </label>
        <input
          type="text"
          name="quizTitle"
          className="w-[24rem] bg-neutral-200 border border-neutral-700 outline-none p-2 rounded-lg mb-8"
        />
        <p className="text-xl font-semibold mb-2">
          2. Select up to 3 Categories
        </p>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {categories &&
            categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="category"
                  value={category.name}
                  id={category.name}
                  // onChange={handleCategorySelection}
                  // checked={
                  //   selectedCategories.some((c) => c.id === category.id) ||
                  //   false
                  // }
                  className="cursor-pointer w-4 hover:shadow-[0_0_0.8rem_0_rgba(0,0,0,1)] hover:shadow-blue-400 transition duration-200"
                />
                <label
                  htmlFor={category.name}
                  className="text-neutral-800/80 font-semibold"
                >
                  {category.name}
                </label>
              </div>
            ))}
        </div>

        <p className="text-xl font-semibold mb-2">
          3. Select Number of Questions
        </p>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {numOfQuestions &&
            numOfQuestions.map((numOfQuestion) => (
              <div key={numOfQuestion.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="numOfQuestions"
                  value={numOfQuestion.name}
                  id={numOfQuestion.name}
                  className="cursor-pointer w-4 hover:shadow-[0_0_0.8rem_0_rgba(0,0,0,1)] hover:shadow-blue-400 transition duration-200"
                />
                <label
                  htmlFor={numOfQuestion.name}
                  className="text-neutral-800/80 font-semibold"
                >
                  {numOfQuestion.name}
                </label>
              </div>
            ))}
        </div>
        <p className="text-xl font-semibold mb-2">4. Select Time Limit</p>
        {timeLimit && (
          <div className="grid grid-cols-2 gap-2 mb-8">
            {timeLimit.map((time) => (
              <div key={time.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="timeLimit"
                  value={time.name}
                  id={time.name}
                  className="cursor-pointer w-4 hover:shadow-[0_0_0.8rem_0_rgba(0,0,0,1)] hover:shadow-blue-400 transition duration-200"
                />
                <label
                  htmlFor={time.name}
                  className="text-neutral-800/80 font-semibold"
                >
                  {time.label}
                  <br />
                  worth &nbsp;{time.stars}
                </label>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateNewQuiz;
