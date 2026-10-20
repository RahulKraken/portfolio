import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/e/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "E · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();

  return (
    <>
      <Nav here="blog" />
      <main className="e-main">
        <h1>Blog</h1>
        {usingSample ? (
          <p className="e-lede">Sample layout. Nothing published yet.</p>
        ) : null}
        <ul className="e-posts">
          {items.map((post) => (
            <li key={post.slug}>
              {post.hasPage ? (
                <Link href="/lab/e/blog/sample">
                  <span className="ph">{post.title}</span>
                </Link>
              ) : (
                <span className="e-post-title ph">{post.title}</span>
              )}
              <p>
                {post.sample ? <span className="ph">{post.date}</span> : post.date}
                {". "}
                {post.sample ? <span className="ph">{post.dek}</span> : post.dek}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
