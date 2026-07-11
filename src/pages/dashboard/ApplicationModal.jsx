import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { APPLICATION_SOURCES, APPLICATION_STATUSES } from "../../services/applicationService.js";
import { emptyApplicationForm, formatDate } from "./applicationUi.js";

export default function ApplicationModal({ mode, application, onClose, onSave }) {
  const [form, setForm] = useState(emptyApplicationForm);
  const [error, setError] = useState("");
  const isView = mode === "view";

  useEffect(() => {
    setForm(
      application
        ? {
            studentName: application.studentName || "",
            email: application.email || "",
            phone: application.phone || "",
            course: application.course || "",
            qualification: application.qualification || "",
            city: application.city || "",
            applicationSource: application.applicationSource || "Website",
            status: application.status || "Pending",
            assignedReviewer: application.assignedReviewer || "",
            remarks: application.remarks || "",
          }
        : emptyApplicationForm
    );
    setError("");
  }, [application, mode]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!form.studentName.trim() || !form.phone.trim() || !form.course.trim()) {
      setError("Student name, phone, and course are required.");
      return;
    }

    if (form.email && !emailPattern.test(form.email)) {
      setError("Enter a valid email address or leave it blank.");
      return;
    }

    onSave({
      ...form,
      studentName: form.studentName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      course: form.course.trim(),
      qualification: form.qualification.trim(),
      city: form.city.trim(),
      assignedReviewer: form.assignedReviewer.trim(),
      remarks: form.remarks.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[8px] border border-line bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">{isView ? "Application details" : mode === "edit" ? "Edit application" : "Add application"}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{isView ? application?.studentName : "Student application"}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-cloud text-muted hover:text-ink" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isView ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {[
              ["Email", application?.email || "Not provided"],
              ["Phone", application?.phone],
              ["Course", application?.course],
              ["Qualification", application?.qualification || "Not provided"],
              ["City", application?.city || "Not provided"],
              ["Source", application?.applicationSource],
              ["Status", application?.status],
              ["Assigned Reviewer", application?.assignedReviewer || "Unassigned"],
              ["Created", formatDate(application?.createdAt)],
              ["Reviewed At", formatDate(application?.reviewedAt)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[8px] border border-line bg-cloud p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 font-bold text-ink">{value}</p>
              </div>
            ))}
            <div className="sm:col-span-2 rounded-[8px] border border-line bg-cloud p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Documents</p>
              <p className="mt-2 text-sm text-muted">Document upload/review placeholder. Stored document objects will appear here later.</p>
            </div>
            <div className="sm:col-span-2 rounded-[8px] border border-line bg-cloud p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Remarks</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{application?.remarks || "No remarks yet."}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5">
            {error && <p className="mb-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-ink">
                Student Name *
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.studentName} onChange={(event) => updateField("studentName", event.target.value)} />
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
                Course *
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.course} onChange={(event) => updateField("course", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Qualification
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.qualification} onChange={(event) => updateField("qualification", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                City
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
              </label>
              <label className="text-sm font-bold text-ink">
                Application Source
                <select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.applicationSource} onChange={(event) => updateField("applicationSource", event.target.value)}>
                  {APPLICATION_SOURCES.map((source) => (
                    <option key={source}>{source}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-ink">
                Status
                <select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-ink">
                Assigned Reviewer
                <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.assignedReviewer} onChange={(event) => updateField("assignedReviewer", event.target.value)} />
              </label>
              <label className="sm:col-span-2 text-sm font-bold text-ink">
                Remarks
                <textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.remarks} onChange={(event) => updateField("remarks", event.target.value)} />
              </label>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">
                Cancel
              </button>
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
                {mode === "edit" ? "Save changes" : "Create application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
