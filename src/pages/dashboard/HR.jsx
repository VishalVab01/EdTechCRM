import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarClock, CheckCircle2, Edit3, Eye, Plus, RefreshCcw, Search, Trash2, X, XCircle } from "lucide-react";
import {
  bulkUpdateCandidateStatus,
  CANDIDATE_SOURCES,
  CANDIDATE_STATUSES,
  createCandidate,
  deleteCandidate,
  getCandidates,
  INTERVIEW_MODES,
  updateCandidate,
  updateCandidateInterview,
  updateCandidateStatus,
} from "../../services/candidateService.js";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  roleApplied: "",
  department: "",
  experience: "",
  resumeUrl: "",
  source: "Website",
  status: "Applied",
  interviewDate: "",
  interviewMode: "",
  assignedHR: "",
  remarks: "",
};

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700 border-blue-100",
  Shortlisted: "bg-mint text-pine border-mint",
  "Interview Scheduled": "bg-purple-50 text-purple-700 border-purple-100",
  Selected: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Rejected: "bg-rose-50 text-rose-700 border-rose-100",
  "On Hold": "bg-slate-100 text-slate-700 border-slate-200",
};

const bulkActions = [
  { label: "Shortlist", status: "Shortlisted", icon: CheckCircle2, className: "bg-pine text-white hover:bg-ink" },
  { label: "Reject", status: "Rejected", icon: XCircle, className: "bg-rose-600 text-white hover:bg-rose-700" },
  { label: "Mark On Hold", status: "On Hold", icon: RefreshCcw, className: "bg-slate-700 text-white hover:bg-slate-800" },
];

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function toDatetimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function uniqueValues(items, field) {
  return Array.from(new Set(items.map((item) => item[field]).filter(Boolean))).sort();
}

