import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import Invoice from "../models/Invoice.js";
import Lead from "../models/Lead.js";
import User from "../models/User.js";
import WorkspaceSettings from "../models/WorkspaceSettings.js";

dotenv.config();

await connectDB();

const adminEmail = process.env.ADMIN_EMAIL || "admin@edtechcrm.local";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

const admin = await User.findOneAndUpdate(
  { email: adminEmail },
  {
    name: process.env.ADMIN_NAME || "Vishal Admin",
    email: adminEmail,
    role: "Super Admin",
    active: true,
    passwordHash: await User.hashPassword(adminPassword),
  },
  { new: true, upsert: true, setDefaultsOnInsert: true }
);

await WorkspaceSettings.findOneAndUpdate(
  { singletonKey: "default" },
  { instituteName: "EdTech CRM Workspace", defaultCounselor: "Nisha", timezone: "Asia/Kolkata", currency: "INR", updatedBy: admin._id },
  { upsert: true }
);

if ((await Lead.countDocuments()) === 0) {
  await Lead.insertMany([
    { name: "Anika Sharma", email: "anika@example.com", phone: "9876543210", courseInterested: "Data Analytics", source: "Website", status: "Demo Scheduled", assignedCounselor: "Nisha", createdBy: admin._id },
    { name: "Rahul Verma", email: "rahul@example.com", phone: "9876543211", courseInterested: "Full Stack", source: "Google Ads", status: "Contacted", assignedCounselor: "Kabir", createdBy: admin._id },
    { name: "Diya Nair", email: "diya@example.com", phone: "9876543212", courseInterested: "Product Management", source: "Referral", status: "Converted", assignedCounselor: "Nisha", createdBy: admin._id },
  ]);
}

if ((await Application.countDocuments()) === 0) {
  await Application.insertMany([
    { studentName: "Priyansh Jain", email: "priyansh@example.com", phone: "9876500001", course: "MERN Career Track", city: "Bengaluru", status: "Under Review", assignedReviewer: "Meera" },
    { studentName: "Sara Thomas", email: "sara@example.com", phone: "9876500002", course: "Data Science", city: "Mumbai", status: "Pending", assignedReviewer: "Aarav" },
  ]);
}

if ((await Candidate.countDocuments()) === 0) {
  await Candidate.insertMany([
    { name: "Karan Mehta", email: "karan@example.com", phone: "9876510001", roleApplied: "Admissions Counsellor", department: "Sales", status: "Shortlisted", assignedHR: "Riya" },
    { name: "Neha Iyer", email: "neha@example.com", phone: "9876510002", roleApplied: "Instructor", department: "Academics", status: "Interview Scheduled", assignedHR: "Riya" },
  ]);
}

if ((await Invoice.countDocuments()) === 0) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  await Invoice.create({ studentName: "Diya Nair", email: "diya@example.com", phone: "9876543212", course: "Product Management", amount: 45000, paidAmount: 20000, discount: 2500, tax: 0, paymentMethod: "UPI", dueDate, createdBy: admin._id });
}

console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
await process.exit(0);
