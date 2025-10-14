// // src/utils/api.js
// export async function apiFetch(endpoint, options = {}) {
//   const token = localStorage.getItem("authToken");

//   if (!token) {
//     console.error("❌ No JWT token in localStorage");
//     throw new Error("User not authenticated");
//   }

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, // ✅ ТЕПЕР ПРАВИЛЬНО
//     ...options.headers,
//   };

//   const response = await fetch(`https://back-space-clicker-1.onrender.com${endpoint}`, {
//     ...options,
//     headers,
//   });

//   const data = await response.json().catch(() => ({}));

//   if (!response.ok) {
//     console.error("❌ API error:", data);
//     throw new Error(data.message || "API request failed");
//   }

//   return data;
// }
import axios from 'axios';

// Створюємо екземпляр axios
const api = axios.create({
  baseURL: 'https://back-space-clicker-1.onrender.com' // Ваш базовий URL
});

// ✨ Ось магія: створюємо перехоплювач запитів
api.interceptors.request.use(
  (config) => {
    // Перед кожним запитом отримуємо токен з localStorage
    const token = localStorage.getItem('authToken');

    // Якщо токен існує, додаємо його в заголовок Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Повертаємо оновлену конфігурацію
    return config;
  },
  (error) => {
    // Робимо щось із помилкою запиту
    return Promise.reject(error);
  }
);

export default api;