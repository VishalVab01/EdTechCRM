import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileStack,
  GraduationCap,
  LineChart,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const trustedLogos = ["EduNova", "SkillBridge", "LearnPro", "Campusly", "UpGradeX", "MentorHub"];

export const stats = [
  { value: 42, suffix: "%", label: "Faster Application Review" },
  { value: 3, suffix: "x", label: "Better Lead Tracking" },
  { value: 68, suffix: "%", label: "Less Manual Work" },
  { value: 24, suffix: "/7", label: "CRM Visibility" },
];

export const benefits = [
  {
    icon: Zap,
    title: "Move Faster",
    text: "Track leads, demos, applications, and follow-ups without switching tools.",
  },
  {
    icon: LineChart,
    title: "Make Smarter Decisions",
    text: "View your sales pipeline, revenue, and student status from one dashboard.",
  },
  {
    icon: CheckCircle2,
    title: "Stay Focused",
    text: "Prioritize pending applications, overdue invoices, and hot leads.",
  },
  {
    icon: Users,
    title: "Work as One Team",
    text: "Give sales, HR, accounts, and admins role-based access to the same CRM.",
  },
];

export const features = [
  {
    icon: Users,
    title: "Sales Lead Management",
    text: "Capture every enquiry, demo, call, owner, and next step in one organized pipeline.",
    span: "lg:col-span-2",
    type: "pipeline",
  },
  {
    icon: ClipboardCheck,
    title: "Student Application Review",
    text: "Review documents, status, counsellor notes, and approvals without inbox chaos.",
    type: "queue",
  },
  {
    icon: FileStack,
    title: "Bulk Application Processing",
    text: "Batch-review hundreds of applications with filters, tags, and quick actions.",
    type: "bulk",
  },
  {
    icon: BriefcaseBusiness,
    title: "HR Candidate Tracking",
    text: "Move educators, counsellors, and support hires through structured hiring stages.",
    type: "hiring",
  },
  {
    icon: CreditCard,
    title: "Billing & Invoicing",
    text: "Track fees, invoices, overdue payments, and revenue from the same workspace.",
    type: "billing",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    text: "See enrolment health, source performance, team productivity, and cash flow.",
    span: "lg:col-span-2",
    type: "reports",
  },
];

export const pricing = [
  {
    name: "Starter",
    price: "₹999",
    note: "/month",
    description: "For small coaching teams",
    features: ["Lead management", "Student records", "Basic application tracking", "Basic billing", "Email support"],
  },
  {
    name: "Growth",
    price: "₹2499",
    note: "/month",
    description: "For growing EdTech teams",
    featured: true,
    features: [
      "Everything in Starter",
      "Bulk application review",
      "HR candidate tracking",
      "Invoice management",
      "Role-based access",
      "Reports dashboard",
    ],
  },
  {
    name: "Scale",
    price: "Custom",
    note: "",
    description: "For institutes and large teams",
    features: [
      "Everything in Growth",
      "Advanced accounting",
      "Custom workflows",
      "API access",
      "Dedicated support",
      "Custom onboarding",
    ],
  },
];

export const blogPosts = [
  {
    slug: "manage-edtech-leads-better",
    title: "How EdTech Teams Can Manage Leads Better",
    excerpt: "A practical guide to capturing, qualifying, and following up with every education enquiry.",
    date: "June 18, 2026",
    readTime: "5 min read",
  },
  {
    slug: "bulk-application-review-saves-time",
    title: "Why Bulk Application Review Saves Time",
    excerpt: "Learn how batch review flows reduce delays for admissions teams and improve student experience.",
    date: "June 10, 2026",
    readTime: "4 min read",
  },
  {
    slug: "student-enrollment-pipelines",
    title: "Building Better Student Enrollment Pipelines",
    excerpt: "Turn enquiry chaos into a repeatable enrollment system for sales, counselling, and admissions.",
    date: "May 28, 2026",
    readTime: "6 min read",
  },
];

export const careers = [
  { title: "MERN Stack Developer", type: "Full-time", location: "Remote / India" },
  { title: "Sales Executive", type: "Full-time", location: "Bengaluru" },
  { title: "HR Associate", type: "Full-time", location: "Hybrid" },
  { title: "Customer Success Manager", type: "Full-time", location: "Remote / India" },
];

export const team = [
  { name: "Aarav Mehta", role: "Product Lead" },
  { name: "Nisha Rao", role: "Admissions Ops" },
  { name: "Kabir Shah", role: "Engineering" },
  { name: "Meera Iyer", role: "Customer Success" },
];

export const footerColumns = [
  { title: "Product", links: ["Features", "Pricing", "Dashboard", "Reports"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
  { title: "Resources", links: ["Blog", "Help Center", "Documentation"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
];

export const utilityIcons = { GraduationCap, Mail, ShieldCheck, Sparkles };