function ModalShell({ eyebrow, title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[8px] border border-line bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{title}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-cloud text-muted hover:text-ink" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CandidateModal({ mode, candidate, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const isView = mode === "view";

  useEffect(() => {
    setForm(
      candidate
        ? {
            name: candidate.name || "",
            email: candidate.email || "",
            phone: candidate.phone || "",
            roleApplied: candidate.roleApplied || "",
            department: candidate.department || "",
            experience: candidate.experience || "",
            resumeUrl: candidate.resumeUrl || "",
            source: candidate.source || "Website",
            status: candidate.status || "Applied",
            interviewDate: toDatetimeInput(candidate.interviewDate),
            interviewMode: candidate.interviewMode || "",
            assignedHR: candidate.assignedHR || "",
            remarks: candidate.remarks || "",
          }
        : emptyForm
    );
    setError("");
  }, [candidate]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!form.name.trim() || !form.phone.trim() || !form.roleApplied.trim()) {
      setError("Name, phone, and role applied are required.");
      return;
    }
    if (form.email && !emailPattern.test(form.email)) {
      setError("Enter a valid email address or leave it blank.");
      return;
    }
    if (form.interviewDate && !form.interviewMode) {
      setError("Interview mode is required when interview date is added.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      roleApplied: form.roleApplied.trim(),
      department: form.department.trim(),
      experience: form.experience.trim(),
      resumeUrl: form.resumeUrl.trim(),
      assignedHR: form.assignedHR.trim(),
      remarks: form.remarks.trim(),
    });
  };

  if (isView) {
    return (
      <ModalShell eyebrow="Candidate details" title={candidate?.name} onClose={onClose}>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {[
            ["Email", candidate?.email || "Not provided"],
            ["Phone", candidate?.phone],
            ["Role Applied", candidate?.roleApplied],
            ["Department", candidate?.department || "Not provided"],
            ["Experience", candidate?.experience || "Not provided"],
            ["Source", candidate?.source],
            ["Status", candidate?.status],
            ["Interview", formatDateTime(candidate?.interviewDate)],
            ["Interview Mode", candidate?.interviewMode || "Not set"],
            ["Assigned HR", candidate?.assignedHR || "Unassigned"],
            ["Reviewed At", formatDate(candidate?.reviewedAt)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-line bg-cloud p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
              <p className="mt-2 font-bold text-ink">{value}</p>
            </div>
          ))}
          <div className="sm:col-span-2 rounded-[8px] border border-line bg-cloud p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Resume</p>
            {candidate?.resumeUrl ? (
              <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-pine">
                Open resume
              </a>
            ) : (
              <p className="mt-2 text-sm text-muted">Resume link placeholder. Add a resume URL when available.</p>
            )}
          </div>
          <div className="sm:col-span-2 rounded-[8px] border border-line bg-cloud p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Remarks</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{candidate?.remarks || "No remarks yet."}</p>
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell eyebrow={mode === "edit" ? "Edit candidate" : "Add candidate"} title="HR candidate" onClose={onClose}>
      <form onSubmit={submit} className="p-5">
        {error && <p className="mb-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink">Name *<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Email<input type="email" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Phone *<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Role Applied *<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.roleApplied} onChange={(event) => updateField("roleApplied", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Department<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.department} onChange={(event) => updateField("department", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Experience<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.experience} onChange={(event) => updateField("experience", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Resume URL<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.resumeUrl} onChange={(event) => updateField("resumeUrl", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Source<select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.source} onChange={(event) => updateField("source", event.target.value)}>{CANDIDATE_SOURCES.map((source) => <option key={source}>{source}</option>)}</select></label>
          <label className="text-sm font-bold text-ink">Status<select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.status} onChange={(event) => updateField("status", event.target.value)}>{CANDIDATE_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="text-sm font-bold text-ink">Interview Date<input type="datetime-local" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.interviewDate} onChange={(event) => updateField("interviewDate", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Interview Mode<select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.interviewMode} onChange={(event) => updateField("interviewMode", event.target.value)}><option value="">No mode</option>{INTERVIEW_MODES.map((modeItem) => <option key={modeItem}>{modeItem}</option>)}</select></label>
          <label className="text-sm font-bold text-ink">Assigned HR<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.assignedHR} onChange={(event) => updateField("assignedHR", event.target.value)} /></label>
          <label className="sm:col-span-2 text-sm font-bold text-ink">Remarks<textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.remarks} onChange={(event) => updateField("remarks", event.target.value)} /></label>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">Cancel</button>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">{mode === "edit" ? "Save changes" : "Create candidate"}</button>
        </div>
      </form>
    </ModalShell>
  );
}

function InterviewModal({ candidate, onClose, onSave }) {
  const [form, setForm] = useState({ interviewDate: toDatetimeInput(candidate?.interviewDate), interviewMode: candidate?.interviewMode || "Online", remarks: candidate?.remarks || "" });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!form.interviewDate) return setError("Interview date is required.");
    if (!form.interviewMode) return setError("Interview mode is required.");
    onSave(form);
  };

  return (
    <ModalShell eyebrow="Schedule interview" title={candidate?.name} onClose={onClose}>
      <form onSubmit={submit} className="p-5">
        {error && <p className="mb-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink">Interview Date<input type="datetime-local" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.interviewDate} onChange={(event) => setForm((current) => ({ ...current, interviewDate: event.target.value }))} /></label>
          <label className="text-sm font-bold text-ink">Interview Mode<select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.interviewMode} onChange={(event) => setForm((current) => ({ ...current, interviewMode: event.target.value }))}>{INTERVIEW_MODES.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
          <label className="sm:col-span-2 text-sm font-bold text-ink">Remarks<textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.remarks} onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))} /></label>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">Cancel</button>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Confirm</button>
        </div>
      </form>
    </ModalShell>
  );
}

