import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["BREVO_API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Create Brevo API client
const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": process.env.BREVO_API_KEY,
    "Content-Type": "application/json",
  },
});

// Error handler
brevoClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Brevo API Error:", error.response?.data || error.message);
    throw error;
  },
);

export default brevoClient;
