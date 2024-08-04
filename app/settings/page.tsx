"use client";
import React, { useState } from "react";
import Header from "@/components/custom/header";
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const SettingsPage = () => {
  const { setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const router = useRouter();

  const switchTheme = () => {
    darkMode ? setTheme("dark") : setTheme("light");
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    // Perform any necessary logout logic here (e.g., clearing tokens)
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="container p-5 space-y-5">
      <Header heading="Settings" />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg">Enable Dark mode</span>
          <Toggle pressed={darkMode} onPressedChange={switchTheme}>
            {darkMode ? <Sun /> : <Moon />}
          </Toggle>
        </div>
        <p className="text-sm text-gray-600">
          {darkMode
            ? "Dark Mode is currently enabled."
            : "Dark Mode is currently disabled."}
        </p>
      </div>
      <Button
        onClick={handleLogout}
        className="bg-red-600 text-white flex justify-center items-center"
      >
        <LogOut className="mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default SettingsPage;
