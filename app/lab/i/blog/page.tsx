import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/i/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "I · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();
  const [featured, ...rest] = items;

  return (
    <>
      <Nav here="blog" />
      <main className="i-main">
        <h1>Blog</h1>
        {usingSample ? (
          <p>Two placeholders so an empty archive can be judged. Not his writing.</p>
        ) : null}
        {featured ? (
          <p className="i-feature">
            {featured.hasPage ? (
              <Link href="/lab/i/blog/sample">
                <span className="ph">{featured.title}</span>
              </Link>
            ) : (
              <span className="ph">{featured.title}</span>
            )}
            <span>
              {featured.sample ? <span className="ph">{featured.date}</span> : featured.date}
              {". "}
              {featured.sample ? <span className="ph">{featured.dek}</span> : featured.dek}
            </span>
          </p>
        ) : null}
        <ul className="i-archive">
          {rest.map((post) => (
            <li key={post.slug}>
              <span>
                {post.sample ? <span className="ph">{post.date}</span> : post.date}
              </span>
              {post.hasPage ? (
                <Link href="/lab/i/blog/sample">
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
