"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  CreditCard,
  Bitcoin,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  PieChart,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transacciones", href: "/transactions", icon: CreditCard },
  { name: "Bitcoin", href: "/invest", icon: Bitcoin },
  { name: "Declaración de Renta", href: "/tax", icon: FileText },
];

export default function Sidebar({ className }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to clear the cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Clear the cookie on the client side as well
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, try to redirect to login
      router.push("/auth/login");
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="relative h-full">
      {/* Mobile menu button */}

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-card-foreground">
              FinanceHub
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive
                      ? "text-accent-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-4 py-6 border-t border-border bg-card">
          <div className="mb-4 p-3 bg-accent rounded-lg">
            <p className="text-sm font-medium text-accent-foreground">
              Alejandro
            </p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tema</span>
              <ThemeToggle />
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full justify-start text-muted-foreground border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
