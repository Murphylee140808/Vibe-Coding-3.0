"use client";

import { useState, useEffect } from "react";
import AuthForm, { handleSave } from "@/components/AuthForm";

interface Recipe {
  title: string;
  ingredients: string;
  instructions: string;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const fetchRecipes = async () => {
    // Replace this with your AI / static recipe fetching logic
    setRecipes([
      {
        title: "Chicken and Spinach Rice Bowl",
        ingredients: "chicken, rice, spinach",
        instructions: "Cook chicken, add spinach, serve over rice",
      },
      {
        title: "One-Pot Spinach Chicken Rice",
        ingredients: "chicken, rice, spinach, broth",
        instructions: "Cook chicken, add rice and broth, stir in spinach",
      },
    ]);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🍳 Recipe Recommender</h1>

      {!user && <AuthForm onLogin={setUser} />}

      <div className="w-full max-w-2xl">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col"
          >
            <h3 className="text-lg font-bold">{recipe.title}</h3>
            <p className="text-gray-700 mt-1">Ingredients: {recipe.ingredients}</p>
            <p className="text-gray-700 mt-1">
              Instructions: {recipe.instructions}
            </p>

            <button
              className="mt-2 w-full bg-indigo-600 text-white py-1 rounded-lg hover:bg-indigo-700 transition"
              onClick={() => handleSave(recipe, user)}
            >
              {user ? "Save Recipe" : "Login to Save"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
