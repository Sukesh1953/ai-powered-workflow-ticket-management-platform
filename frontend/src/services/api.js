import axios from "axios";

const api = axios.create({
  baseURL: " https://ai-powered-workflow-ticket-management.onrender.com"
});

export default api;