import { useEffect, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dashboardUser } from "./dashboardData.js";
import { currentUser } from "../../services/authService.js";
import { globalSearch } from "../../services/searchService.js";

export default function DashboardTopbar({ onMenu }) {
  const UserIcon = dashboardUser.icon;
  const navigate = useNavigate();
  const user = currentUser() || dashboardUser;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    let active = true;
    setSearching(true);
    const handle = window.setTimeout(() => {
      globalSearch(query)
        .then((data) => {
          if (active) setResults(data.results || []);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [query]);

  const openResult = (href) => {
    setQuery("");
    setResults([]);
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[#f6f7f4]/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-white lg:hidden" onClick={onMenu} aria-label="Open sidebar">
          <Menu className="h-5 w-5 text-ink" />
        </button>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm font-medium text-ink outline-none shadow-card placeholder:text-muted focus:border-pine"
            placeholder="Search leads, applications, invoices, reports..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-[8px] border border-line bg-white shadow-soft">
              {searching ? (
                <p className="px-4 py-3 text-sm font-bold text-muted">Searching...</p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-sm font-bold text-muted">No CRM records found.</p>
              ) : (
                results.map((result) => (
                  <button key={`${result.type}-${result.id}`} onClick={() => openResult(result.href)} className="block w-full border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-cloud">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-coral">{result.type}</span>
                    <span className="mt-1 block font-bold text-ink">{result.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{result.subtitle}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button className="hidden h-11 w-11 place-items-center rounded-full border border-line bg-white shadow-card sm:grid" aria-label="Notifications">
          <Bell className="h-4 w-4 text-muted" />
        </button>
        <div className="hidden items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-2 pr-4 shadow-card md:flex">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-mint text-pine">
            <UserIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-black text-ink">{user.name}</p>
            <p className="text-[11px] font-bold text-coral">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
