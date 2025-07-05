import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientLayout } from "@/components/ClientLayout";
import DashboardLayout from "@/layout/dashboard-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Control Financiero Personal",
  description: "Dashboard para el control de finanzas personales con SQLite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardLayout>{children}</DashboardLayout> <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
