import type { Metadata } from "next";
import Link from "next/link";
import { Progress } from "@/app/lab/g/Progress";
import { Nav } from "@/app/lab/g/Nav";
import { sampleBody, samplePosts, sampleSidenote } from "@/lib/lab/blog";

const post = samplePosts[0];

export const metadata: Metadata = {
  title: "G · Sample post",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="blog" />
      <Progress />
      <article className="g-page g-read">
        <p>
          <Link href="/lab/g/blog">Blog</Link>
        </p>
        <h1>
          <span className="ph">{post.title}</span>
        </h1>
        <p>
          <span className="ph">{post.date}</span>
          . Sample post. Not his writing.
        </p>
        {sampleBody.map((para, i) =>
          i === 1 ? (
            <p key={para} className="g-has-note">
              {para}
              <small className="g-sidenote">
                <span className="ph">{sampleSidenote}</span>
              </small>
            </p>
          ) : para.startsWith("[") ? (
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
