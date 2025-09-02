// 
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
    const { ingredients } = await req.json();
    console.log("Ingredients received:", ingredients);

    const prompt = `You are a helpful recipe assistant. Suggest 3 simple recipes using these ingredients: ${ingredients}. Return in plain text.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
        { role: "system", content: "You are a helpful recipe assistant." },
        { role: "user", content: prompt },
        ],
    });

    console.log("OpenAI response:", response.choices[0].message?.content);

    return NextResponse.json({
        recipes: response.choices[0].message?.content || "No recipes found",
    });
    } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
    }
}
