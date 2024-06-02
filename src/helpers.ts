"use client";

import { useSession } from "next-auth/react";

export function getFirstName() {
  const { data: session } = useSession();
  if (session) {
    const firstName = session?.user?.name?.split(" ")[0];
    return firstName;
  } else {
    return null;
  }
}

export function formatCategoryNames(categories: string[]): string[] {
  return categories.map((category) => {
    if (category === "sciencenature") {
      return "Science & Nature";
    } else if (category === "artliterature") {
      return "Art & Literature";
    } else if (category === "religionmythology") {
      return "Religion & Mythology";
    } else if (category === "historyholidays") {
      return "History & Holidays";
    } else if (category === "fooddrink") {
      return "Food & Drink";
    } else if (category === "toysgames") {
      return "Toys & Games";
    } else if (category === "sportsleisure") {
      return "Sports & Leisure";
    } else if (category === "peopleplaces") {
      return "People & Places";
    } else {
      const words = category.split("-");
      const formattedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return formattedWords.join(" & ");
    }
  });
}
