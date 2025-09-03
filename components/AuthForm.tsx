"use client";

import { useState } from "react";
import { signUp, signIn, getUser } from "@/lib/auth";

interface AuthFormProps {
  onLogin: (user: any) => void;
}

export interface Recipe {
  title: string;
  ingredients: string;
  instructions: string;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (isLogin) result = await signIn(email, password);
    else result = await signUp(email, password);

    if (result.error) {
      alert(result.error.message);
    } else {
      const { data } = await getUser();

      if (!isLogin && data.user) {
        // Create a user record in Supabase table
        const { error } = await (await import("@/lib/supabase")).supabase
          .from("users")
          .insert({
            id: data.user.id,
            email: data.user.email
          });
        if (error) alert("Database error saving new user");
      }

      onLogin(data.user);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-3 border rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-3 border rounded-lg"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
      </button>
      <p className="mt-2 text-sm text-gray-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </p>
    </form>
  );
};

// Named export for saving recipes
export const handleSave = async (recipe: Recipe, user: any) => {
  if (!user) return alert("Please login first");

  const res = await fetch("/api/save-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe, userId: user.id })
  });

  const data = await res.json();

  if (res.ok) alert(`Saved "${recipe.title}"!`);
  else alert(`Error: ${data.error}`);
};

export default AuthForm;
