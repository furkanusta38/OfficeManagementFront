import axios from "axios";

const API_BASE_URL = "https://localhost:7084/api";  

export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/login`, credentials);
    return response.data;  
  } catch (error) {
    throw error.response?.data || error;
  }
}
