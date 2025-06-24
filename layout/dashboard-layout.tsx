"use client";

import { MainSidebar } from "@/components/main-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <MainSidebar>
        <main className="relative min-h-screen w-full p-4 lg:p-8 bg-background">
          {children}
        </main>
      </MainSidebar>
    </div>
  );
}
