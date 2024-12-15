"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const Verify = () => {
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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

    // Debugging: Log the values before sending the request
    console.log("Username:", username);
    console.log("Verification Code:", verifyCode);

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, verifyCode }), // Send both username and verifyCode
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push("/sign-in"); // Redirect to sign-in page
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      {error && <Alert variant="destructive">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="verifyCode">Verification Code</Label>
          <Input
            type="text"
            name="verifyCode"
            id="verifyCode"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Verify
        </Button>
      </form>
    </div>
  );
};

export default Verify;