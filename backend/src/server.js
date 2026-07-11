import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173";

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/leads", leadRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/invoices", invoiceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    });
  }

  console.error(error);
  res.status(500).json({ message: "Server error" });
});

await connectDB();

app.listen(port, () => {
  console.log(`API server running on http://127.0.0.1:${port}`);
});
