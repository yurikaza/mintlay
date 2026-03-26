import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/health", (req, res) => res.json({ status: "Auth OK" }));

app.listen(4001, () => console.log("Auth running on 4001"));
