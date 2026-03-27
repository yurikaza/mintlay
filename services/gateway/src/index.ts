import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cors from "cors"; // 1. Import CORS

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow your Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allowed for JWT/Cookies
  }),
);

const PORT = process.env.PORT || 3000;
const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";

// ROUTE: Auth Handshake
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" }, // Strips /api/auth before forwarding
  }),
);

app.listen(PORT, () => {
  console.log(`[GATEWAY] Routing_Active_On_Port_${PORT}`);
});
