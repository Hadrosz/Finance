"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 grid grid-cols-[0.25fr_1.75fr]">
      <Sidebar />
      <main className="min-h-screen w-full">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
