import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/g/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "G · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();

  return (
    <>
      <Nav here="blog" />
      <main className="g-page">
        <h1>Blog</h1>
        {usingSample ? (
          <p>Two placeholders so an empty archive can be judged. Not his writing.</p>
        ) : null}
        <ol className="g-archive">
          {items.map((post) => (
            <li key={post.slug}>
              <span className="g-year">
                {post.sample ? <span className="ph">{post.year}</span> : post.year}
              </span>
              {post.hasPage ? (
                <Link href="/lab/g/blog/sample">
                  <span className="ph">{post.title}</span>
                </Link>
              ) : (
                <span className="ph">{post.title}</span>
              )}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
