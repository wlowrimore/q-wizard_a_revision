"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  QuizData,
  Category,
  NumOfQuestions,
  TimeLimit,
} from "../../interfaces";
import { QuizContext, QuizContextValue } from "../../contexts/QuizContext";
import {
  getCategories,
  getNumberOfQuestions,
  getTimeLimit,
} from "@/fetch-json-data";

const CreateNewQuiz: React.FC = () => {
  const { user } = useContext(UserContext);
  const contextValue: QuizContextValue = useContext(QuizContext);
  const formRef = useRef<HTMLFormElement>(null);

  const [quizData, setQuizData] = useState<QuizData>({
    quizTitle: "",
    selectedCategories: [],
    selectedTimeLimit: "",
    selectedNumOfQuestions: "",
  });

  // -------------------------------------------
  // FETCHED JSON DATA FOR UI FORM OPTIONS
  // -------------------------------------------

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

  // -------------------------------------------
  // FORM HANDLERS
  // -------------------------------------------

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setQuizData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (categoryName: string) => {
    const isSelected = quizData.selectedCategories.includes(categoryName);

    if (quizData.selectedCategories.length < 3 || isSelected) {
      setQuizData((prevData) => ({
        ...prevData,
        selectedCategories: isSelected
          ? prevData.selectedCategories.filter(
              (category) => category !== categoryName
            )
          : [...prevData.selectedCategories, categoryName],
      }));
    }
  };

  const handleTimeLimitChange = (value: string) => {
    setQuizData((prevData) => ({ ...prevData, selectedTimeLimit: value }));
  };

  const handleNumOfQuestionsChange = (value: string) => {
    setQuizData((prevData) => ({ ...prevData, selectedNumOfQuestions: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && user.name) {
      const quizToSave = { user: user.name, ...quizData };

      const existingQuizzes = JSON.parse(
        localStorage.getItem("quizzes") || "[]"
      );

      existingQuizzes.push(quizToSave);
      localStorage.setItem("quizzes", JSON.stringify(existingQuizzes));

      formRef.current?.reset();
    } else {
      localStorage.removeItem("quizzes");
      alert("Please sign in to create a new quiz.");
    }
  };

  // -------------------------------------------
  // RENDER UI
  // -------------------------------------------

  return (
    <div className="flex flex-col bg-blue-100 border border-neutral-500 w-fit p-6 rounded-lg">
      <h2 className="text-neutral-950 font-semibold text-2xl mb-4">
        Create a New Quiz
      </h2>
      <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col">
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
          onChange={handleInputChange}
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
                  id={category.name}
                  value={category.name}
                  onChange={() => handleCategoryChange(category.name)}
                  checked={quizData.selectedCategories.includes(category.name)}
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
                  id={numOfQuestion.name}
                  value={numOfQuestion.name}
                  onChange={() =>
                    handleNumOfQuestionsChange(numOfQuestion.name)
                  }
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
                  id={time.name}
                  value={time.name}
                  onChange={() => handleTimeLimitChange(time.name)}
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
        <button
          type="submit"
          className="bg-neutral-800 text-white font-semibold p-2 rounded-lg hover:bg-white hover:text-neutral-800 transition duration-300"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateNewQuiz;
