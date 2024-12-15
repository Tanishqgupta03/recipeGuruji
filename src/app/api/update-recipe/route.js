import { dbConnect } from "@/lib/dbConnect";
import Recipe from "@/model/Recipe";

export async function POST(request) {
  await dbConnect();

  try {
    // Parse the incoming request data
    const { userId, recipeToUpdate, ...updateData } = await request.json();

    console.log("userId : ",userId)
    console.log("recipeToUpdate : ",recipeToUpdate)
    console.log("updateData : ",updateData)

    if (!userId || !recipeToUpdate) {
      return new Response(JSON.stringify({ message: "Missing userId or recipe ID." }), {
        status: 400,
      });
    }

    // Find the recipe by its ID and associated userId, then update
    const recipe = await Recipe.findOneAndUpdate(
      { _id: recipeToUpdate, userId },
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!recipe) {
      return new Response(
        JSON.stringify({ message: "Recipe not found or user not authorized." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Recipe updated successfully.", recipe }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating recipe:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred while updating the recipe." }),
      { status: 500 }
    );
  }
}


/*2. Parameters Explained
a. { _id: recipeToUpdate, userId }
This is the filter condition.
Mongoose will look for a document where:
_id matches the value of recipeToUpdate.
userId matches the value of userId (ensuring the recipe belongs to the specific user).
b. { $set: updateData }
This specifies the update operation.
The $set operator updates the fields in the document with the key-value pairs in updateData.
c. { new: true }
This is an option passed to findOneAndUpdate.
By default, findOneAndUpdate returns the document before the update.
Setting new: true ensures that the updated document is returned instead. */