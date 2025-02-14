import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔹 Adiciona automaticamente o token JWT no Header das requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Headers enviados:", config.headers); // 🔹 Verificando os headers da requisição
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
