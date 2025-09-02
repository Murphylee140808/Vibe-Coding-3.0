// pages/api/save-recipe.ts  (or app/api/save-recipe/route.ts)
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase"; // adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { recipe, userId } = req.body;

    if (!userId) return res.status(400).json({ error: "User not logged in" });

    const { data, error } = await supabase
      .from("user_recipes")
      .insert([{ ...recipe, user_id: userId }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
