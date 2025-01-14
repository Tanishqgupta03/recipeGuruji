// components/ExpertSearch.js
"use client"; // Ensure this is a client component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react"; // Import the Upload icon
import { Loader2 } from "lucide-react"; // Import the circular loader icon

export default function ExpertSearch({ isOpen, onClose }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [detectedFood, setDetectedFood] = useState(null); // New state for detected food
  const [recipes, setRecipes] = useState([]); // New state for recipes
  const [showRecipesDialog, setShowRecipesDialog] = useState(false); // New state for recipes dialog

  // Create image preview
  const createImagePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Set a preview for the file
      setImagePreview(await createImagePreview(file));

      // Start the upload process
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      // Upload the image to Cloudinary
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Cloudinary response:", data);

      // Update the image state with Cloudinary URL and public_id
      setImage({
        file,
        url: data.url, // Use the Cloudinary response to set the image URL
        public_id: data.public_id, // Set the public ID
      });

      console.log("Image URL:", data.url);
      console.log("Image public_id:", data.public_id);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  // Handle "Forward" button click
  const handleForward = async () => {
    if (!image || !image.url) {
      alert("Please upload an image first.");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await fetch("/api/detect-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: image.url }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the image.");
      }

      const data = await response.json();
      console.log("Detected food:", data.foodItem);
      console.log("Recommended recipes:", data.recipes);

      // Set the detected food and recipes state
      setDetectedFood(data.foodItem);
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Error in handleForward:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle "View" button click
  const handleViewRecipes = () => {
    setShowRecipesDialog(true); // Show the recipes dialog
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col">
          <div className="space-y-4 flex-grow">
            <DialogHeader>
              <DialogTitle>Expert Guruji</DialogTitle>
              <DialogDescription>
                Upload an image of a food item, and our AI will suggest recipes you can make with it.
              </DialogDescription>
            </DialogHeader>

            {/* Disclaimer */}
            <div className="text-sm text-gray-600 mb-4">
              <p>
                <strong>Disclaimer:</strong> This feature uses AI to detect food
                items in your image and suggest recipes. Results may vary based on
                image quality and clarity.
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="fileInput">Upload Food Image</Label>
              <label
                htmlFor="fileInput"
                className={`flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer ${
                  isDragging ? "border-primary bg-primary/10" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Conditional rendering for image or upload prompt */}
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Upload Icon */}
                    <Upload className="h-12 w-12 text-gray-400" />

                    {/* Upload Label */}
                    <div className="mt-4 flex text-sm text-gray-600">
                      <span className="font-medium text-primary hover:text-primary/80">
                        Upload a file
                      </span>
                      <span className="pl-1">or drag and drop</span>
                    </div>

                    {/* File Type Disclaimer */}
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  name="file"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>

              {/* Uploading State */}
              {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
            </div>

            {/* Detected Food Section */}
            {detectedFood && (
              <div className="text-lg font-semibold">
                Detected Food: <span className="text-primary">{detectedFood}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-white py-2">
            <Button variant="outline" onClick={onClose} disabled={uploading || isLoading}>
              Cancel
            </Button>
            {detectedFood ? (
              <Button onClick={handleViewRecipes}>View Recipes</Button>
            ) : (
              <Button onClick={handleForward} disabled={uploading || !image || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" /> // Circular loader
                ) : (
                  "Forward"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recipes Dialog */}
      <Dialog open={showRecipesDialog} onOpenChange={setShowRecipesDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Recommended Recipes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <p className="text-sm font-medium">{recipe.title}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}



/*Code Flow and Rationale:
1. Uploading the Image to Cloudinary
Why?

The image needs to be hosted on a public URL so it can be analyzed by APIs (e.g., Google Cloud Vision). APIs typically require a public URL for processing.
Cloudinary provides a fast, reliable way to store and access images.
Steps:

User uploads an image through the frontend.
The image is sent to Cloudinary, and its URL is saved in your application for further processing.
2. Using Google Cloud Vision API
Why?

To determine the contents of the image—in this case, to check if the image contains a recognizable food item.
Google Cloud Vision provides powerful image recognition capabilities, including detecting food items, objects, and text in images.
Steps:

The Cloudinary image URL is sent to the Google Cloud Vision API.
The API identifies objects in the image. If it detects a food-related label (e.g., "apple," "pizza"), the name of the food is extracted.
The label serves as input for the next step.
3. Using Spoonacular API
Why?

To generate recipe recommendations for the detected food item.
Spoonacular provides a database of recipes and allows searching by ingredient or food name.
Steps:

The food label from the Vision API (e.g., "pizza") is sent to the Spoonacular API.
The API searches its recipe database and returns a list of recipes that can be prepared using the detected food item.
These recipes are displayed to the user.
Why Use Both APIs?
Google Cloud Vision:

Ensures the uploaded image contains a food item before proceeding to recipe generation.
Adds intelligence to the application by detecting food items directly from an image.
Spoonacular:

Provides a specific set of recipes related to the identified food item.
Handles the logic of finding suitable recipes, making it easier to integrate with your app.
End-to-End Flow:
User uploads an image via the frontend.
The image is stored on Cloudinary, and its URL is saved.
The Cloudinary URL is sent to the Google Cloud Vision API:
If the image contains a food item, the label is extracted.
If no food item is detected, an error is returned.
The extracted food label is sent to the Spoonacular API:
Recipes for the food item are fetched.
Recipes are displayed to the user.
This combination of APIs ensures your app:

Can analyze images to detect food items.
Provides meaningful and relevant recipe recommendations. */