// interface RecipeCardProps {
//   recipe: {
//     title: string;
//     ingredients: string[];
//     instructions: string[];
//   };
//   onSave: () => void;
// }

// export default function RecipeCard({ recipe, onSave }: RecipeCardProps) {
//   return (
//     <div className="bg-white p-4 rounded-2xl shadow-lg">
//       <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
//       <h3 className="font-semibold">Ingredients:</h3>
//       <ul className="list-disc ml-5 mb-2">
//         {recipe.ingredients.map((ing, i) => (
//           <li key={i}>{ing}</li>
//         ))}
//       </ul>
//       <h3 className="font-semibold">Instructions:</h3>
//       <ol className="list-decimal ml-5 mb-2">
//         {recipe.instructions.map((inst, i) => (
//           <li key={i}>{inst}</li>
//         ))}
//       </ol>
//       <button
//         onClick={onSave}
//         className="mt-2 w-full bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition"
//       >
//         Save to Favorites
//       </button>
//     </div>
//   );
// }
