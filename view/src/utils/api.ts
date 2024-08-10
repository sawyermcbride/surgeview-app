import axios from "axios";

// Configure axios base URL
const api = axios.create({
  baseURL:
    "https://c304dd4f-9bd6-4c65-acc2-d9c0935d9e52-00-3pwa21tc6kufh.janeway.replit.dev", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
