import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Simple user validation (replace with your actual authentication logic)
function validateUser(username: string, password: string) {
  // For now, use hardcoded credentials
  if (username === "Alejandro" && password === "Aldany17!!") {
    return { id: 1, username: "Alejandro" };
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log(username);

    if (!username || !password) {
      return NextResponse.json(
        { message: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const user = validateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: { id: user.id, username: user.username },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
