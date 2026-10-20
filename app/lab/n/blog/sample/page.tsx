import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/n/Nav";
import { sampleBody, samplePosts } from "@/lib/lab/blog";

const post = samplePosts[0];

export const metadata: Metadata = {
  title: "N · Sample post",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div data-n="paper">
      <Nav here="blog" />
      <article className="n-page">
        <p>
          <Link href="/lab/n/blog">Blog</Link>
        </p>
        <h1>
          <span className="ph">{post.title}</span>
        </h1>
        <p className="n-note">
          <span className="ph">{post.date}</span>
        </p>
        {sampleBody
          .filter((para) => para !== "Sample text. Not his writing.")
          .map((para) =>
            para.startsWith("[") ? (
              <p key={para}>
                <span className="ph">{para}</span>
              </p>
            ) : (
              <p key={para}>{para}</p>
            ),
          )}
      </article>
    </div>
  );
}
