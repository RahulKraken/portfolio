import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/e/Nav";
import { sampleBody, samplePosts } from "@/lib/lab/blog";

const post = samplePosts[0];

export const metadata: Metadata = {
  title: "E · Sample post",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="blog" />
      <article className="e-main e-read">
        <p>
          <Link href="/lab/e/blog">Blog</Link>
        </p>
        <h1>
          <span className="ph">{post.title}</span>
        </h1>
        <p className="e-lede">
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
