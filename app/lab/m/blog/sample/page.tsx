import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/m/Nav";
import { sampleBody, samplePosts } from "@/lib/lab/blog";

const post = samplePosts[0];

export const metadata: Metadata = {
  title: "M · Sample post",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div data-m="paper">
      <Nav here="blog" />
      <article className="m-page m-read">
        <p>
          <Link href="/lab/m/blog">Blog</Link>
        </p>
        <h1>
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
    </div>
  );
}
