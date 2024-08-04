// components/custom/client-layout.tsx

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/custom/navigation-bar";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldShowNav = pathname !== "/"; // Update with your login page route

  return (
    <>
      {children}
      {shouldShowNav && <Navigation />}
      <Toaster />
    </>
  );
}
