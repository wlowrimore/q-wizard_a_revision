import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "next/navigation";
import { openDB } from "idb";
import { QuizData } from "../../contexts/QuizContext";
import Quiz from "@/app/quiz/[quizId]/page";

interface QuizWindowProps {
  quiz: QuizData | null;
}
const QuizWindow: React.FC<QuizWindowProps> = ({ quiz }) => {
  const [quizFetchError, setQuizFetchError] = useState<string>("");
  const [quizFetchResults, setQuizFetchResults] = useState<QuizData[]>([]);
  const [category1, setCategory1] = useState<string>("");
  const [category2, setCategory2] = useState<string>("");
  const [category3, setCategory3] = useState<string>("");
  const [numOfQuestions, setNumOfQuestions] = useState<any>(null);
  const [timeLimit, setTimeLimit] = useState<string | null>(null);

  const {
    selectedCategories = [],
    selectedNumOfQuestions,
    selectedTimeLimit,
  } = quiz || {};

  useEffect(() => {
    const fetchUserSelectedCategoriesandNoq = () => {
      if (
        quiz &&
        selectedCategories.length > 0 &&
        selectedNumOfQuestions &&
        selectedTimeLimit
      ) {
        setCategory1(selectedCategories[0].toLowerCase().split("-").join(""));
        setCategory2(selectedCategories[1]);
        setCategory3(selectedCategories[2]);
        setNumOfQuestions(selectedNumOfQuestions.slice(0, 2));
        setTimeLimit(selectedTimeLimit);
      } else {
        setCategory1("");
        setCategory2("");
        setCategory3("");
        setNumOfQuestions("");
        setTimeLimit(null);
        console.log("QUIZ NOT FOUND");
      }
    };
    fetchUserSelectedCategoriesandNoq();
  }, [quiz]);

  console.log("SELECTED CATEGORIES:", selectedCategories);
  console.log("CATEGORY 1:", category1);
  console.log("CATEGORY 2:", category2);
  console.log("CATEGORY 3:", category3);
  console.log("NUM OF QUESTIONS:", numOfQuestions);
  console.log("TIME LIMIT:", timeLimit);

  useEffect(() => {
    const fetchCat1Data = async () => {
      if (numOfQuestions !== null) {
        const url = `https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia?category=${encodeURIComponent(
          category1
        )}&limit=${encodeURIComponent(numOfQuestions)}`;
        console.log("URL:", url);
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "14c7760d5cmsh39f09a401e974acp1fc340jsnec79916c7b60",
            "X-RapidAPI-Host": "trivia-by-api-ninjas.p.rapidapi.com",
          },
        };
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          console.log("RETURNED DATA FROM FETCH:", data);
          setQuizFetchResults(data);
        } catch (error) {
          setQuizFetchError("Failed to fetch data");
        }
      }
    };
    fetchCat1Data();
  }, [category1, numOfQuestions]);

  console.log("QUIZ FETCH RESULTS:", quizFetchResults);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {quizFetchResults &&
        quizFetchResults.length > 0 &&
        quizFetchResults.map((result, apiIndex) => (
          <div key={apiIndex} className="flex items-center gap-2">
            <p key={apiIndex}>{result.question}</p>
            <p className="font-bold">{result.category}</p>
          </div>
        ))}
    </div>
  );
};

export default QuizWindow;
