"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const router = useRouter();

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Set loading to true when the form is submitted

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      });

      console.log("Sign-in response:", res);

      if (res.ok) {
        console.log("Sign-in successful. Fetching session...");
        const session = await getSession();
        console.log("Session after login:", session);

        if (session?.user?.id) {
          console.log("Session found. Redirecting to dashboard...");
          console.log("Cookies:", document.cookie);
          window.location.href = "/dashboard";
        } else {
          console.error("Session not found. Debugging cookies and tokens...");
          console.log("Cookies:", document.cookie);
          setError("Session not found. Please try again.");
        }
      } else {
        console.error("Sign-in failed. Response:", res);
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
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
          Welcome to RecipeGuruji!
        </h1>
      </div>

      {/* Sign-In Section */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign In
        </h2>
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Google Sign-In Button 
        <Button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full mb-4 bg-gradient-to-r from-[#002460] to-[#375a7f] text-white hover:from-[#003580] hover:to-[#4a6a92] shadow-sm"
        >
          Sign in with Google
        </Button>

        <div className="text-center my-4 text-gray-600">OR</div> */}

        {/* Credentials Sign-In Form */}
        <form onSubmit={handleCredentialsSignIn}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
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
                Signing In...
              </div>
            ) : (
              "Sign in with Credentials"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-[#002460]">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}