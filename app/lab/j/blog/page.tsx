import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/j/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "J · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();

  return (
    <>
      <Nav here="blog" />
      <main className="j-page">
        <h1>Blog</h1>
        {usingSample ? (
          <p>Two placeholders so an empty archive can be judged. Not his writing.</p>
        ) : null}
        <ul className="j-archive">
          {items.map((post) => (
            <li key={post.slug}>
              <span>
                {post.sample ? <span className="ph">{post.date}</span> : post.date}
              </span>
              {post.hasPage ? (
                <Link href="/lab/j/blog/sample">
                  <span className="ph">{post.title}</span>
                </Link>
              ) : (
                <span className="ph">{post.title}</span>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
