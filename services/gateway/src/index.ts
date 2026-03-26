import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); // Security headers
app.use(cors()); // Allow your web-editor to connect
app.use(express.json());

// --- THE HANDSHAKE ROUTE ---
// Redirects any auth calls to the auth-service (usually port 3001)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" }, // Strips /api/auth before sending
  }),
);

app.get("/status", (req, res) => {
  res.json({
    service: "GATEWAY",
    status: "OPERATIONAL",
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`[GATEWAY] Initialized on port ${PORT}`);
});
