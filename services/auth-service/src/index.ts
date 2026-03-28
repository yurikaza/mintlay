import express from "express";
import { connectDB } from "./lib/db";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Database
connectDB();

app.use(express.json());

// 1. CORS MUST be defined before any routes!
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// 2. Now define the routes
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`[AUTH-SERVICE] Active on port ${PORT}`);
});
