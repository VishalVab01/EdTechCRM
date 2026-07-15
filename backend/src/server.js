import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173";

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX || 600),
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/search", searchRoutes);

app.use("/auth", authRoutes);
app.use("/leads", leadRoutes);
app.use("/applications", applicationRoutes);
app.use("/candidates", candidateRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/settings", settingsRoutes);
app.use("/search", searchRoutes);

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

let bootstrapped = false;

export async function bootstrap() {
  if (bootstrapped) return;
  const connected = await connectDB();
  if (connected) await ensureDefaultAdmin();
  bootstrapped = true;
}

if (!process.env.VERCEL) {
  await bootstrap();
  app.listen(port, () => {
    console.log(`API server running on http://127.0.0.1:${port}`);
  });
}

export default app;
