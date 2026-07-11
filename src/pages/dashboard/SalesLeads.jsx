import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Eye, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";
import {
  createLead,
  deleteLead,
  getLeads,
  LEAD_SOURCES,
  LEAD_STATUSES,
  updateLead,
  updateLeadNotes,
  updateLeadStatus,
} from "../../services/leadService.js";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  courseInterested: "",
  source: "Website",
  status: "New",
  assignedCounselor: "",
  followUpDate: "",
  notes: "",
};

const statusStyles = {
  New: "bg-blue-50 text-blue-700 border-blue-100",
  Contacted: "bg-amber-50 text-amber-700 border-amber-100",
  "Demo Scheduled": "bg-purple-50 text-purple-700 border-purple-100",
  Converted: "bg-mint text-pine border-mint",
  Lost: "bg-rose-50 text-rose-700 border-rose-100",
};

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function LeadModal({ mode, lead, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const isView = mode === "view";

  useEffect(() => {
    setForm(
      lead
        ? {
            name: lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            courseInterested: lead.courseInterested || "",
            source: lead.source || "Website",
            status: lead.status || "New",
            assignedCounselor: lead.assignedCounselor || "",
            followUpDate: toDateInput(lead.followUpDate),
            notes: lead.notes || "",
          }
        : emptyForm
    );
    setError("");
  }, [lead, mode]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!form.name.trim() || !form.phone.trim() || !form.courseInterested.trim()) {
      setError("Name, phone, and course interested are required.");
      return;
    }

    if (form.email && !emailPattern.test(form.email)) {
      setError("Enter a valid email address or leave it blank.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      courseInterested: form.courseInterested.trim(),
      assignedCounselor: form.assignedCounselor.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[8px] border border-line bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">{isView ? "Lead details" : mode === "edit" ? "Edit lead" : "Add lead"}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{isView ? lead?.name : "Sales lead"}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-cloud text-muted hover:text-ink" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isView ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {[
              ["Email", lead?.email || "Not provided"],
              ["Phone", lead?.phone],
              ["Course Interested", lead?.courseInterested],
              ["Source", lead?.source],
              ["Status", lead?.status],
              ["Assigned Counselor", lead?.assignedCounselor || "Unassigned"],
              ["Follow-up Date", formatDate(lead?.followUpDate)],
              ["Created", formatDate(lead?.createdAt)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[8px] border border-line bg-cloud p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 font-bold text-ink">{value}</p>
              </div>
            ))}
            <div className="sm:col-span-2 rounded-[8px] border border-line bg-cloud p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{lead?.notes || "No notes yet."}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5">
            {error && <p className="mb-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-ink">
                Name *
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Email
                <input type="email" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Phone *
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Course Interested *
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.courseInterested} onChange={(event) => updateField("courseInterested", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Source
                <select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.source} onChange={(event) => updateField("source", event.target.value)}>
                  {LEAD_SOURCES.map((source) => (
                    <option key={source}>{source}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-ink">
                Status
                <select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  {LEAD_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-ink">
                Assigned Counselor
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.assignedCounselor} onChange={(event) => updateField("assignedCounselor", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Follow-up Date
                <input type="date" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.followUpDate} onChange={(event) => updateField("followUpDate", event.target.value)} />
              </label>
              <label className="sm:col-span-2 text-sm font-bold text-ink">
                Notes
                <textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
              </label>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">
                Cancel
              </button>
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
                {mode === "edit" ? "Save changes" : "Create lead"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SalesLeads() {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", source: "", assignedCounselor: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState({ mode: null, lead: null });
  const [actionLoading, setActionLoading] = useState(false);

  const counselorOptions = useMemo(() => {
    return Array.from(new Set(leads.map((lead) => lead.assignedCounselor).filter(Boolean))).sort();
  }, [leads]);

  const stats = useMemo(() => {
    const count = (status) => leads.filter((lead) => lead.status === status).length;
    return [
      ["Total Leads", leads.length],
      ["New Leads", count("New")],
      ["Demo Scheduled", count("Demo Scheduled")],
      ["Converted", count("Converted")],
      ["Lost", count("Lost")],
    ];
  }, [leads]);

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeads(filters);
      setLeads(data.leads || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(loadLeads, 250);
    return () => clearTimeout(handle);
  }, [filters.search, filters.status, filters.source, filters.assignedCounselor]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const saveLead = async (payload) => {
    setActionLoading(true);
    try {
      if (modal.mode === "edit") {
        await updateLead(modal.lead._id, payload);
        showToast("Lead updated successfully.");
      } else {
        await createLead(payload);
        showToast("Lead created successfully.");
      }
      setModal({ mode: null, lead: null });
      await loadLeads();
    } catch (apiError) {
      showToast(apiError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const removeLead = async (lead) => {
    if (!window.confirm(`Delete lead ${lead.name}?`)) return;
    try {
      await deleteLead(lead._id);
      showToast("Lead deleted.");
      await loadLeads();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const changeStatus = async (lead, status) => {
    try {
      await updateLeadStatus(lead._id, status);
      showToast("Lead status updated.");
      await loadLeads();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const appendQuickNote = async (lead) => {
    const note = window.prompt("Add/update lead notes", lead.notes || "");
    if (note === null) return;
    try {
      await updateLeadNotes(lead._id, note);
      showToast("Lead notes updated.");
      await loadLeads();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">CRM module</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Sales Leads</h1>
          <p className="mt-2 text-muted">Track enquiries, follow-ups, demos, and conversions</p>
        </div>
        <button onClick={() => setModal({ mode: "add", lead: null })} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-[8px] border border-line bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-muted">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-[8px] border border-line bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="h-12 w-full rounded-[8px] border border-line bg-cloud pl-11 pr-4 text-sm outline-none focus:border-pine"
              placeholder="Search by name, email, phone, or course"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold text-ink outline-none focus:border-pine" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold text-ink outline-none focus:border-pine" value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value }))}>
            <option value="">All sources</option>
            {LEAD_SOURCES.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold text-ink outline-none focus:border-pine" value={filters.assignedCounselor} onChange={(event) => setFilters((current) => ({ ...current, assignedCounselor: event.target.value }))}>
            <option value="">All counselors</option>
            {counselorOptions.map((counselor) => (
              <option key={counselor}>{counselor}</option>
            ))}
          </select>
          <button onClick={loadLeads} className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-line bg-cloud px-4 text-sm font-bold text-ink hover:border-pine">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </section>

      {toast && <p className="mt-4 rounded-[8px] border border-line bg-mint px-4 py-3 text-sm font-bold text-pine shadow-card">{toast}</p>}
      {error && <p className="mt-4 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      <section className="mt-6 overflow-hidden rounded-[8px] border border-line bg-white shadow-card">
        {loading ? (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-pine" />
              <p className="mt-4 font-bold text-muted">Loading leads...</p>
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint text-pine">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-ink">No leads found</h2>
              <p className="mt-2 text-muted">Add your first lead or adjust the current filters.</p>
              <button onClick={() => setModal({ mode: "add", lead: null })} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
                Add Lead
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left">
              <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted">
                <tr>
                  {["Lead name", "Email", "Phone", "Course Interested", "Source", "Status", "Assigned Counselor", "Follow-up Date", "Actions"].map((header) => (
                    <th key={header} className="px-5 py-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-cloud/70">
                    <td className="px-5 py-4 font-bold text-ink">{lead.name}</td>
                    <td className="px-5 py-4 text-sm text-muted">{lead.email || "Not provided"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">{lead.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted">{lead.courseInterested}</td>
                    <td className="px-5 py-4 text-sm text-muted">{lead.source}</td>
                    <td className="px-5 py-4">
                      <select
                        className={`rounded-full border px-3 py-1 text-xs font-black outline-none ${statusStyles[lead.status] || "border-line bg-cloud text-muted"}`}
                        value={lead.status}
                        onChange={(event) => changeStatus(lead, event.target.value)}
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted">{lead.assignedCounselor || "Unassigned"}</td>
                    <td className="px-5 py-4 text-sm text-muted">{formatDate(lead.followUpDate)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal({ mode: "view", lead })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="View lead">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setModal({ mode: "edit", lead })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="Edit lead">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => appendQuickNote(lead)} className="rounded-[8px] border border-line bg-white px-3 py-2 text-xs font-bold text-muted hover:text-ink">
                          Notes
                        </button>
                        <button onClick={() => removeLead(lead)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100" aria-label="Delete lead">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal.mode && <LeadModal mode={modal.mode} lead={modal.lead} onClose={() => !actionLoading && setModal({ mode: null, lead: null })} onSave={saveLead} />}
    </main>
  );
}
