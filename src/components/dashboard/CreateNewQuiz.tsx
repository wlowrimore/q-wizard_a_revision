"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Category, NumOfQuestions, TimeLimit } from "../../interfaces";
import { useSession } from "next-auth/react";
import {
  QuizContext,
  QuizContextValue,
  QuizData,
} from "../../contexts/QuizContext";
import {
  getCategories,
  getNumberOfQuestions,
  getTimeLimit,
} from "@/fetch-json-data";

const CreateNewQuiz: React.FC = (): React.ReactNode => {
  const [quizData, setQuizData] = useState<QuizData>({
    quizTitle: "",
    selectedCategories: [],
    selectedTimeLimit: "",
    selectedNumOfQuestions: "",
    createdBy: "",
    quizzes: [],
    userId: "",
    quizId: "",
  });
  const [successMsg, setSuccessMsg] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();

  const { dispatch } = useContext(UserContext);

  const user = {
    id: session?.user.id,
    quizSettings: {
      selectedCategory: "",
      selectedTimeLimit: "",
      selectedNumOfQuestions: "",
    },
  };

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

    formRef.current?.reset();

    if (user && user.id) {
      const quizToSave = { user: user.id, ...quizData };
      console.log("Quiz to save:", quizToSave);
      const request = indexedDB.open("q-wizardDB", 1); // Version can be incremented for schema changes

      request.onerror = (event: any) => {
        console.error("Error opening IndexedDB:", event.target.error);
      };

      await new Promise((resolve) => {
        request.onsuccess = () => {
          const db = request.result as unknown as IDBDatabase;
          if (db) {
            const transaction = db.transaction(["quizzes"], "readwrite");

            const objectStore = transaction.objectStore("quizzes");

            const addRequest = objectStore.add({
              id: Date.now(),
              ...quizToSave,
            });

            addRequest.onsuccess = (event: any) => {
              console.log("Quiz added to IndexedDB successfully");
              setSuccessMsg("Quiz Added!");
            };

            addRequest.onerror = (event: any) => {
              console.error(
                "Error adding quiz to IndexedDB:",
                event.target.error
              );
            };

            transaction.oncomplete = resolve;
          } else {
            console.log("Database connection failed");
          }
        };
      });
    } else {
      alert("Please sign in to create a new quiz.");
    }
  };

  // -------------------------------------------
  // RENDER UI
  // -------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg("");
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [successMsg]);

  return (
    <div className="flex flex-col bg-blue-100 border border-neutral-500 w-fit p-6 rounded-lg">
      <h2 className="text-neutral-950 font-semibold text-2xl mb-4 flex items-center">
        Create a New Quiz
        {successMsg && (
          <span className="bg-green-500 text-sm text-white py-1 px-2 ml-3 rounded">
            {successMsg}
          </span>
        )}
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
