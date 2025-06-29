import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL // not process.env in Vite
});

export const queryAgent = (question) => {
  return API.post("/query", { question });
};
