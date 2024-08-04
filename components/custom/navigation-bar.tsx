"use client";
import React from "react";
import Link from "next/link";
import { HomeIcon, NotebookTabs, SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {};

const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/settings", label: "Settings" },
];

const Navigation = (props: Props) => {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  const genIcon = (icon: string) => {
    switch (icon) {
      case "Home":
        return <HomeIcon />;
      case "Settings":
        return <SettingsIcon />;
      case "Dashboard":
        return <NotebookTabs />;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full p-2 flex justify-evenly items-center shadow-md bg-[#CACEFF] dark:bg-[#2D2D2D] text-[#2D2D2D] dark:text-[#CACEFF]">
      {ROUTES.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "flex flex-col items-center px-4 py-2 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg",
            {
              "text-[#0044FF] dark:text-[#0044FF]": isActive(route.path),
            }
          )}
        >
          {genIcon(route.label)}
          <span className="hidden sm:block mt-1 text-sm font-medium">{route.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
