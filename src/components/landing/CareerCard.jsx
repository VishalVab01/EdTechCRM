import { MapPin } from "lucide-react";

export default function CareerCard({ job }) {
  return (
    <div className="flex flex-col gap-5 rounded-[8px] border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-bold text-ink">{job.title}</h3>
        <div className="mt-2 flex flex-wrap gap-3 text-sm font-medium text-muted">
          <span>{job.type}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
        </div>
      </div>
      <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Apply now</button>
    </div>
  );
}
