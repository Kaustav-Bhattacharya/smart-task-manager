"use client"
import React, { useState } from 'react';
import Header from '@/components/custom/header';
import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';


const SettingsPage = () => {
  const { setTheme } = useTheme()
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const switchTheme = () =>{
 darkMode ? setTheme("dark") : setTheme("light");
 setDarkMode(!darkMode);
  }

  return (
    <div className="container p-5 space-y-5 max-w-[768px]">
      <Header heading='Settings'/>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg">Enable Dark mode</span>
          <Toggle pressed={darkMode} onPressedChange={switchTheme}>{darkMode?<Sun/>:<Moon/>}</Toggle>
        </div>
        <p className="text-sm text-gray-600">
          {darkMode 
            ? 'Dark Mode is currently enabled.' 
            : 'Dark Mode is currently disabled.'}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
