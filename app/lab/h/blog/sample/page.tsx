import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/h/Nav";
import { sampleBody, samplePosts } from "@/lib/lab/blog";

const post = samplePosts[0];

export const metadata: Metadata = {
  title: "H · Sample post",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="blog" />
      <article className="h-main h-read">
        <p>
          <Link href="/lab/h/blog">Blog</Link>
        </p>
        <h1>
          <span className="h-year">
            <span className="ph">{post.year}</span>
          </span>
          <span className="ph">{post.title}</span>
        </h1>
        <p>
          <span className="ph">{post.date}</span>
          . Sample post. Not his writing.
        </p>
        {sampleBody.map((para) =>
          para.startsWith("[") ? (
            <p key={para}>
              <span className="ph">{para}</span>
            </p>
          ) : (
            <p key={para}>{para}</p>
          ),
        )}
      </article>
    </>
  );
}
