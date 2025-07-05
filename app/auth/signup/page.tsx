"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const inputs = [
    {
      label: "Usuario",
      name: "username",
      placeholder: "Ingresa tu usuario",
      type: "text",
      required: {
        value: true,
        message: "El usuario es requerido",
      },
    },
    {
      label: "Email",
      name: "email",
      placeholder: "Ingresa tu correo electrónico",
      type: "email",
      required: {
        value: true,
        message: "El correo electrónico es requerido",
      },
    },
    {
      label: "Contraseña",
      name: "password",
      type: "password",
      placeholder: "Ingresa tu contraseña",
      required: {
        value: true,
        message: "La contraseña es requerida",
      },
    },
  ];

  const onSubmit = async (dataForm: any) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        setError(`Error del servidor: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Set cookie and redirect
        document.cookie = "auth-token=authenticated; path=/; max-age=86400"; // 24 hours
        router.push("/");
      } else {
        setError(data.message || "Error de autenticación");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error de conexión: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Control Financiero
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {inputs.map((input, i) => (
              <div key={i} className="space-y-2">
                <Label htmlFor={input.name}>{input.label}</Label>
                <Input
                  type={input.type}
                  {...register(`${input.name}`, { required: input.required })}
                  placeholder={input.placeholder}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-xs">
                    {errors[input.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            <p className="text-sm text-center">
              Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="text-blue-500">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
