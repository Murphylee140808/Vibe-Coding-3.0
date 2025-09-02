"use client";

import { useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function Home() {
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User entered:", ingredients);
    // Later send to OpenAI API
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🍳 Recipe Recommender</h1>

      <AuthForm onLogin={(user) => console.log("Logged in user:", user)} />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg"
      >
        <label className="block mb-3 text-lg font-medium text-gray-700">
          Enter your ingredients:
        </label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. chicken, rice, spinach"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          rows={4}
        />
        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Get Recipes
        </button>
      </form>
    </main>
  );
}
