"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError(null);
  
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    try {
      const res = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false, // Prevent auto-redirect
      });
  
      console.log("response : ",res);
      if (res.ok) {
        const session = await getSession();
        console.log("Session after login:", session);
        //window.location.href = "/dashboard"; // Redirect to dashboard
        if (session?.user?.id) {
          window.location.href = "/dashboard";
        } 
         else {
          setError("Session not found. Please try again.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Google Sign-In Button */}
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full mb-4"
        variant="default"
      >
        Sign in with Google
      </Button>

      <div className="text-center my-4">OR</div>

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
        <Button type="submit" className="w-full" variant="default">
          Sign in with Credentials
        </Button>
      </form>
    </div>
  );
}
