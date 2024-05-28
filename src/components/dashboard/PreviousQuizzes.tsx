"use client";

import { openDB } from "idb";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { QuizContext, QuizData } from "../../contexts/QuizContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getFirstName } from "../../helpers";
import { HiDotsVertical } from "react-icons/hi";
const PreviousQuizzes: React.FC = () => {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const firstName = getFirstName();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const db = await openDB("q-wizardDB", 1);
      try {
        const transaction = db.transaction("quizzes", "readonly");
        const objectStore = transaction.objectStore("quizzes");
        const quizData = await objectStore.getAll();
        setQuizzes(quizData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizzes();
  }, [quizzes]);

  const handleOpenModal = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(!isModalOpen);
  };

  const questions = selectedQuiz?.selectedNumOfQuestions.split(" ")[0];

  return (
    <div className="flex flex-col bg-blue-100 border border-neutral-500 w-fit p-6 rounded-lg">
      <h2 className="text-neutral-950 font-semibold text-2xl mb-4">
        {session?.user?.name}&apos;s Stats
      </h2>
      <div className="flex gap-4">
        <div>
          {session && (
            <Image
              priority
              src={session?.user.image as string}
              alt={session?.user.name as string}
              width={500}
              height={500}
              className="border-4 border-yellow-400 rounded-full w-40 h-40 my-3"
            />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="text-2xl text-neutral-800 font-bold">Average Score</h2>
          <p className="text-5xl py-2 px-4 bg-yellow-200 border-2 border-neutral-800 rounded-2xl text-neutral-600 font-normal">
            89<span className="text-4xl">%</span>
          </p>
          <p className="text-xl text-neutral-700 font-bold">
            Quizzes Created:&nbsp;
            <span className="text-xl px-2 border border-white bg-white rounded-full">
              {quizzes.length}
            </span>
          </p>
        </div>
      </div>
      <hr className="w-full h-[0.3%] mt-6 bg-black"></hr>
      <div className="border-2 border-neutral-950 rounded-xl p-4 my-10 bg-gray-800/60">
        <p className="text-white tracking-wide text-2xl font-semibold">
          Quizzes
        </p>
        <div className="flex flex-wrap gap-x-2 my-2">
          {quizzes.map((quiz, qzIndex) => (
            <div
              key={qzIndex}
              onClick={() => handleOpenModal(quiz)}
              className="mt-2 bg-white/70 cursor-pointer hover:bg-sky-200 py-2 px-3 border border-neutral-950 rounded-lg"
            >
              <div className="flex items-center">
                <p className="text-neutral-950 font-semibold">
                  {quiz.quizTitle}&nbsp;
                </p>
                <p>
                  <HiDotsVertical />
                </p>
              </div>
              {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-slate-700/40 backdrop-blur-3xl">
                  <div className="bg-gradient-to-tr from-white via-sky-200/30 to-white w-1/2 flex flex-col p-6 border border-neutral-900/70 rounded-lg">
                    <p className="text-neutral-950 text-3xl mb-4 font-semibold">
                      {selectedQuiz?.quizTitle}
                    </p>
                    <p className="text-neutral-800 text-xl font-semibold">
                      Category Selection
                    </p>
                    {selectedQuiz?.selectedCategories.map(
                      (category: string, catIndex: number) => (
                        <div key={catIndex} className="flex items-center">
                          <li className="text-neutral-800 font-semibold ml-4">
                            {category}
                          </li>
                        </div>
                      )
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <p className="font-semibold text-lg text-neutral-800">
                        Number of Questions:
                      </p>
                      <p className="text-neutral-600 font-semibold">
                        {questions}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-neutral-800">
                        Time per Question:
                      </p>
                      <p className="text-neutral-600 font-semibold">
                        {selectedQuiz?.selectedTimeLimit}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousQuizzes;
