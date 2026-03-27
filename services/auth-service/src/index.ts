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
app.use("/", authRoutes);
app.use(cors({ origin: "http://localhost:5173" }));

app.listen(PORT, () => {
  console.log(`[AUTH-SERVICE] Active on port ${PORT}`);
});
