import { jwtDecode } from "jwt-decode";

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // console.log("📦 Decoded token:", decoded);
    return decoded.role || null;
  } catch (error) {
    console.error("❌ Invalid token", error);
    return null;
  }
}