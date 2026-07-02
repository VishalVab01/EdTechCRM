import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "../../components/landing/landingData.js";
import LandingLayout from "./LandingLayout.jsx";
import NotFound from "./NotFound.jsx";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return <NotFound />;

  return (
    <LandingLayout>
      <main className="section-pad">
        <article className="landing-shell max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-pine">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-coral">{post.date} · {post.readTime}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-xl leading-8 text-muted">{post.excerpt}</p>
          <div className="mt-10 space-y-6 rounded-[8px] border border-line bg-white p-8 text-muted shadow-card">
            <p>
              Strong EdTech teams treat every student enquiry as part of a shared operating system. The goal is not only to respond faster, but to preserve context across counselling, applications, billing, and support.
            </p>
            <p>
              A clean CRM helps teams define owners, statuses, next steps, and handoffs. That structure reduces manual chasing and makes performance easier to understand at the end of every day.
            </p>
            <p>
              Start with simple workflows: source, stage, counsellor, application status, payment status, and follow-up date. Once those fields are reliable, reporting becomes a natural outcome instead of a separate weekly task.
            </p>
          </div>
        </article>
      </main>
    </LandingLayout>
  );
}
