import { Link } from "react-router-dom";
import LandingLayout from "./LandingLayout.jsx";

export default function NotFound() {
  return (
    <LandingLayout>
      <main className="grid min-h-[68vh] place-items-center px-6 py-20 text-center">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">404</p>
          <h1 className="mt-4 text-5xl font-extrabold text-ink">Page not found</h1>
          <p className="mt-4 text-muted">The page you are looking for is not part of the public EdTech CRM site.</p>
          <Link to="/" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-pine">
            Back to home
          </Link>
        </div>
      </main>
    </LandingLayout>
  );
}
