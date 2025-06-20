import { db } from "./database";
import type { User } from "./database";

export function validateUser(username: string, password: string): User | null {
  const user = db
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .get(username, password) as User | undefined;
  return user || null;
}

export function getUser(username: string): User | null {
  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as User | undefined;
  return user || null;
}
const VALID_CREDENTIALS = {
  username: "Alejandro",
  password: "Aldany17!!",
};

export function validateCredentials(
  username: string,
  password: string
): boolean {
  return (
    username === VALID_CREDENTIALS.username &&
    password === VALID_CREDENTIALS.password
  );
}

export function setAuthCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "auth=authenticated; max-age=86400; path=/"; // 24 hours
  }
}

export function clearAuthCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
