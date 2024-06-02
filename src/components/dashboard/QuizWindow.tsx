import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "next/navigation";
import { openDB } from "idb";
import { QuizData } from "../../contexts/QuizContext";
import Quiz from "@/app/quiz/[quizId]/page";

interface QuizWindowProps {
  quiz: QuizData | null;
}
const QuizWindow: React.FC<QuizWindowProps> = ({ quiz }) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizData[]>([]);
  const [cat1FetchResults, setCat1FetchResults] = useState<QuizData[]>([]);
  const [cat2FetchResults, setCat2FetchResults] = useState<QuizData[]>([]);
  const [cat3FetchResults, setCat3FetchResults] = useState<QuizData[]>([]);
  const [quizFetchError, setQuizFetchError] = useState<string>("");

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
        selectedCategories[0].length > 0 &&
        selectedNumOfQuestions &&
        selectedTimeLimit
      ) {
        setCategory1(selectedCategories[0].toLowerCase().split("-").join(""));

        setCategory2(selectedCategories[1]?.toLowerCase().split("-").join(""));

        setCategory3(selectedCategories[2]?.toLowerCase().split("-").join(""));

        setNumOfQuestions(selectedNumOfQuestions.slice(0, 2));

        setTimeLimit(selectedTimeLimit.slice(0, 2));
      } else if (
        quiz &&
        selectedCategories[0].length === 0 &&
        selectedCategories[1].length === 0 &&
        selectedCategories[2].length === 0 &&
        selectedNumOfQuestions &&
        selectedTimeLimit
      ) {
        setCategory1("");
        setCategory2("");
        setCategory3("");
        setNumOfQuestions("");
        setTimeLimit(null);
        console.log(`category ${category2} and/or ${category3} is empty.`);
      }
    };
    fetchUserSelectedCategoriesandNoq();
  }, [quiz]);

  console.log("Category1:", category1);
  console.log("Category2:", category2);
  console.log("Category3:", category3);
  console.log("Num of Questions:", numOfQuestions);
  console.log("Time Limit:", timeLimit);

  // --------------------------------------------------------
  // URL and Options for API calls
  // --------------------------------------------------------

  // Categories 1, 2, and 3 URLs
  const cat1URL = `https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia?category=${encodeURIComponent(
    category1
  )}&limit=${encodeURIComponent(numOfQuestions)}`;

  const cat2URL = `https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia?category=${encodeURIComponent(
    category2
  )}&limit=${encodeURIComponent(numOfQuestions)}`;

  const cat3URL = `https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia?category=${encodeURIComponent(
    category3
  )}&limit=${encodeURIComponent(numOfQuestions)}`;

  // API Options
  const apiOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "14c7760d5cmsh39f09a401e974acp1fc340jsnec79916c7b60",
      "X-RapidAPI-Host": "trivia-by-api-ninjas.p.rapidapi.com",
    },
  };

  // Category 1 Fetch Results
  useEffect(() => {
    const fetchCat1Data = async () => {
      if (numOfQuestions !== null) {
        const url = cat1URL;
        const options = apiOptions;
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          setCat1FetchResults(data);
        } catch (error) {
          setQuizFetchError("Failed to fetch data");
        }
      }
    };
    fetchCat1Data();
  }, [category1, numOfQuestions]);

  console.log("CAT 1 FETCH RESULTS:", cat1FetchResults);

  // Category 2 Fetch Results
  useEffect(() => {
    const fetchCat2Data = async () => {
      if (numOfQuestions !== null) {
        const url = cat2URL;
        const options = apiOptions;
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          setCat2FetchResults(data);
        } catch (error) {
          setQuizFetchError("Failed to fetch data");
        }
      }
    };
    fetchCat2Data();
  }, [category2, numOfQuestions]);

  console.log("CAT 2 FETCH RESULTS:", cat2FetchResults);

  useEffect(() => {
    const fetchCat3Data = async () => {
      if (numOfQuestions !== null) {
        const url = cat3URL;
        const options = apiOptions;
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          setCat3FetchResults(data);
        } catch (error) {
          setQuizFetchError("Failed to fetch data");
        }
      }
    };
    fetchCat3Data();
  }, [category3, numOfQuestions]);

  console.log("CAT 3 FETCH RESULTS:", cat3FetchResults);

  useEffect(() => {
    const combineAndRandomizeQuestions = () => {
      const combinedQuizCategories = [
        ...cat1FetchResults,
        ...cat2FetchResults,
        ...cat3FetchResults,
      ];

      // Randomize questions in combinedQuizCategories array
      for (let i = combinedQuizCategories.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedQuizCategories[i], combinedQuizCategories[j]] = [
          combinedQuizCategories[j],
          combinedQuizCategories[i],
        ];
      }
      const selectedQuestions = combinedQuizCategories.slice(0, numOfQuestions);
      console.log("QUIZ QUESTIONS:", selectedQuestions);
      setQuizQuestions(selectedQuestions);
    };
    combineAndRandomizeQuestions();
  }, [cat1FetchResults, cat2FetchResults, cat3FetchResults, numOfQuestions]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {quizQuestions &&
        quizQuestions.length > 0 &&
        quizQuestions.map((result, apiIndex) => (
          <div key={apiIndex} className="flex items-center gap-2">
            <p key={apiIndex}>{result.question}</p>
            <p className="font-bold">{result.category}</p>
          </div>
        ))}
    </div>
  );
};

export default QuizWindow;
