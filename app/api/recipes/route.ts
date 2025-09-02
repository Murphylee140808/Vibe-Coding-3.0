import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { recipe, userId } = await req.json();
  const { data, error } = await supabase
    .from("user_recipes")
    .insert([{ ...recipe, user_id: userId }]);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
}
