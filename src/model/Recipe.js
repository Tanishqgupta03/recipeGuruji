import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  imageUrl: { type: String }, // Optional field for the recipe image
  public_id: { type: String }, // Field to store Cloudinary's public_id
  youtubeLink: { type: String }, // Optional field for a YouTube link
  heroIngredient: { type: String }, // Optional field for the hero ingredient
  mealType: { 
    type: String, 
    enum: ['snack', 'lunch', 'breakfast', 'dinner', 'other'], // Limit to specific values
    default: 'other',
  },
  calorieIntake: { type: Number }, // Optional field for calorie intake
  ratings: [{ type: Number }],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

export default Recipe;
