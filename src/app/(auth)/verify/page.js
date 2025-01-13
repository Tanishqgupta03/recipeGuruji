"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";

const Verify = () => {
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Get the username from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const usernameFromQuery = queryParams.get("username");
    if (usernameFromQuery) {
      setUsername(decodeURIComponent(usernameFromQuery));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, verifyCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false after the response is received
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="flex items-center mb-8">
        <img
          src="/images/logo.webp"
          alt="RecipeGuruji Logo"
          className="w-16 h-16 rounded-full"
        />
        <h1 className="ml-4 text-2xl font-bold text-gray-700">
          Verify Yourself with RecipeGuruji
        </h1>
      </div>

      {/* Verification Section */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="verifyCode">Verification Code</Label>
            <Input
              type="text"
              name="verifyCode"
              id="verifyCode"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="Enter your code"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#000000] to-[#002460] text-white hover:from-[#1a1a1a] hover:to-[#003580] shadow-sm"
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-[#002460]">
            Didn't receive a code?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setError("Resend functionality not implemented yet.")}
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;