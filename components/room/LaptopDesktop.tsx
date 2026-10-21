"use client";

import { Fragment, useRef, useState } from "react";
import { products } from "@/lib/products";
import { resume } from "@/lib/resume";
import { site } from "@/lib/site";

// **figures** in the CV text render as emphasis
function Rich({ text }: { text: string }) {
  return text
    .split("**")
    .map((part, i) =>
      i % 2 ? (
        <strong key={i}>{part}</strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );
}
const sections = [
  ...resume.jobs.map((j) => ({ id: j.company, label: j.company })),
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

export default function LaptopDesktop({
  work = false,
  onBack,
}: {
  work?: boolean;
  onBack: () => void;
}) {
  const [project, setProject] = useState<number | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const jump = (id: string) =>
    content.current
      ?.querySelector(`[data-section="${id}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            {work ? "RÉSUMÉ" : "ON THIS COMPUTER"}
          </span>
          {work ? (
            sections.map((section) => (
              <button key={section.id} onClick={() => jump(section.id)}>
                {section.label}
                <span>↓</span>
              </button>
            ))
          ) : (
            <button
              className={project === null ? "is-current" : ""}
              onClick={() => setProject(null)}
            >
              All projects
              <span>↗</span>
            </button>
          )}
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
        </aside>
        <div className="computer-content" tabIndex={0} ref={content}>
          {work ? (
            <div className="computer-cv">
              <h2>{resume.name}</h2>
              <p className="computer-intro">
                {resume.headline}
                <br />
                {resume.place}
              </p>
              <div className="cv-links">
                <a href={`mailto:${site.email}`}>Email</a>
                {resume.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
              {resume.jobs.map((job) => (
                <section key={job.company} data-section={job.company}>
                  <h3 className="cv-company">
                    {job.company}
                    <span>{job.place}</span>
                  </h3>
                  {job.roles.map((role) => (
                    <div key={role.title} className="cv-role">
                      <p className="cv-role-line">
                        <span>{role.title}</span>
                        <span>{role.dates}</span>
                      </p>
                      <ul>
                        {role.points.map((point) => (
                          <li key={point.label}>
                            <b>{point.label}</b>
                            <p>
                              <Rich text={point.text} />
                              {point.link && (
                                <>
                                  {" "}
                                  <a
                                    href={point.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Read more ↗
                                  </a>
                                </>
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
              <section data-section="skills">
                <h3 className="cv-company">Skills</h3>
                <dl className="cv-skills">
                  {resume.skills.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.items}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section data-section="education">
                <h3 className="cv-company">Education</h3>
                <p className="cv-role-line">
                  <span>{resume.education.degree}</span>
                  <span>{resume.education.dates}</span>
                </p>
                <p className="cv-school">{resume.education.school}</p>
              </section>
            </div>
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
                      <small>{p.kind}</small>
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
              <span className="computer-status">{products[project].kind}</span>
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
