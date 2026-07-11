import { ArrowRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { moduleCopy } from "../../components/dashboard/dashboardData.js";

export default function DashboardModule() {
  const { module } = useParams();
  const content = moduleCopy[module] || {
    title: "Dashboard Module",
    text: "This protected CRM module is ready for the next implementation phase.",
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[8px] border border-line bg-white p-8 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">CRM module</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">{content.title}</h1>
        <p className="mt-4 max-w-2xl text-muted">{content.text}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Workflow setup", "Team ownership", "Reporting view"].map((item) => (
            <div key={item} className="rounded-[8px] border border-line bg-cloud p-5">
              <h2 className="font-black text-ink">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Dummy CRM surface reserved for backend-connected functionality.</p>
            </div>
          ))}
        </div>
        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
          Configure later <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
