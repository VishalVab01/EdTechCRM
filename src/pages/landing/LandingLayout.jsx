import LandingFooter from "../../components/landing/LandingFooter.jsx";
import LandingNavbar from "../../components/landing/LandingNavbar.jsx";

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen bg-cloud text-ink">
      <LandingNavbar />
      {children}
      <LandingFooter />
    </div>
  );
}
