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
    <nav className="fixed bottom-0 left-0 w-full bg-purple-800 text-[#EAEAEA] p-2 flex justify-evenly">
      {ROUTES.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn("flex flex-col items-center px-4", {
            "text-[#00BFFF] transition-all ease-in-out": isActive(route.path),
          })}
        >
            {genIcon(route.label)}
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
