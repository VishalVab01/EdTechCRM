import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, PauseCircle, RefreshCcw, Search, X, XCircle } from "lucide-react";
import { applicationStatusStyles, uniqueValues } from "./applicationUi.js";
import { APPLICATION_SOURCES, APPLICATION_STATUSES, bulkUpdateApplicationStatus, getApplications } from "../../services/applicationService.js";

const bulkActions = [
  { label: "Bulk Approve", status: "Approved", icon: CheckCircle2, className: "bg-pine text-white hover:bg-ink" },
  { label: "Bulk Reject", status: "Rejected", icon: XCircle, className: "bg-rose-600 text-white hover:bg-rose-700" },
  { label: "Mark Under Review", status: "Under Review", icon: RefreshCcw, className: "bg-blue-600 text-white hover:bg-blue-700" },
  { label: "Put On Hold", status: "On Hold", icon: PauseCircle, className: "bg-slate-700 text-white hover:bg-slate-800" },
];

function BulkActionModal({ action, count, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState("");

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-[8px] border border-line bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Bulk action</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ink">{action.label}</h2>
            <p className="mt-2 text-sm text-muted">
              This will update {count} selected application{count === 1 ? "" : "s"} to <strong>{action.status}</strong>.
            </p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-cloud text-muted hover:text-ink" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mt-5 block text-sm font-bold text-ink">
          Remarks
          <textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
        </label>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">
            Cancel
          </button>
          <button onClick={() => onConfirm(remarks)} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BulkReview() {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ search: "", course: "", status: "", applicationSource: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalAction, setModalAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const courseOptions = useMemo(() => uniqueValues(applications, "course"), [applications]);
  const allVisibleSelected = applications.length > 0 && applications.every((application) => selectedIds.includes(application._id));

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getApplications(filters);
      setApplications(data.applications || []);
    } catch (apiError) {
      setApplications([]);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(loadApplications, 250);
    return () => clearTimeout(handle);
  }, [filters.search, filters.course, filters.status, filters.applicationSource]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const toggleSelection = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !applications.some((application) => application._id === id)));
    } else {
      setSelectedIds((current) => Array.from(new Set([...current, ...applications.map((application) => application._id)])));
    }
  };

  const confirmBulkAction = async (remarks) => {
    try {
      await bulkUpdateApplicationStatus(selectedIds, modalAction.status, remarks);
      showToast(`${selectedIds.length} application${selectedIds.length === 1 ? "" : "s"} updated to ${modalAction.status}.`);
      setSelectedIds([]);
      setModalAction(null);
      await loadApplications();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Admissions module</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Bulk Application Review</h1>
        <p className="mt-2 text-muted">Select multiple student applications and update them together</p>
      </div>

      <section className="mt-6 rounded-[8px] border border-line bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="h-12 w-full rounded-[8px] border border-line bg-cloud pl-11 pr-4 text-sm outline-none focus:border-pine"
              placeholder="Search applications"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.course} onChange={(event) => setFilters((current) => ({ ...current, course: event.target.value }))}>
            <option value="">All courses</option>
            {courseOptions.map((course) => (
              <option key={course}>{course}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.applicationSource} onChange={(event) => setFilters((current) => ({ ...current, applicationSource: event.target.value }))}>
            <option value="">All sources</option>
            {APPLICATION_SOURCES.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
          <button onClick={loadApplications} className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-line bg-cloud px-4 text-sm font-bold text-ink hover:border-pine">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </section>

      {selectedIds.length > 0 && (
        <section className="sticky top-[88px] z-20 mt-4 flex flex-col gap-3 rounded-[8px] border border-line bg-ink p-4 text-white shadow-soft xl:flex-row xl:items-center xl:justify-between">
          <p className="font-bold">{selectedIds.length} selected application{selectedIds.length === 1 ? "" : "s"}</p>
          <div className="flex flex-wrap gap-2">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.status} onClick={() => setModalAction(action)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${action.className}`}>
                  <Icon className="h-4 w-4" /> {action.label}
                </button>
              );
            })}
            <button onClick={() => setSelectedIds([])} className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
              Clear selection
            </button>
          </div>
        </section>
      )}

      {toast && <p className="mt-4 rounded-[8px] border border-line bg-mint px-4 py-3 text-sm font-bold text-pine shadow-card">{toast}</p>}
      {error && <p className="mt-4 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      <section className="mt-6 overflow-hidden rounded-[8px] border border-line bg-white shadow-card">
        {loading ? (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-pine" />
              <p className="mt-4 font-bold text-muted">Loading applications...</p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <h2 className="text-2xl font-black text-ink">No applications to review</h2>
              <p className="mt-2 text-muted">Create applications first or adjust filters.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left">
              <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-5 py-3">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
                  </th>
                  {["Student Name", "Phone", "Course", "City", "Status", "Source", "Assigned Reviewer"].map((header) => (
                    <th key={header} className="px-5 py-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-cloud/70">
                    <td className="px-5 py-4">
                      <input type="checkbox" checked={selectedIds.includes(application._id)} onChange={() => toggleSelection(application._id)} />
                    </td>
                    <td className="px-5 py-4 font-bold text-ink">{application.studentName}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">{application.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.course}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.city || "Not provided"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-black ${applicationStatusStyles[application.status] || "border-line bg-cloud text-muted"}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted">{application.applicationSource}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.assignedReviewer || "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalAction && <BulkActionModal action={modalAction} count={selectedIds.length} onClose={() => setModalAction(null)} onConfirm={confirmBulkAction} />}
    </main>
  );
}
