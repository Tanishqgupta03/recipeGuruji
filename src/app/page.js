'use client';

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FaHome,
  FaStar,
  FaUtensils,
  FaCoffee,
  FaHamburger,
  FaCookie,
} from "react-icons/fa";
import { FaBowlRice } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa"; // Added FaArrowRight for redirection icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ShadCN dropdown components

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("top");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      console.log(data);
      setRecipes(data);
      const topRated = data.filter((recipe) => recipe.averageRating > 7);
      setFilteredRecipes(topRated); // Initially show all recipes
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = (type) => {
    setActiveTab("");
    setLoading(true);

    setTimeout(() => {
      if (type === "all") {
        setFilteredRecipes(recipes);
        setActiveTab("all");
      } else if (type === "top") {
        const topRated = recipes.filter((recipe) => recipe.averageRating > 7);
        setFilteredRecipes(topRated);
        setActiveTab("top");
      } else {
        const mealRecipes = recipes.filter((recipe) => recipe.mealType === type);
        setFilteredRecipes(mealRecipes);
        setActiveTab(type);
      }

      console.log("activeTab ; ", activeTab);
      setLoading(false);
    }, 500); // Simulate loader delay for better UX
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsOpen(false);
  };

  return (
    <TooltipProvider>
      <div
        className={`relative min-h-screen bg-white text-gray-900 ${
          loading ? "overflow-hidden" : ""
        }`}
      >
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-md z-40">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <header className="flex justify-between items-center w-full px-6 py-4 bg-gray-100 shadow">
          <div className="flex items-center">
            <img
              src="/images/logo.webp"
              alt="RecipeGuruji Logo"
              className="w-12 h-12 rounded-full"
            />
            <h1 className="ml-4 text-lg font-bold">Welcome to RecipeGuruji</h1>
          </div>

          {/* Buttons: Personal Dashboard and Register Dropdown */}
          <div className="flex items-center gap-4">
            {/* Personal Dashboard Button */}
            <Button
              variant="default"
              className="bg-black hover:bg-gray-900 text-white font-semibold flex items-center gap-2"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Personal Dashboard
              <FaArrowRight className="text-white" /> {/* Redirection icon */}
            </Button>

            {/* Register Dropdown (on hover) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-300"
                >
                  Register
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                onMouseEnter={(e) => e.preventDefault()} // Keep dropdown open on hover
              >
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/sign-up")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  Sign Up
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/sign-in")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  Sign In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4 w-full"></div>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-72 bg-gray-100 shadow-xl rounded-lg p-6 flex flex-col items-center space-y-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/images/logo.webp"
                alt="RecipeGuruji Logo"
                className="w-20 h-20 rounded-full shadow-md border-4 border-gray-200"
              />
              <h1 className="text-xl font-bold text-gray-800 tracking-wide">
                RecipeGuruji
              </h1>
            </div>

            {/* Navigation Section */}
            <nav className="w-full">
              <ul className="space-y-4">
                {/* All Recipes */}
                <li
                  onClick={() => filterRecipes("all")}
                  className={`flex items-center justify-between gap-3 font-medium text-gray-800 hover:text-blue-600 transition cursor-pointer p-3 rounded-lg ${
                    activeTab === "all" ? "bg-blue-100 text-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaHome className="text-blue-500" />
                    All Recipes
                  </div>
                  <span className="text-sm bg-gray-200 rounded-full px-3 py-1 shadow-md">
                    {recipes.length}
                  </span>
                </li>

                {/* Top Rated */}
                <li
                  onClick={() => filterRecipes("top")}
                  className={`flex items-center justify-between gap-3 font-medium text-gray-800 hover:text-blue-600 transition cursor-pointer p-3 rounded-lg ${
                    activeTab === "top" ? "bg-blue-100 text-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaStar className="text-yellow-500" />
                    Top Rated
                  </div>
                  <span className="text-sm bg-gray-200 rounded-full px-3 py-1 shadow-md">
                    {recipes.filter((recipe) => recipe.averageRating > 7).length}
                  </span>
                </li>

                {/* Categories */}
                <li className="flex items-center gap-3 font-medium text-gray-800">
                  <FaUtensils className="text-green-500" />
                  Categories
                </li>
                <ul className="ml-8 space-y-3 text-gray-600">
                  {/* Breakfast */}
                  <li
                    onClick={() => filterRecipes("breakfast")}
                    className={`flex items-center justify-between gap-3 font-medium text-gray-800 hover:text-blue-600 transition cursor-pointer p-3 rounded-lg ${
                      activeTab === "breakfast" ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaCoffee className="text-orange-500" />
                      Breakfast
                    </div>
                    <span className="text-sm bg-gray-200 rounded-full px-3 py-1 shadow-md">
                      {recipes.filter((recipe) => recipe.mealType === "breakfast")
                        .length}
                    </span>
                  </li>

                  {/* Lunch */}
                  <li
                    onClick={() => filterRecipes("lunch")}
                    className={`flex items-center justify-between gap-3 font-medium text-gray-800 hover:text-blue-600 transition cursor-pointer p-3 rounded-lg ${
                      activeTab === "lunch" ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaHamburger className="text-red-500" />
                      Lunch
                    </div>
                    <span className="text-sm bg-gray-200 rounded-full px-3 py-1 shadow-md">
                      {recipes.filter((recipe) => recipe.mealType === "lunch")
                        .length}
                    </span>
                  </li>

                  {/* Snack */}
                  <li
                    onClick={() => filterRecipes("snack")}
                    className={`flex items-center justify-between gap-3 font-medium text-gray-800 hover:text-blue-600 transition cursor-pointer p-3 rounded-lg ${
                      activeTab === "snack" ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaCookie className="text-purple-500" />
                      Snack
                    </div>
                    <span className="text-sm bg-gray-200 rounded-full px-3 py-1 shadow-md">
                      {recipes.filter((recipe) => recipe.mealType === "snack")
                        .length}
                    </span>
                  </li>

                  {/* Dinner */}
                  <li
                    onClick={() => filterRecipes("dinner")}
                    className={`flex items-center justify-between gap-3 font-medium text-gray-800 hover:text-blue-600 transition cursor-pointer p-3 rounded-lg ${
                      activeTab === "dinner" ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaBowlRice className="text-blue-500" />
                      Dinner
                    </div>
                    <span className="text-sm bg-gray-200 rounded-full px-3 py-1 shadow-md">
                      {recipes.filter((recipe) => recipe.mealType === "dinner")
                        .length}
                    </span>
                  </li>
                </ul>
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 p-4">
            <h2 className="text-xl font-bold mb-4">Recipes</h2>
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe) => (
                  <Card
                    key={recipe._id}
                    className="hover:shadow-lg cursor-pointer"
                    onClick={() => openModal(recipe)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {recipe.title}
                        {recipe.averageRating > 7 && (
                          <div className="ml-2 flex items-center">
                            <div className="w-6 h-6 border-2 border-blue-500 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110">
                              <span className="text-white text-lg">★</span>
                            </div>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-sm text-gray-500">
                        <strong>Meal Type:</strong> {recipe.mealType}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Calories:</strong> {recipe.calorieIntake} kcal
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Average Rating:</strong> {recipe.averageRating}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recipes available for this category.</p>
            )}

            {/* Modal Dialog */}
            {selectedRecipe && (
              <Dialog open={isOpen} onOpenChange={closeModal}>
                <DialogContent
                  className="max-w-5xl w-full max-h-screen h-auto p-8 bg-white rounded-lg shadow-lg overflow-hidden custom-scrollbar"
                  style={{ height: "90vh", overflowY: "auto" }}
                >
                  {/* Header Section */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <img
                      src="/images/logo.webp"
                      alt="RecipeGuruji Logo"
                      className="w-24 h-24 rounded-full shadow-lg border-4 border-gray-200"
                    />
                    <h1 className="text-3xl font-bold text-gray-800">RecipeGuruji</h1>
                  </div>

                  {/* Main Content */}
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section: Image */}
                    <div className="lg:col-span-1">
                      <img
                        src={selectedRecipe.imageUrl}
                        alt={selectedRecipe.title}
                        className="w-full h-72 object-cover rounded-lg shadow-md"
                      />
                    </div>

                    {/* Right Section: Details */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {selectedRecipe.title}
                        </h2>
                        <p className="mt-2 text-gray-600">{selectedRecipe.description}</p>

                        {/* Additional Info */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4 text-sm font-semibold shadow-sm">
                            <strong>Meal Type:</strong> {selectedRecipe.mealType}
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-sm font-semibold shadow-sm">
                            <strong>Calories:</strong> {selectedRecipe.calorieIntake} kcal
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-sm font-semibold shadow-sm">
                            <strong>Hero Ingredient:</strong> {selectedRecipe.heroIngredient}
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-sm font-semibold shadow-sm">
                            <strong>Average Rating:</strong> {selectedRecipe.averageRating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients and Steps */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Ingredients</h3>
                      <ul className="space-y-3">
                        {selectedRecipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <FaCheckCircle className="text-green-500" />
                            <span className="text-gray-700">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Steps */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Steps</h3>
                      <ol className="space-y-4">
                        {selectedRecipe.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-semibold">
                              {idx + 1}
                            </span>
                            <p className="text-gray-700">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* YouTube Link */}
                  {selectedRecipe.youtubeLink && (
                    <div className="mt-8">
                      <a
                        href={selectedRecipe.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-500 transition-all"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;