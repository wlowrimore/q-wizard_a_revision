import { QuizData } from "@/contexts/QuizContext";

const dbName = "q-wizardDB";
const version = 1;

let db;

const request = indexedDB.open(dbName, version);

request.onupgradeneeded = (event) => {
  if (event.target) {
    db = event.target as IDBDatabase;

    const quizzesObjectStore = db.createObjectStore("quizzes", {
      keyPath: "id",
    });
    quizzesObjectStore.createIndex("id", "id", { unique: true });
    quizzesObjectStore.createIndex("userId", "userId");

    const usersObjectStore = db.createObjectStore("users", { keyPath: "id" });
    usersObjectStore.createIndex("id", "id", { unique: true });
  }
};

request.onsuccess = (event) => {
  if (event.target) {
    db = event.target as IDBDatabase;
    console.log("IndexedDB connection successful");

    const existingQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

    const transaction = db.transaction(["quizzes", "users"], "readwrite");

    const quizzesObjectStore = transaction.objectStore("quizzes");
    existingQuizzes.forEach((quiz: QuizData) => {
      quizzesObjectStore.add(quiz);
    });

    const usersObjectStore = transaction.objectStore("users");
    usersObjectStore.add(existingUser);

    localStorage.removeItem("quizzes");
    localStorage.removeItem("user");
  }
};

request.onerror = (event) => {
  if (event.target) {
    const requestTarget = event.target as IDBOpenDBRequest;
    console.log("IndexedDB connection error:", requestTarget.error);
  }
};
