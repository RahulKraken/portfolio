import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/f/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "F · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();

  return (
    <>
      <Nav here="blog" />
      <main className="f-main">
        <header className="f-intro">
          <h1>Blog</h1>
          {usingSample ? (
            <p>Sample layout. Nothing published yet.</p>
          ) : null}
        </header>
        <ul className="f-posts">
          {items.map((post) => (
            <li key={post.slug}>
              {post.hasPage ? (
                <Link href="/lab/f/blog/sample">
                  <span className="ph">{post.title}</span>
                </Link>
              ) : (
                <span className="ph">{post.title}</span>
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
