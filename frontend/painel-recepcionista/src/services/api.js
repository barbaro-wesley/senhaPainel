import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL do backend
});

// Adiciona o token JWT no cabeçalho das requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Obtém o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;