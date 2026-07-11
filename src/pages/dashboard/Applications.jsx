import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Edit3, Eye, Plus, RefreshCcw, Search, Trash2 } from "lucide-react";
import ApplicationModal from "./ApplicationModal.jsx";
import { applicationStatusStyles, formatDate, uniqueValues } from "./applicationUi.js";
import {
  APPLICATION_SOURCES,
  APPLICATION_STATUSES,
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
  updateApplicationStatus,
} from "../../services/applicationService.js";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", course: "", applicationSource: "", assignedReviewer: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState({ mode: null, application: null });

  const courseOptions = useMemo(() => uniqueValues(applications, "course"), [applications]);
  const reviewerOptions = useMemo(() => uniqueValues(applications, "assignedReviewer"), [applications]);

  const stats = useMemo(() => {
    const count = (status) => applications.filter((application) => application.status === status).length;
    return [
      ["Total Applications", applications.length],
      ["Pending", count("Pending")],
      ["Under Review", count("Under Review")],
      ["Approved", count("Approved")],
      ["Rejected", count("Rejected")],
    ];
  }, [applications]);

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
  }, [filters.search, filters.status, filters.course, filters.applicationSource, filters.assignedReviewer]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const saveApplication = async (payload) => {
    try {
      if (modal.mode === "edit") {
        await updateApplication(modal.application._id, payload);
        showToast("Application updated successfully.");
      } else {
        await createApplication(payload);
        showToast("Application created successfully.");
      }
      setModal({ mode: null, application: null });
      await loadApplications();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const removeApplication = async (application) => {
    if (!window.confirm(`Delete application for ${application.studentName}?`)) return;

    try {
      await deleteApplication(application._id);
      showToast("Application deleted.");
      await loadApplications();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const changeStatus = async (application, status) => {
    try {
      await updateApplicationStatus(application._id, status, application.remarks || "");
      showToast("Application status updated.");
      await loadApplications();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Admissions module</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Student Applications</h1>
          <p className="mt-2 text-muted">Review, track, and manage student admission applications</p>
        </div>
        <button onClick={() => setModal({ mode: "add", application: null })} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine">
          <Plus className="h-4 w-4" /> Add Application
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
        <div className="grid gap-3 xl:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.9fr_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="h-12 w-full rounded-[8px] border border-line bg-cloud pl-11 pr-4 text-sm outline-none focus:border-pine"
              placeholder="Search student, email, phone, course, or city"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.course} onChange={(event) => setFilters((current) => ({ ...current, course: event.target.value }))}>
            <option value="">All courses</option>
            {courseOptions.map((course) => (
              <option key={course}>{course}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.applicationSource} onChange={(event) => setFilters((current) => ({ ...current, applicationSource: event.target.value }))}>
            <option value="">All sources</option>
            {APPLICATION_SOURCES.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.assignedReviewer} onChange={(event) => setFilters((current) => ({ ...current, assignedReviewer: event.target.value }))}>
            <option value="">All reviewers</option>
            {reviewerOptions.map((reviewer) => (
              <option key={reviewer}>{reviewer}</option>
            ))}
          </select>
          <button onClick={loadApplications} className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-line bg-cloud px-4 text-sm font-bold text-ink hover:border-pine">
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
              <p className="mt-4 font-bold text-muted">Loading applications...</p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint text-pine">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-ink">No applications found</h2>
              <p className="mt-2 text-muted">Add your first student application or adjust filters.</p>
              <button onClick={() => setModal({ mode: "add", application: null })} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
                Add Application
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full text-left">
              <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted">
                <tr>
                  {["Student Name", "Email", "Phone", "Course", "City", "Source", "Status", "Assigned Reviewer", "Created Date", "Actions"].map((header) => (
                    <th key={header} className="px-5 py-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-cloud/70">
                    <td className="px-5 py-4 font-bold text-ink">{application.studentName}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.email || "Not provided"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">{application.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.course}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.city || "Not provided"}</td>
                    <td className="px-5 py-4 text-sm text-muted">{application.applicationSource}</td>
                    <td className="px-5 py-4">
                      <select
                        className={`rounded-full border px-3 py-1 text-xs font-black outline-none ${applicationStatusStyles[application.status] || "border-line bg-cloud text-muted"}`}
                        value={application.status}
                        onChange={(event) => changeStatus(application, event.target.value)}
                      >
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted">{application.assignedReviewer || "Unassigned"}</td>
                    <td className="px-5 py-4 text-sm text-muted">{formatDate(application.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal({ mode: "view", application })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="View application">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setModal({ mode: "edit", application })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="Edit application">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => removeApplication(application)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100" aria-label="Delete application">
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

      {modal.mode && <ApplicationModal mode={modal.mode} application={modal.application} onClose={() => setModal({ mode: null, application: null })} onSave={saveApplication} />}
    </main>
  );
}
