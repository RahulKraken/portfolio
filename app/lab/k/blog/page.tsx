import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/k/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "K · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();

  return (
    <div data-k="paper">
      <Nav here="blog" />
      <main className="k-page">
        <h1>Blog</h1>
        {usingSample ? (
          <p>Two placeholders so an empty archive can be judged. Not his writing.</p>
        ) : null}
        <ol className="k-archive">
          {items.map((post) => (
            <li key={post.slug}>
              <span className="k-year">
                {post.sample ? <span className="ph">{post.year}</span> : post.year}
              </span>
              {post.hasPage ? (
                <Link href="/lab/k/blog/sample">
                  <span className="ph">{post.title}</span>
                </Link>
              ) : (
                <span className="ph">{post.title}</span>
              )}
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
