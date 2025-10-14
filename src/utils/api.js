// src/utils/api.js
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("❌ No JWT token in localStorage");
    throw new Error("User not authenticated");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // ✅ ТЕПЕР ПРАВИЛЬНО
    ...options.headers,
  };

  const response = await fetch(`https://back-space-clicker-1.onrender.com${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("❌ API error:", data);
    throw new Error(data.message || "API request failed");
  }

  return data;
}
