export async function getCategories() {
  const response = await fetch("/json/category.json");
  const categories = await response.json();
  return categories;
}

export async function getNumberOfQuestions() {
  const response = await fetch("/json/numOfQuestions.json");
  const numOfQuestions = await response.json();
  return numOfQuestions;
}

export async function getTimeLimit() {
  const response = await fetch("/json/time.json");
  const timeLimit = await response.json();
  return timeLimit;
}
