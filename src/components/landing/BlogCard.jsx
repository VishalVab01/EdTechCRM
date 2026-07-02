import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block rounded-[8px] border border-line bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-coral">{post.date}</p>
        <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pine" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-ink">{post.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>
      <p className="mt-6 text-sm font-bold text-pine">{post.readTime}</p>
    </Link>
  );
}
