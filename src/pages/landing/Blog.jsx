import BlogCard from "../../components/landing/BlogCard.jsx";
import SectionHeader from "../../components/landing/SectionHeader.jsx";
import { blogPosts } from "../../components/landing/landingData.js";
import LandingLayout from "./LandingLayout.jsx";

export default function Blog() {
  return (
    <LandingLayout>
      <main className="section-pad">
        <div className="landing-shell">
          <SectionHeader
            eyebrow="Blog"
            title="Ideas for better EdTech operations"
            text="Practical notes on leads, applications, enrollment pipelines, billing, and team workflows."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
    </LandingLayout>
  );
}
