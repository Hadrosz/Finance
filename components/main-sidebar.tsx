"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CreditCard,
  Bitcoin,
  FileText,
  LogOut,
  TrendingUp,
  Menu,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transacciones", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Bitcoin", href: "/dashboard/invest", icon: Bitcoin },
];

interface MainSidebarProps {
  children: React.ReactNode;
}

export function MainSidebar({ children }: MainSidebarProps) {
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center h-16 px-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">FinanceHub</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tema</span>
              <ThemeToggle />
            </div>

            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm font-medium text-accent-foreground">
                Alejandro
              </p>
              <p className="text-xs text-muted-foreground">Administrador</p>
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
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="relative">
        <div className="absolute top-4 left-4 z-50">
          <SidebarTrigger
            className="h-10 w-10 p-0 shadow-lg bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background rounded-md border flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>
        {children}
      </SidebarInset>

      {/* Fixed Sidebar Trigger */}
    </SidebarProvider>
  );
}