function BulkModal({ action, count, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState("");
  return (
    <ModalShell eyebrow="Bulk HR action" title={action.label} onClose={onClose}>
      <div className="p-5">
        <p className="text-sm text-muted">This will update {count} candidate{count === 1 ? "" : "s"} to <strong>{action.status}</strong>.</p>
        <label className="mt-5 block text-sm font-bold text-ink">Remarks<textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={remarks} onChange={(event) => setRemarks(event.target.value)} /></label>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">Cancel</button>
          <button onClick={() => onConfirm(remarks)} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Confirm</button>
        </div>
      </div>
    </ModalShell>
  );
}

export default function HR() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", roleApplied: "", department: "", source: "", assignedHR: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState({ mode: null, candidate: null });
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [bulkAction, setBulkAction] = useState(null);

  const roleOptions = useMemo(() => uniqueValues(candidates, "roleApplied"), [candidates]);
  const departmentOptions = useMemo(() => uniqueValues(candidates, "department"), [candidates]);
  const hrOptions = useMemo(() => uniqueValues(candidates, "assignedHR"), [candidates]);
  const allVisibleSelected = candidates.length > 0 && candidates.every((candidate) => selectedIds.includes(candidate._id));

  const stats = useMemo(() => {
    const count = (status) => candidates.filter((candidate) => candidate.status === status).length;
    return [["Total Candidates", candidates.length], ["Applied", count("Applied")], ["Shortlisted", count("Shortlisted")], ["Interview Scheduled", count("Interview Scheduled")], ["Selected", count("Selected")], ["Rejected", count("Rejected")]];
  }, [candidates]);

  const loadCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCandidates(filters);
      setCandidates(data.candidates || []);
    } catch (apiError) {
      setCandidates([]);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(loadCandidates, 250);
    return () => clearTimeout(handle);
  }, [filters.search, filters.status, filters.roleApplied, filters.department, filters.source, filters.assignedHR]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const saveCandidate = async (payload) => {
    try {
      if (modal.mode === "edit") {
        await updateCandidate(modal.candidate._id, payload);
        showToast("Candidate updated successfully.");
      } else {
        await createCandidate(payload);
        showToast("Candidate created successfully.");
      }
      setModal({ mode: null, candidate: null });
      await loadCandidates();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const removeCandidate = async (candidate) => {
    if (!window.confirm(`Delete candidate ${candidate.name}?`)) return;
    try {
      await deleteCandidate(candidate._id);
      showToast("Candidate deleted.");
      await loadCandidates();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const changeStatus = async (candidate, status) => {
    try {
      await updateCandidateStatus(candidate._id, status, candidate.remarks || "");
      showToast("Candidate status updated.");
      await loadCandidates();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const saveInterview = async (payload) => {
    try {
      await updateCandidateInterview(interviewCandidate._id, payload);
      showToast("Interview scheduled.");
      setInterviewCandidate(null);
      await loadCandidates();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const confirmBulk = async (remarks) => {
    try {
      await bulkUpdateCandidateStatus(selectedIds, bulkAction.status, remarks);
      showToast(`${selectedIds.length} candidate${selectedIds.length === 1 ? "" : "s"} updated to ${bulkAction.status}.`);
      setSelectedIds([]);
      setBulkAction(null);
      await loadCandidates();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const toggleSelection = (id) => setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const toggleAllVisible = () => setSelectedIds((current) => (allVisibleSelected ? current.filter((id) => !candidates.some((candidate) => candidate._id === id)) : Array.from(new Set([...current, ...candidates.map((candidate) => candidate._id)]))));

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Hiring module</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">HR Candidate Tracking</h1>
          <p className="mt-2 text-muted">Manage hiring applications, interviews, and candidate status</p>
        </div>
        <button onClick={() => setModal({ mode: "add", candidate: null })} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine"><Plus className="h-4 w-4" /> Add Candidate</button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map(([label, value]) => <div key={label} className="rounded-[8px] border border-line bg-white p-5 shadow-card"><p className="text-sm font-semibold text-muted">{label}</p><p className="mt-3 text-3xl font-extrabold text-ink">{value}</p></div>)}
      </div>

      <section className="mt-6 rounded-[8px] border border-line bg-white p-4 shadow-card">
        <div className="grid gap-3 xl:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr_0.9fr_auto]">
          <label className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input className="h-12 w-full rounded-[8px] border border-line bg-cloud pl-11 pr-4 text-sm outline-none focus:border-pine" placeholder="Search name, email, phone, role, or department" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} /></label>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}><option value="">All statuses</option>{CANDIDATE_STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.roleApplied} onChange={(event) => setFilters((current) => ({ ...current, roleApplied: event.target.value }))}><option value="">All roles</option>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.department} onChange={(event) => setFilters((current) => ({ ...current, department: event.target.value }))}><option value="">All departments</option>{departmentOptions.map((department) => <option key={department}>{department}</option>)}</select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))}><option value="">All sources</option>{CANDIDATE_SOURCES.map((source) => <option key={source}>{source}</option>)}</select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.assignedHR} onChange={(event) => setFilters((current) => ({ ...current, assignedHR: event.target.value }))}><option value="">All HR owners</option>{hrOptions.map((hr) => <option key={hr}>{hr}</option>)}</select>
          <button onClick={loadCandidates} className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-line bg-cloud px-4 text-sm font-bold text-ink hover:border-pine"><RefreshCcw className="h-4 w-4" /> Refresh</button>
        </div>
      </section>

      {selectedIds.length > 0 && <section className="sticky top-[88px] z-20 mt-4 flex flex-col gap-3 rounded-[8px] border border-line bg-ink p-4 text-white shadow-soft xl:flex-row xl:items-center xl:justify-between"><p className="font-bold">{selectedIds.length} selected candidate{selectedIds.length === 1 ? "" : "s"}</p><div className="flex flex-wrap gap-2">{bulkActions.map((action) => { const Icon = action.icon; return <button key={action.status} onClick={() => setBulkAction(action)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${action.className}`}><Icon className="h-4 w-4" /> {action.label}</button>; })}<button onClick={() => setSelectedIds([])} className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">Clear selection</button></div></section>}
      {toast && <p className="mt-4 rounded-[8px] border border-line bg-mint px-4 py-3 text-sm font-bold text-pine shadow-card">{toast}</p>}
      {error && <p className="mt-4 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      <section className="mt-6 overflow-hidden rounded-[8px] border border-line bg-white shadow-card">
        {loading ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-pine" /><p className="mt-4 font-bold text-muted">Loading candidates...</p></div></div> : candidates.length === 0 ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint text-pine"><BriefcaseBusiness className="h-6 w-6" /></div><h2 className="mt-4 text-2xl font-black text-ink">No candidates found</h2><p className="mt-2 text-muted">Add your first candidate or adjust filters.</p><button onClick={() => setModal({ mode: "add", candidate: null })} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Add Candidate</button></div></div> : (
          <div className="overflow-x-auto">
            <table className="min-w-[1320px] w-full text-left">
              <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted"><tr><th className="px-5 py-3"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} /></th>{["Candidate Name", "Email", "Phone", "Role Applied", "Department", "Experience", "Source", "Status", "Interview Date", "Assigned HR", "Actions"].map((header) => <th key={header} className="px-5 py-3">{header}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {candidates.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-cloud/70">
                    <td className="px-5 py-4"><input type="checkbox" checked={selectedIds.includes(candidate._id)} onChange={() => toggleSelection(candidate._id)} /></td>
                    <td className="px-5 py-4 font-bold text-ink">{candidate.name}</td>
                    <td className="px-5 py-4 text-sm text-muted">{candidate.email || "Not provided"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">{candidate.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted">{candidate.roleApplied}</td>
                    <td className="px-5 py-4 text-sm text-muted">{candidate.department || "Not provided"}</td>
                    <td className="px-5 py-4 text-sm text-muted">{candidate.experience || "Not provided"}</td>
                    <td className="px-5 py-4 text-sm text-muted">{candidate.source}</td>
                    <td className="px-5 py-4"><select className={`rounded-full border px-3 py-1 text-xs font-black outline-none ${statusStyles[candidate.status] || "border-line bg-cloud text-muted"}`} value={candidate.status} onChange={(event) => changeStatus(candidate, event.target.value)}>{CANDIDATE_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></td>
                    <td className="px-5 py-4 text-sm text-muted">{formatDateTime(candidate.interviewDate)}</td>
                    <td className="px-5 py-4 text-sm text-muted">{candidate.assignedHR || "Unassigned"}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><button onClick={() => setModal({ mode: "view", candidate })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="View candidate"><Eye className="h-4 w-4" /></button><button onClick={() => setModal({ mode: "edit", candidate })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="Edit candidate"><Edit3 className="h-4 w-4" /></button><button onClick={() => setInterviewCandidate(candidate)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="Schedule interview"><CalendarClock className="h-4 w-4" /></button><button onClick={() => removeCandidate(candidate)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100" aria-label="Delete candidate"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal.mode && <CandidateModal mode={modal.mode} candidate={modal.candidate} onClose={() => setModal({ mode: null, candidate: null })} onSave={saveCandidate} />}
      {interviewCandidate && <InterviewModal candidate={interviewCandidate} onClose={() => setInterviewCandidate(null)} onSave={saveInterview} />}
      {bulkAction && <BulkModal action={bulkAction} count={selectedIds.length} onClose={() => setBulkAction(null)} onConfirm={confirmBulk} />}
    </main>
  );
}
