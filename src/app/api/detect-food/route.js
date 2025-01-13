import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required." }),
        { status: 400 }
      );
    }

    // Use Google Cloud Vision API to analyze the image
    const apiKey = process.env.CLOUD_API_KEY;
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const visionRequestBody = {
      requests: [
        {
          image: {
            source: { imageUri: imageUrl },
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 10,
            },
            {
              type: "OBJECT_LOCALIZATION",
              maxResults: 10,
            },
            {
              type: "WEB_DETECTION",
              maxResults: 10,
            },
          ],
        },
      ],
    };

    const visionResponse = await axios.post(visionApiUrl, visionRequestBody);
    const labels = visionResponse.data.responses[0]?.labelAnnotations;
    const objects = visionResponse.data.responses[0]?.localizedObjectAnnotations;
    const webDetection = visionResponse.data.responses[0]?.webDetection;
    const webEntities = webDetection?.webEntities || [];

    if ((!labels || labels.length === 0) && (!objects || objects.length === 0) && webEntities.length === 0) {
      return new Response(
        JSON.stringify({ error: "No labels, objects, or web entities detected." }),
        { status: 404 }
      );
    }

    // Combine labels, objects, and web entities
    const allAnnotations = [
      ...(labels || []),
      ...(objects || []),
      ...webEntities.map((entity) => ({ description: entity.description })),
    ];

    // Filter for specific food-related labels/objects
    const commonFoodItems = ["apple", "pizza", "burger","strawberry", "pasta", "banana", "orange", "cake", "bread", "chicken", "rice", "salad"];
    const foodAnnotations = allAnnotations
      .filter((annotation) => {
        const description = annotation.description?.toLowerCase();
        return (
          description &&
          commonFoodItems.includes(description) &&
          !["food", "dish", "meal", "natural foods", "fast foods"].includes(description)
        );
      })
      .map((annotation) => annotation.description);

    if (foodAnnotations.length === 0) {
      return new Response(
        JSON.stringify({ error: "No specific food item detected. Please enter the food item manually." }),
        { status: 404 }
      );
    }

    // Use the most specific label
    const foodName = foodAnnotations[0];

    // Use Spoonacular API to get recipes
    const recipeApiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${foodName}&number=5&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const recipeResponse = await axios.get(recipeApiUrl);
    const recipes = recipeResponse.data.results;

    return new Response(
      JSON.stringify({
        foodItem: foodName,
        recipes: recipes.map((recipe) => ({
          title: recipe.title,
          image: recipe.image,
          sourceUrl: recipe.sourceUrl,
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in detect-food route:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the image." }),
      { status: 500 }
    );
  }
}