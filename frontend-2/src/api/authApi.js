import axios from "axios";

const API = axios.create({
  baseURL: "https://azure-library-project-back-faccasd8b3eueycs.eastus2-01.azurewebsites.net/api", // Cambia la URL según tu backend
});

export const login = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data; // Aquí recibimos el token JWT y los datos del usuario
  } catch (error) {
    throw error.response ? error.response.data : { message: "Error desconocido" };
  }
};
