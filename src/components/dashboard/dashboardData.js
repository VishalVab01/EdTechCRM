import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileStack,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  UsersRound,
} from "lucide-react";

export const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sales Leads", href: "/dashboard/sales-leads", icon: UsersRound },
  { label: "Applications", href: "/dashboard/applications", icon: ClipboardCheck },
  { label: "Bulk Review", href: "/dashboard/bulk-review", icon: FileStack },
  { label: "HR", href: "/dashboard/hr", icon: BriefcaseBusiness },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Accounting", href: "/dashboard/accounting", icon: ReceiptText },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Logout", href: "/dashboard/logout", icon: LogOut, action: "logout" },
];

export const dashboardStats = [
  { label: "Total Leads", value: "1,284", change: "+18.2%", tone: "green", helper: "142 new this week" },
  { label: "Pending Applications", value: "326", change: "+42", tone: "orange", helper: "Needs admissions review" },
  { label: "Converted Students", value: "642", change: "+12.4%", tone: "green", helper: "Across all programs" },
  { label: "Monthly Revenue", value: "Rs 18.4L", change: "+24.1%", tone: "green", helper: "Collected and confirmed" },
];

export const recentLeads = [
  { name: "Anika Sharma", course: "Data Analytics", source: "Webinar", owner: "Nisha", stage: "Demo Booked", score: 92 },
  { name: "Rahul Verma", course: "Full Stack", source: "Google Ads", owner: "Kabir", stage: "Follow-up", score: 78 },
  { name: "Fatima Khan", course: "UI/UX Design", source: "Referral", owner: "Meera", stage: "Application", score: 88 },
  { name: "Vikram Singh", course: "Cloud Computing", source: "Instagram", owner: "Aarav", stage: "New Lead", score: 64 },
  { name: "Diya Nair", course: "Product Management", source: "Website", owner: "Nisha", stage: "Converted", score: 95 },
];

export const applicationQueue = [
  { student: "Priyansh Jain", program: "MERN Career Track", status: "Docs verified", priority: "High" },
  { student: "Sara Thomas", program: "Data Science", status: "Payment pending", priority: "Medium" },
  { student: "Mohit Bansal", program: "Digital Marketing", status: "Needs transcript", priority: "High" },
  { student: "Leena Das", program: "Cybersecurity", status: "Counsellor note", priority: "Low" },
];

export const reminders = [
  { title: "Call 14 hot leads", time: "Today, 4:00 PM", type: "Sales" },
  { title: "Review overdue invoices", time: "Tomorrow, 10:30 AM", type: "Billing" },
  { title: "Finalize HR interview slots", time: "Friday, 2:00 PM", type: "HR" },
];

export const activity = [
  { title: "Bulk approved 28 applications", meta: "Admissions - 12 min ago" },
  { title: "Invoice INV-2049 marked paid", meta: "Accounts - 38 min ago" },
  { title: "New lead assigned to Nisha", meta: "Sales - 1 hr ago" },
  { title: "HR candidate moved to offer", meta: "Hiring - 2 hrs ago" },
];

export const revenueBars = [46, 62, 54, 74, 69, 88, 92, 84];

export const moduleCopy = {
  "sales-leads": {
    title: "Sales Leads",
    text: "Track enquiries, lead scores, owners, source attribution, demos, and follow-up movement.",
  },
  applications: {
    title: "Applications",
    text: "Review student submissions, documents, counsellor notes, admission status, and handoffs.",
  },
  "bulk-review": {
    title: "Bulk Review",
    text: "Process application batches with filters, tags, approvals, and exception queues.",
  },
  hr: {
    title: "HR",
    text: "Manage candidate pipelines for counsellors, instructors, operations, and support teams.",
  },
  billing: {
    title: "Billing",
    text: "Monitor invoices, pending payments, discounts, collections, and student billing status.",
  },
  accounting: {
    title: "Accounting",
    text: "Organize revenue, expenses, payment reconciliation, and financial operating views.",
  },
  reports: {
    title: "Reports",
    text: "Analyze enrollment health, source quality, revenue trends, team productivity, and application speed.",
  },
  settings: {
    title: "Settings",
    text: "Configure role access, team members, notification preferences, and CRM workspace defaults.",
  },
};

export const dashboardUser = {
  name: "Vishal Admin",
  role: "Super Admin",
  institute: "EdTech CRM Workspace",
  icon: Building2,
};
