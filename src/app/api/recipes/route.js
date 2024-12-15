import Recipe from "@/model/Recipe"; // Adjust the path based on your project structure
import { dbConnect } from "@/lib/dbConnect"; // Ensure you connect to your MongoDB

export async function GET(request) {
  await dbConnect(); // Establish database connection

  try {
    const recipes = await Recipe.find(); // Fetch all recipes
    return new Response(JSON.stringify(recipes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error fetching recipes",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
