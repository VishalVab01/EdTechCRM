export const applicationStatusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  "Under Review": "bg-blue-50 text-blue-700 border-blue-100",
  Approved: "bg-mint text-pine border-mint",
  Rejected: "bg-rose-50 text-rose-700 border-rose-100",
  "On Hold": "bg-slate-100 text-slate-700 border-slate-200",
};

export const emptyApplicationForm = {
  studentName: "",
  email: "",
  phone: "",
  course: "",
  qualification: "",
  city: "",
  applicationSource: "Website",
  status: "Pending",
  assignedReviewer: "",
  remarks: "",
};

export function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function uniqueValues(items, field) {
  return Array.from(new Set(items.map((item) => item[field]).filter(Boolean))).sort();
}
