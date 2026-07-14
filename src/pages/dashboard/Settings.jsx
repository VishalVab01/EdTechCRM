import { useEffect, useState } from "react";
import { BellRing, Building2, CheckCircle2, Lock, Save, UsersRound } from "lucide-react";
import { createUser, getUsers } from "../../services/authService.js";
import { getWorkspaceSettings, updateWorkspaceSettings } from "../../services/settingsService.js";

const defaultSettings = {
  instituteName: "EdTech CRM Workspace",
  defaultCounselor: "Nisha",
  timezone: "Asia/Kolkata",
  currency: "INR",
  leadAutoAssign: true,
  emailNotifications: true,
  dailyDigest: true,
  applicationAlerts: true,
};

const accessRows = [
  ["Super Admin", "Full access to dashboard, billing, reports, settings, and deletion controls."],
  ["Counsellor", "Sales leads, applications, follow-ups, and student notes."],
  ["Reviewer", "Application review queues, bulk review, and admissions status updates."],
  ["Finance", "Billing, accounting, invoice payments, and revenue reports."],
  ["HR", "Candidate tracking, interviews, and hiring pipeline updates."],
];

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "Counsellor" });
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const update = (field, value) => setSettings((current) => ({ ...current, [field]: value }));

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const [settingsData, usersData] = await Promise.all([getWorkspaceSettings(), getUsers().catch(() => ({ users: [] }))]);
      setSettings({ ...defaultSettings, ...(settingsData.settings || {}) });
      setUsers(usersData.users || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    try {
      const data = await updateWorkspaceSettings(settings);
      setSettings({ ...defaultSettings, ...(data.settings || {}) });
      showToast("Workspace settings saved.");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const addUser = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createUser(userForm);
      setUserForm({ name: "", email: "", password: "", role: "Counsellor" });
      showToast("Team member created.");
      await loadSettings();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Settings</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Workspace Settings</h1>
          <p className="mt-2 text-muted">Configure CRM defaults, notifications, and role access for the MVP workspace.</p>
        </div>
        <div className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-pine shadow-card">Database-backed settings</div>
      </div>

      {toast && <p className="mt-5 rounded-[8px] border border-line bg-mint px-4 py-3 text-sm font-bold text-pine shadow-card">{toast}</p>}
      {error && <p className="mt-5 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
      {loading && <p className="mt-5 rounded-[8px] border border-line bg-white px-4 py-3 text-sm font-bold text-muted shadow-card">Loading workspace settings...</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <form onSubmit={saveSettings} className="rounded-[8px] border border-line bg-white p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-mint text-pine">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-ink">Institute Defaults</h2>
              <p className="text-sm text-muted">These preferences shape CRM forms and workspace display.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-ink">
              Institute Name
              <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={settings.instituteName} onChange={(event) => update("instituteName", event.target.value)} />
            </label>
            <label className="text-sm font-bold text-ink">
              Default Counselor
              <input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={settings.defaultCounselor} onChange={(event) => update("defaultCounselor", event.target.value)} />
            </label>
            <label className="text-sm font-bold text-ink">
              Timezone
              <select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={settings.timezone} onChange={(event) => update("timezone", event.target.value)}>
                <option>Asia/Kolkata</option>
                <option>Asia/Dubai</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
              </select>
            </label>
            <label className="text-sm font-bold text-ink">
              Currency
              <select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={settings.currency} onChange={(event) => update("currency", event.target.value)}>
                <option>INR</option>
                <option>USD</option>
                <option>AED</option>
                <option>GBP</option>
              </select>
            </label>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-coral" />
              <h2 className="text-lg font-black text-ink">Automation & Alerts</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {[
                ["leadAutoAssign", "Auto-assign new leads to the default counselor"],
                ["emailNotifications", "Send email notifications for important CRM changes"],
                ["dailyDigest", "Send a daily admissions and finance digest"],
                ["applicationAlerts", "Alert reviewers when applications need attention"],
              ].map(([field, label]) => (
                <label key={field} className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-cloud p-4">
                  <span className="text-sm font-bold text-ink">{label}</span>
                  <input type="checkbox" className="h-5 w-5 accent-pine" checked={settings[field]} onChange={(event) => update(field, event.target.checked)} />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine">
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-mint text-pine">
                <UsersRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-ink">Team Members</h2>
                <p className="text-sm text-muted">Create users for role-based CRM access.</p>
              </div>
            </div>
            <form onSubmit={addUser} className="mt-5 grid gap-3">
              <input className="rounded-[8px] border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-pine" placeholder="Name" value={userForm.name} onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))} />
              <input type="email" className="rounded-[8px] border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-pine" placeholder="Email" value={userForm.email} onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} />
              <input type="password" className="rounded-[8px] border border-line bg-cloud px-4 py-3 text-sm outline-none focus:border-pine" placeholder="Temporary password" value={userForm.password} onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))} />
              <select className="rounded-[8px] border border-line bg-cloud px-4 py-3 text-sm font-semibold outline-none focus:border-pine" value={userForm.role} onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}>
                {accessRows.map(([role]) => <option key={role}>{role}</option>)}
              </select>
              <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Create User</button>
            </form>
            <div className="mt-5 space-y-2">
              {users.length === 0 ? (
                <p className="rounded-[8px] bg-cloud p-3 text-sm font-semibold text-muted">Only Super Admin can view team members.</p>
              ) : (
                users.map((user) => (
                  <div key={user._id || user.id} className="flex items-center justify-between gap-3 rounded-[8px] bg-cloud p-3">
                    <div>
                      <p className="text-sm font-black text-ink">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-coral">{user.role}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-cloud text-ink">
                <UsersRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-ink">Role Access Matrix</h2>
                <p className="text-sm text-muted">Planned access groups for the protected CRM.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {accessRows.map(([role, description]) => (
                <div key={role} className="rounded-[8px] border border-line bg-cloud p-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-coral" />
                    <p className="font-black text-ink">{role}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-pine" />
              <h2 className="text-lg font-black text-ink">MVP Readiness</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {["CRM-only app routing", "Protected dashboard route", "Sales, Applications, HR, Billing connected", "Accounting, Reports, Settings shell completed"].map((item) => (
                <p key={item} className="rounded-[8px] bg-mint px-4 py-3 text-sm font-bold text-pine">{item}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
