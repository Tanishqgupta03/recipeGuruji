import { dbConnect } from "@/lib/dbConnect";
import Recipe from "@/model/Recipe";

export async function DELETE(request) {
    await dbConnect();

    try {
        const { id } = await request.json(); // Extract ID from the request body
        console.log("id to delete:", id);

        if (!id) {
            return new Response("ID not provided", { status: 400 });
        }

        // Find the recipe by ID and delete it
        const recipe = await Recipe.findByIdAndDelete(id);

        if (!recipe) {
            return new Response("Recipe not found", { status: 404 });
        }

        return new Response("Recipe deleted successfully", { status: 200 });
    } catch (err) {
        console.error("Error deleting recipe:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
