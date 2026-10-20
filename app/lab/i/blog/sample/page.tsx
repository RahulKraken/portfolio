import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/app/lab/i/Nav";
import { ProductMini } from "@/app/lab/i/Toys";
import { sampleBody, samplePosts, sampleSidenote } from "@/lib/lab/blog";

const post = samplePosts[0];

export const metadata: Metadata = {
  title: "I · Sample post",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Nav here="blog" />
      <article className="i-main i-read">
        <p>
          <Link href="/lab/i/blog">Blog</Link>
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
            <p key={para} className="i-has-note">
              {para}{" "}
              <ProductMini />
              <small className="i-sidenote">
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
