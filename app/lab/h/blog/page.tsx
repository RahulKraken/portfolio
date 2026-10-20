import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/h/Nav";
import { labPosts } from "@/lib/lab/blog";

export const metadata: Metadata = {
  title: "H · Blog",
  robots: { index: false, follow: false },
};

export default function Page() {
  const { items, usingSample } = labPosts();

  return (
    <>
      <Nav here="blog" />
      <main className="h-main">
        <h1>Blog</h1>
        {usingSample ? (
          <p className="h-lede">
            Two placeholders so an empty archive can be judged. Hover a title.
          </p>
        ) : null}
        <ul className="h-titles">
          {items.map((post) => {
            const inner = (
              <>
                <span className="h-year">
                  {post.sample ? <span className="ph">{post.year}</span> : post.year}
                </span>
                <span className="ph">{post.title}</span>
                <span className="h-dek">
                  {post.sample ? <span className="ph">{post.dek}</span> : post.dek}
                </span>
              </>
            );
            return (
              <li key={post.slug}>
                {post.hasPage ? (
                  <Link href="/lab/h/blog/sample">{inner}</Link>
                ) : (
                  <span className="h-dead">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
