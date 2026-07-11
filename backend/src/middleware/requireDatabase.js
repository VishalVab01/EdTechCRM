import { isDatabaseReady } from "../config/db.js";

export function requireDatabase(req, res, next) {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      message: "Database is not connected. Configure MONGO_URI and start MongoDB to use lead APIs.",
    });
  }

  next();
}
