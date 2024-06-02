"use client";

import { openDB } from "idb";
import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { QuizData } from "../../contexts/QuizContext";
import { QuizContext } from "../../contexts/QuizContext";
import { HiOutlineLightBulb, HiOutlineCursorClick } from "react-icons/hi";
import QuizWindow from "./QuizWindow";
interface QuizContainerProps {
  quizId: string;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ quizId }) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [stars, setStars] = useState<string>("");
  const [openQuizWindow, setOpenQuizWindow] = useState<boolean>(false);

  useEffect(() => {
    if (quiz) {
      switch (quiz?.selectedTimeLimit) {
        case "10 seconds":
          setStars("⭐⭐⭐⭐⭐");
          break;
        case "20 seconds":
          setStars("⭐⭐⭐⭐");
          break;
        case "30 seconds":
          setStars("⭐⭐⭐");
          break;
        case "40 seconds":
          setStars("⭐⭐");
          break;
        case "50 seconds":
          setStars("⭐");
          break;
        default:
          setStars("");
          break;
      }
    }
  }, [quiz]);

  useEffect(() => {
    const fetchUserQuiz = async () => {
      const db = await openDB("q-wizardDB", 1);
      const id = parseInt(quizId);
      console.log("QUIZ ID TO FETCH:", quizId);
      try {
        const transaction = db.transaction("quizzes", "readonly");
        const objectStore = transaction.objectStore("quizzes");
        const userQuiz = await objectStore.get(id as IDBValidKey); // Use get(userId) for ID lookup
        console.log("User Quiz From Quiz Container:", userQuiz);
        if (userQuiz) {
          console.log("FETCHED QUIZ DATA:", quizId);
          setQuiz(userQuiz); // Update state with fetched quiz data
        } else {
          console.warn("Quiz not found with ID:", quizId);
          // Handle case where quiz with ID is not found (optional)
        }
        setQuiz(userQuiz); // Update state with fetched quiz data
      } catch (error) {
        console.error("Error fetching user quiz data:", error);
      }
    };
    fetchUserQuiz();
  }, [quizId]);

  const handleStartQuiz: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    setOpenQuizWindow(true);
  };

  return (
    <div className="w-full h-full my-24 flex flex-col items-center justify-center">
      <div>
        {quiz ? (
          <>
            <div key={quiz.id} className="w-full h-auto grid grid-cols-2 mb-1">
              <div className="flex flex-col border border-neutral-500 rounded-tl-xl bg-slate-600 text-white w-full py-2 px-12">
                <p className="text-center text-2xl tracking-wide">
                  Time Limit / Question
                </p>
                <p className="text-xl text-center tracking-wider">
                  {quiz?.selectedTimeLimit} / {quiz?.selectedNumOfQuestions}
                </p>
              </div>
              <div className="flex flex-col border border-neutral-500 rounded-tr-xl bg-slate-600 text-white w-full py-2 px-12">
                <p className="text-center text-2xl tracking-wide">
                  Each Question Worth
                </p>
                <p className="text-xl text-center tracking-wider">{stars}</p>
              </div>
            </div>
            <div className="flex text-lg tracking-wide w-full mx-auto gap-2 items-center justify-center py-1 px-4 bg-yellow-400/60 rounded-b-xl border-t border-slate-400">
              <div className="flex items-center font-bold gap-2">
                <p>Your Category Selection:</p>
                <span>
                  <HiOutlineLightBulb />
                </span>
              </div>
              <div className="flex">
                <p className="font-bold">
                  {Array.isArray(quiz?.selectedCategories) &&
                  quiz?.selectedCategories
                    ? quiz?.selectedCategories.join(" | ")
                    : ""}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p>Loading Quiz...</p>
        )}
      </div>
      <div className="flex items-center gap-4 my-6 px-12 border-b border-neutral-300">
        <h1 className="text-neutral-950 font-semibold text-3xl my-6">
          <span className="text-cyan-700 font-bold">
            &quot;{quiz?.quizTitle}&quot;
          </span>
          &nbsp;Is Ready
        </h1>
        <button
          onClick={handleStartQuiz}
          className="bg-emerald-400 text-slate-800 border border-emerald-500 hover:bg-slate-600/90 hover:text-yellow-400 text-3xl p-1 rounded-full flex items-center transition duration-200"
        >
          <HiOutlineCursorClick />
        </button>
      </div>
      <div>{openQuizWindow && <QuizWindow quiz={quiz} />}</div>
    </div>
  );
};

export default QuizContainer;
