import { dbConnect } from "@/lib/dbConnect";
import Recipe from "@/model/Recipe";
import { cloudinary } from "@/lib/cloudinary";

export async function DELETE(request) {
    await dbConnect();

    try {
        const { id } = await request.json(); // Extract ID from the request body
        console.log("id to delete:", id);

        if (!id) {
            return new Response("ID not provided", { status: 400 });
        }

        // Find the recipe by ID
        const recipe = await Recipe.findById(id);

        console.log("recipe is here : ",recipe);

        if (!recipe) {
            return new Response("Recipe not found", { status: 404 });
        }

        // Extract public_id from the recipe document
        const { public_id } = recipe;
        console.log("Cloudinary deletion public_id:", public_id);

        if (!public_id) {
            return new Response("No image associated with this recipe", { status: 400 });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                console.error("Error deleting from Cloudinary:", error);
                throw new Error("Failed to delete image from Cloudinary");
            }
            console.log("Cloudinary deletion result:", result);
        });

        // Delete the recipe from MongoDB
        await Recipe.findByIdAndDelete(id);

        return new Response("Recipe and associated image deleted successfully", { status: 200 });
    } catch (err) {
        console.error("Error deleting recipe:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
