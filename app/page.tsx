"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, CreditCard, Bitcoin, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Control Financiero
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Gestiona tus finanzas de manera inteligente. Registra transacciones,
            analiza tus gastos e inversiones, y toma el control de tu futuro
            financiero.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Registrarse</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <CardTitle>Gestión de Transacciones</CardTitle>
              <CardDescription>
                Registra y categoriza todas tus transacciones financieras de
                manera fácil y rápida.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <CardTitle>Análisis Detallado</CardTitle>
              <CardDescription>
                Visualiza tus gastos e ingresos con gráficos interactivos y
                reportes personalizados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bitcoin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <CardTitle>Inversiones Bitcoin</CardTitle>
              <CardDescription>
                Seguimiento de tus inversiones en Bitcoin con precios en tiempo
                real y análisis de rendimiento.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">
                ¿Listo para tomar el control?
              </h2>
              <p className="text-muted-foreground mb-6">
                Únete a miles de usuarios que ya están gestionando sus finanzas
                de manera inteligente.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Link href="/auth/login">Comenzar Ahora</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
