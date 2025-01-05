import { dbConnect } from "@/lib/dbConnect";
import Recipe from "@/model/Recipe";

export async function POST(request) {
  await dbConnect(); // Connect to the database

  try {
    const { title, description, ingredients,steps,heroIngredient,mealType,calorieIntake,youtubeLink,imageUrl,public_id, userId } = await request.json();

    console.log("public_id is : ",public_id)

    if(!title || !description){
        console.log("inside if ")
        return new Response(JSON.stringify({ message: "Title and Description are required!" }), { status: 500 });   
    }

    // You can now use userId to associate the recipe with the user
    const newRecipe = new Recipe({
      userId: userId,
      title,
      description,
      ingredients,
      steps,
      mealType,
      imageUrl,
      heroIngredient,
      calorieIntake,
      youtubeLink,
      public_id,
    });

    console.log("new recipe is : ",newRecipe)

    await newRecipe.save();

    return new Response(JSON.stringify({ message: "Recipe added successfully!" }), { status: 201 });
  } catch (err) {
    console.error("Error processing POST request:", err);
    return new Response(JSON.stringify({ error: "Error adding recipe" }), { status: 500 });
  }
}
