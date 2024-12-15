'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaHome, FaStar, FaUtensils, FaCoffee, FaHamburger, FaCookie } from "react-icons/fa";
import { FaBowlRice } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,DialogFooter } from "@/components/ui/dialog"; // ShadCN dialog components
import { FaCheckCircle } from 'react-icons/fa';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { MoreVertical, Edit, Trash2 } from 'lucide-react'; // Import icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Dashboard = () => {
  const router = useRouter();
  
  // Session states
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");
  
  // Recipes states
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [activeTab, setActiveTab] = useState('top');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [addButton, setAddButton] = useState(false);
  const [loading, setLoading] = useState(false); // For progress bar
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdateOpen,setIsUpdateOpen] = useState(false)
  const [recipeToUpdate, setRecipeToUpdate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    heroIngredient: '',
    mealType: 'other',
    calorieIntake: '',
    youtubeLink: '',
    image: null,
  });

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        console.log("Session data in dashboard:", session);

        if (session && session.user?.id) {
            console.log("session.id : ",session.user.id)
          setUserId(session.user.id);
          setUsername(session.user.username);
          setLoadingSession(false);
        } else {
          setSessionError("Session exists but no user ID found.");
          setLoadingSession(false);
        }
      } catch (error) {
        setSessionError("Error fetching session.");
        setLoadingSession(false);
        console.error(error);
      }
    };
    fetchSession();
  }, [router]);

  // Fetch recipe data
  const handleUpdate = (id) => {
    console.log(`Update recipe with id:`, { id });
    // Find the recipe with the provided ID and set it to the form state
    const recipeToUpdate = recipes.find(recipe => recipe._id === id);
  
    if (recipeToUpdate) {
      // Set the state to open the update modal with the current recipe details
      setFormData(recipeToUpdate);
      setRecipeToUpdate(id);
      setIsUpdateOpen(true); // This will open the modal
    }
  };
  

  const handleDelete = async () => {
    if (!recipeToDelete) return;

    try {
      const response = await fetch("/api/delete-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: recipeToDelete }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      // Update the state to remove the deleted recipe
      setFilteredRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeToDelete)
      );
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeToDelete)
      );

      console.log(`Recipe with id ${recipeToDelete} successfully deleted.`);
    } catch (err) {
      console.error("Error deleting recipe:", err);
    } finally {

      console.log("finally runni")
      
      setShowDeleteConfirmation(false);
      setRecipeToDelete(null);
    }
  };
  
  const openDeleteConfirmation = (id) => {
    setRecipeToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
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
      console.log("recipee data :",data);
      //const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      //console.log("sortedData :", sortedData);
      const userRecipe = data.filter((recipe) => recipe.userId == userId);
      setRecipes(userRecipe);
      console.log("userId : ",userId)
      console.log("userRecipe : ",userRecipe);
      console.log("recipeeeeee : ",recipes);
      const topRated = userRecipe.filter((recipe) => recipe.averageRating > 7);
      setFilteredRecipes(topRated); // Initially show top-rated recipes

      console.log("filteredRecipes : ",filteredRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Filter recipes based on category
  const filterRecipes = (type) => {
    console.log("inside filterRecipes")
    setActiveTab(type);
    setLoadingRecipes(true);

    console.log("recipes inside : ",recipes);

    setTimeout(() => {
      if (type === "all") {
        setFilteredRecipes(recipes);
      } else if (type === "top") {
        const topRated = recipes.filter((recipe) => recipe.averageRating > 7);
        setFilteredRecipes(topRated);
      } else {
        const mealRecipes = recipes.filter((recipe) => recipe.mealType === type);
        console.log("mealRecipes : ",mealRecipes);
        setFilteredRecipes(mealRecipes);
      }

      console.log("2nd filteredRecipes : ",filteredRecipes);
      setLoadingRecipes(false);
    }, 300); // Simulate loader delay for better UX
  };

  // Open recipe details modal
  const openModal = (recipe) => {

    console.log("open recipe : ",recipe)
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  // Close recipe details modal
  const closeModal = () => {
    setSelectedRecipe(null);
    setIsOpen(false);
  };

  const closeNewModal = () => {
    setIsNewOpen(false);
  };

  const handleAddNewClick = () =>{
    console.log("handleAddNewClick")
    setIsNewOpen(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (index, value, type) => {
    const updatedArray = [...formData[type]];
    updatedArray[index] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleAddItem = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ''] });
  };

  const handleRemoveItem = (index, type) => {
    const updatedArray = [...formData[type]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = () => {
    if (!validateTitleAndDescription()) {
      return; // Prevent further action if title or description is empty
    }

    if (validateForm()) {
      setShowConfirmation(true);
    }
    else{
      // Perform validation if needed
      console.log("formdata : ",formData)
      onCreate(formData);
      //closeModal();
    }
  };

  const handleUpdateSubmit = () => {
    if (!validateTitleAndDescription()) {
      return; // Prevent further action if title or description is empty
    }

    if (validateForm()) {
      setShowConfirmation(true);
    }
    else{
      // Perform validation if needed
      console.log("formdata : ",formData)
      onupdate();
      //closeUpdateModal();
    }
  };
  const validateForm = () => {
    return formData.ingredients.every(ing => ing.trim() === "") || 
           formData.steps.every(step => step.trim() === "");
  };
  const handleProceed = () => {
    setShowConfirmation(false);

    console.log("handleProceed m isUpdateOpen : ",isUpdateOpen);
    if(isUpdateOpen){
      onupdate();
    }
    else{
    onCreate();
    }
  };

  const validateTitleAndDescription = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and Description are required.");
      return false;
    }
    else{
      setError(null);
      return true;
    }
  };

  const fetchRecipesAndFilter = async (type) => {
    try {
      setLoadingRecipes(true);
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
      console.log("Fetched data: ", data);
  
      const userRecipe = data.filter((recipe) => recipe.userId == userId);
      setRecipes(userRecipe);
  
      // Wait for `recipes` to update using a callback with useEffect
      setTimeout(() => {
        if (type === "all") {
          setFilteredRecipes(userRecipe);
        } else {
          const filtered = userRecipe.filter((recipe) => recipe.mealType === type);
          setFilteredRecipes(filtered);
        }
        setActiveTab(type); // Update the active tab
        setLoadingRecipes(false);
      }, 300); // Small delay to ensure state update
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoadingRecipes(false);
    }
  };
  // Inside the same file
  const closeUpdateModal = () => {
    setIsUpdateOpen(false); // Close the modal
    setRecipeToUpdate(null);
  
    // Optionally, reset the form data if needed
    setFormData({
      title: '',
      description: '',
      ingredients: [''],
      steps: [''],
      heroIngredient: '',
      mealType: 'other',
      calorieIntake: '',
      youtubeLink: '',
      image: null,
    });
  };
  
  const onupdate = async () => {
    console.log("inside onUpdate : ");
    setLoading(true);
    setError(null);
  
    try {
      console.log("before update userId: ", userId);
      console.log("before update recipeToUpdate: ", recipeToUpdate);
  
      const response = await fetch("/api/update-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId, recipeToUpdate }),
      });
  
      console.log("response : ", response);
      const data = await response.json();
      console.log("data : ", data);
  
      if (response.ok) {
        console.log("Recipe updated successfully!");
  
        // Update the recipe in local state
        setFilteredRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeToUpdate ? { ...recipe, ...data.recipe } : recipe
          )
        );

        console.log("FilteredRecipeee : ",filteredRecipes)
  
        setLoading(false);
        setIsUpdateOpen(false);
        setRecipeToUpdate(null);
      } else {
        console.error("Error updating recipe.");
        setLoading(false);
        setError(data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
      setError(err.message);
    }
  };
  

  const onCreate = async (e) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/add-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId }),
      });
  
      console.log("response : ", response);
      const data = await response.json();
      console.log("data : ", data);
  
      if (response.ok) {
        console.log("mealType : ", formData.mealType);
        await fetchRecipesAndFilter(formData.mealType); // New function
        console.log("Recipe added successfully!");
        setLoading(false);
        setIsNewOpen(false);
      } else {
        console.error("Error adding recipe.");
        setLoading(false);
        setError(data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [userId]); // Fetch recipes on component mount

  if (loadingSession) {
    return <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-md z-40">
            <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
            </div>
        </div>; // Display loading message while session is being fetched
  }

  if (sessionError) {
    return <div>Error: {sessionError}</div>; // Display error if session is not found
  }

  return (
    <TooltipProvider>
      <div className={`relative min-h-screen bg-white text-gray-900 ${loadingRecipes ? "overflow-hidden" : ""}`}>
        {/* Loader */}
        {loadingRecipes && (
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
          <h1 className="ml-4 text-lg font-bold">Welcome {username}, to RecipeGuruji</h1>
        </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default">Register</Button>
            </TooltipTrigger>
            <TooltipContent>
              Register yourself for a better experience
            </TooltipContent>
          </Tooltip>
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
              <h1 className="text-xl font-bold text-gray-800 tracking-wide">RecipeGuruji</h1>
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
                      {recipes.filter((recipe) => recipe.mealType === "breakfast").length}
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
                      {recipes.filter((recipe) => recipe.mealType === "lunch").length}
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
                      {recipes.filter((recipe) => recipe.mealType === "snack").length}
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
                      {recipes.filter((recipe) => recipe.mealType === "dinner").length}
                    </span>
                  </li>
                </ul>
              </ul>
            </nav>
          </aside>
          {/* Content */}
          <main className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recipes</h2>
              <Button
                className="bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400"
                onClick={handleAddNewClick} // Define this function for action
              >
                <span className="text-lg">+</span>
                <span>Add New</span>
              </Button>
            </div>

            {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <Card
                  key={recipe._id}
                  className="hover:shadow-lg cursor-pointer"
                  onClick={() => openModal(recipe)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {recipe.title} 
                      {recipe.averageRating > 7 && ( 
                        <div className="ml-2 flex items-center"> 
                          <div className="w-6 h-6 border-2 border-blue-500 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110">
                            <span className="text-white text-lg">★</span> 
                          </div> 
                        </div> 
                      )}
                      <div className="flex items-center space-x-2 ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => { 
                                e.stopPropagation(); // Prevents the dropdown from closing
                                handleUpdate(recipe._id); 
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Update</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => { 
                                e.stopPropagation(); // Prevents the dropdown from closing
                                openDeleteConfirmation(recipe._id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div> 
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
            )
            : (
                <p className="text-gray-500">No recipes available for this category.</p>
              )}

            {/* Modal Dialog */}
            {/* Modal Dialog */}
            {selectedRecipe && (
              <Dialog open={isOpen} onOpenChange={closeModal}>
                <DialogContent
                  className="max-w-5xl w-full max-h-screen h-auto p-8 bg-white rounded-lg shadow-lg overflow-hidden custom-scrollbar"
                  style={{ height: '90vh', overflowY: 'auto' }}
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
                        <h2 className="text-2xl font-semibold text-gray-800">{selectedRecipe.title}</h2>
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

            {isNewOpen && (
              <Dialog open={isNewOpen} onOpenChange={closeNewModal}>
                <DialogContent className="max-w-5xl w-full max-h-screen h-auto p-8 bg-white rounded-lg shadow-lg overflow-hidden custom-scrollbar"
                  style={{ height: '90vh', overflowY: 'auto' }}>
                  {/* Progress Bar */}
                  {/* Animated Overlay */}
                  {loading && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold animate-bounce">Processing...</span>
                    </div>
                  )}
                  {/* Header Section */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <img
                      src="/images/logo.webp"
                      alt="RecipeGuruji Logo"
                      className="w-24 h-24 rounded-full shadow-lg border-4 border-gray-200"
                    />
                    <h1 className="text-3xl font-bold text-gray-800">Create New Recipe</h1>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Section */}
                    <div className="flex flex-col space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Hero Ingredient</label>
                        <input
                          type="text"
                          name="heroIngredient"
                          value={formData.heroIngredient}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                        <select
                          name="mealType"
                          value={formData.mealType}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                        >
                          <option value="snack">Snack</option>
                          <option value="lunch">Lunch</option>
                          <option value="breakfast">Breakfast</option>
                          <option value="dinner">Dinner</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Calorie Intake</label>
                        <input
                          type="number"
                          name="calorieIntake"
                          value={formData.calorieIntake}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
                        <input
                          type="url"
                          name="youtubeLink"
                          value={formData.youtubeLink}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                        />
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                        {formData.ingredients.map((ingredient, idx) => (
                          <div key={idx} className="flex space-x-2 mt-1">
                            <input
                              type="text"
                              value={ingredient}
                              onChange={(e) => handleArrayChange(idx, e.target.value, 'ingredients')}
                              className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            />
                            {formData.ingredients.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx, 'ingredients')}
                                className="text-red-600"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddItem('ingredients')}
                          className="text-blue-600 mt-2"
                        >
                          Add Ingredient
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Steps</label>
                        {formData.steps.map((step, idx) => (
                          <div key={idx} className="flex space-x-2 mt-1">
                            <input
                              type="text"
                              value={step}
                              onChange={(e) => handleArrayChange(idx, e.target.value, 'steps')}
                              className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            />
                            {formData.steps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx, 'steps')}
                                className="text-red-600"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddItem('steps')}
                          className="text-blue-600 mt-2"
                        >
                          Add Step
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <div
                          className="border border-gray-300 rounded-lg flex items-center justify-center h-40 cursor-pointer hover:bg-gray-100"
                          onClick={() => document.getElementById('fileInput').click()}
                        >
                          <span className="text-gray-500">Upload Image Here</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          id="fileInput"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={closeNewModal}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400"
                    >
                      Create Recipe
                    </button>
                  </div>
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="my-4">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </DialogContent>
              </Dialog>
            )}
           {isUpdateOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-screen h-auto p-8 overflow-hidden custom-scrollbar" style={{ height: '90vh', overflowY: 'auto' }}>
                    {/* Progress Bar */}
                    {/* Animated Overlay */}
                    {loading && (
                      <div className="absolute inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold animate-bounce">Processing...</span>
                      </div>
                    )}
                    {/* Header Section */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                      <img
                        src="/images/logo.webp"
                        alt="RecipeGuruji Logo"
                        className="w-24 h-24 rounded-full shadow-lg border-4 border-gray-200"
                      />
                      <h1 className="text-3xl font-bold text-gray-800">Update Recipe</h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Section */}
                      <div className="flex flex-col space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hero Ingredient</label>
                          <input
                            type="text"
                            name="heroIngredient"
                            value={formData.heroIngredient}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                          <select
                            name="mealType"
                            value={formData.mealType}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                          >
                            <option value="snack">Snack</option>
                            <option value="lunch">Lunch</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="dinner">Dinner</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Calorie Intake</label>
                          <input
                            type="number"
                            name="calorieIntake"
                            value={formData.calorieIntake}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
                          <input
                            type="url"
                            name="youtubeLink"
                            value={formData.youtubeLink}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                          />
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                          {formData.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="flex space-x-2 mt-1">
                              <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleArrayChange(idx, e.target.value, 'ingredients')}
                                className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                              />
                              {formData.ingredients.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx, 'ingredients')}
                                  className="text-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddItem('ingredients')}
                            className="text-blue-600 mt-2"
                          >
                            Add Ingredient
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Steps</label>
                          {formData.steps.map((step, idx) => (
                            <div key={idx} className="flex space-x-2 mt-1">
                              <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange(idx, e.target.value, 'steps')}
                                className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2"
                              />
                              {formData.steps.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx, 'steps')}
                                  className="text-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddItem('steps')}
                            className="text-blue-600 mt-2"
                          >
                            Add Step
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                          <div
                            className="border border-gray-300 rounded-lg flex items-center justify-center h-40 cursor-pointer hover:bg-gray-100"
                            onClick={() => document.getElementById('fileInput').click()}
                          >
                            <span className="text-gray-500">Upload Image Here</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={closeUpdateModal}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateSubmit}
                        className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400"
                      >
                        Update Recipe
                      </button>
                    </div>
                    {/* Error Alert */}
                    {error && (
                      <Alert variant="destructive" className="my-4">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}



            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to add this recipe?</DialogTitle>
                </DialogHeader>
                <p className="text-gray-700">
                  Without the details of ingredients and steps, your recipe will not get any ratings from users.
                </p>
                <DialogFooter>
                  <Button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300" variant="outline" onClick={() => setShowConfirmation(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md" variant="destructive" onClick={handleProceed}>
                    Proceed Anyway
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirmation && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-[40rem]">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Are you sure?</h2>
                  <p className="text-gray-600 mb-8">
                    This action cannot be undone and will permanently delete the recipe.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                      onClick={async () => {
                        setIsDeleting(true); // Start loading
                        await handleDelete(); // Perform the delete
                        setIsDeleting(false); // Stop loading
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

{isDeleting && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
    <span className="text-white text-lg font-semibold animate-bounce">Processing...</span>
  </div>
)}

          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
