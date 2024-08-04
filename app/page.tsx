"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(password==="@dminPasswor6" && email==="admin")
      router.push("/task-list")
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-[#CACEFF] text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      )}
    >
      <form
        onSubmit={handleLogin}
        className={cn(
          "w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg",
          "bg-white dark:bg-gray-800"
        )}
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <Button
          type="submit"
          className={cn(
            "w-full py-2 px-4 rounded-md text-white",
            "bg-[#CACEFF] hover:bg-[#A6B3D8]",
            "dark:bg-purple-600 dark:hover:bg-purple-700"
          )}
        >
          Login
        </Button>

        <div className="text-center text-sm">
          <a href="#" className="hover:underline">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
