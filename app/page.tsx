"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  instructions: string;
}

interface User {
  id: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- Auth Handlers ----------
  const handleAuth = async () => {
    setLoading(true);
    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) alert(result.error.message);
    else {
      const currentUser = supabase.auth.getUser();
      setUser((await currentUser).data.user as User);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ---------- AI Recipe Generation ----------
  const generateRecipes = async () => {
    if (!ingredients) return alert("Enter ingredients first");
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: `Suggest 3 simple recipes using: ${ingredients}. Return as JSON array of {title, ingredients, instructions}`,
        }),
      });

      const data = await res.json();

      // Attempt to parse AI response safely
      const text = data?.output_text || "[]";
      const parsed: Recipe[] = JSON.parse(text);
      setRecipes(parsed);
    } catch (err) {
      console.error(err);
      alert("Failed to generate recipes");
    }

    setLoading(false);
  };

  // ---------- Save Recipe ----------
  const handleSave = async (recipe: Recipe) => {
    if (!user) return alert("Please login first");

    const { data, error } = await supabase
      .from("user_recipes")
      .insert([{ ...recipe, user_id: user.id }]);

    if (error) alert(error.message);
    else alert(`Saved "${recipe.title}"!`);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">🍳 Recipe Recommender</h1>

      {/* ---------- Auth Form ---------- */}
      {!user && (
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg mb-6">
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
            onClick={handleAuth}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
          <p className="mt-2 text-sm text-gray-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </p>
        </div>
      )}

      {user && (
        <>
          <p className="mb-4">
            Logged in as <strong>{user.email}</strong>{" "}
            <button onClick={handleLogout} className="text-red-500 underline ml-2">Logout</button>
          </p>

          {/* ---------- Ingredients Input ---------- */}
          <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg mb-6">
            <label className="block mb-2 font-medium">Enter Ingredients:</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. chicken, rice, spinach"
              className="w-full p-3 border rounded-lg mb-3"
              rows={3}
            />
            <button
              onClick={generateRecipes}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Generating..." : "Get Recipes"}
            </button>
          </div>

          {/* ---------- Recipes Display ---------- */}
          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">{recipe.title}</h3>
                <p className="mb-2"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p className="mb-2"><strong>Instructions:</strong> {recipe.instructions}</p>
                <button
                  onClick={() => handleSave(recipe)}
                  className="mt-2 w-full bg-indigo-600 text-white py-1 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save to Favorites
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
