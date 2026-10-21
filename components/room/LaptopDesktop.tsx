"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { craft } from "@/lib/craft";
import { site } from "@/lib/site";

export default function LaptopDesktop({
  work = false,
  onBack,
}: {
  work?: boolean;
  onBack: () => void;
}) {
  const [project, setProject] = useState<number | null>(null);
  return (
    <section
      className={`computer-desktop ${work ? "computer-work" : ""}`}
      aria-label={work ? "Work computer" : "Personal computer"}
    >
      <header className="computer-toolbar">
        <button
          className="computer-exit"
          onClick={onBack}
          aria-label="Leave laptop and return to the desk"
        >
          ←
        </button>
        <span className="computer-owner">
          rahul<span>/</span>
          {work ? "work" : "personal"}
        </span>
        <a href={`mailto:${site.email}`} aria-label="Email Rahul">
          ↗
        </a>
      </header>
      <div className="computer-body">
        <aside className="computer-sidebar">
          <span className="computer-section-label">
            {work ? "ENGINEERING" : "ON THIS COMPUTER"}
          </span>
          <button
            className={project === null ? "is-current" : ""}
            onClick={() => setProject(null)}
          >
            {work ? "Overview" : "All projects"}
            <span>↗</span>
          </button>
          {!work &&
            products.map((p, i) => (
              <button
                key={p.id}
                className={project === i ? "is-current" : ""}
                onClick={() => setProject(i)}
              >
                {p.name}
                <span>↗</span>
              </button>
            ))}
          <div className="computer-sidebar-bottom">
            <span>Made out of curiosity.</span>
            <span>Always something on the bench.</span>
          </div>
        </aside>
        <div className="computer-content" tabIndex={0}>
          {work ? (
            <>
              <span className="computer-section-label">THE DAY JOB</span>
              <h2>
                Systems, from
                <br />
                the inside out.
              </h2>
              <p className="computer-intro">
                Runtime security for AI agents. Kernel events, endpoint agents,
                tracing, and detection.
              </p>
              <div className="computer-work-list">
                {craft.map((c, i) => (
                  <article key={c.id}>
                    <span>0{i + 1}</span>
                    <div>
                      <h3>{c.label}</h3>
                      <p>{c.line}</p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : project === null ? (
            <>
              <span className="computer-section-label">PERSONAL PROJECTS</span>
              <h2>
                Things I wanted
                <br />
                to exist.
              </h2>
              <p className="computer-intro">
                A few ongoing experiments in software, music, training, and
                motorcycles.
              </p>
              <div className="computer-projects">
                {products.map((p, i) => (
                  <button key={p.id} onClick={() => setProject(i)}>
                    <span
                      className={`desktop-project-icon desktop-project-icon-${i}`}
                    >
                      {["≈", "◒", "⌁", "?"][i]}
                    </span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.status}</small>
                    </span>
                    <b>↗</b>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                className="computer-breadcrumb"
                onClick={() => setProject(null)}
              >
                Projects /
              </button>
              <span
                className={`desktop-project-icon desktop-project-icon-${project}`}
              >
                {["≈", "◒", "⌁", "?"][project]}
              </span>
              <h2>{products[project].name}</h2>
              <p className="computer-project-line">{products[project].line}</p>
              <span className="computer-status">
                <i />
                {products[project].status}
              </span>
              {products[project].href && (
                <a
                  className="computer-link"
                  href={products[project].href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open project ↗
                </a>
              )}
              <p className="computer-detail-note">
                Part of the personal workshop.
              </p>
            </>
          )}
        </div>
      </div>
      <footer className="computer-statusbar">
        <span>{work ? "MacBook Pro" : "MacBook Air"}</span>
        <span>Rahul Kumar</span>
      </footer>
    </section>
  );
}
