import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  getInvoiceSummary,
  invoiceOptions,
  updateInvoice,
  updateInvoicePayment,
} from "../controllers/invoiceController.js";
import { requireDatabase } from "../middleware/requireDatabase.js";

const router = express.Router();

router.get("/options", invoiceOptions);

router.use(requireDatabase);

router.get("/stats/summary", getInvoiceSummary);
router.route("/").post(createInvoice).get(getInvoices);
router.route("/:id").get(getInvoiceById).put(updateInvoice).delete(deleteInvoice);
router.patch("/:id/payment", updateInvoicePayment);

export default router;
