import { projects as staticProjects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, ExternalLink, Calendar, Hash } from "lucide-react";
import { getProjectById } from "@/lib/api";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import { translations } from "@/i18n/translations";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const langKey = (cookieStore.get("language")?.value || "es").toUpperCase() as
    | "ES"
    | "EN";
  const t = translations[langKey];

  // Intentar obtener de la API
  let project = await getProjectById(id, langKey.toLowerCase());

  // Fallback a datos estáticos si no se encuentra en la API
  if (!project) {
    project = staticProjects.find((p) => p.id === id) || null;
  }

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-background)",
          color: "var(--color-foreground)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          {t.sections.notFound} 😢
        </h1>
        <Link href="/#projects" className={styles.hoverBackBtn}>
          <ArrowLeft size={18} /> <span>{t.sections.backToPortfolio}</span>
        </Link>
      </div>
    );
  }

  const isPrivate = (url?: string) =>
    !url || url.toLowerCase() === "privado" || url.toLowerCase() === "null";

  const hasRepo = !isPrivate(project.repoUrl);
  const hasLive = !isPrivate(project.liveUrl);
  const hasLinks = hasRepo || hasLive;

  // Prioritize longDescription, fallback to description
  const content = project.longDescription || project.description;

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      {/* Navigation */}
      <nav>
        <Link href="/#projects" className={styles.hoverBackBtn}>
          <ArrowLeft size={18} /> <span>{t.sections.backToProjects}</span>
        </Link>
      </nav>

      {/* Hero Content */}
      <section>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "8px",
              background: "rgba(0, 242, 255, 0.1)",
              color: "#00f2ff",
              fontSize: "0.9rem",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Hash size={14} />
            {project.category}
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: "800",
            lineHeight: "1.1",
            marginBottom: "1.5rem",
            background: "linear-gradient(to right, #fff, #a5a5a5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {project.title}
        </h1>
      </section>

      {/* Project Image */}
      {project.imageUrl && (
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "1rem",
            width: "100%",
          }}
          className={styles.galleryContainer}
        >
          {[project.imageUrl].map((img, index) => (
            <div
              key={index}
              style={{
                minWidth: "85%",
                maxWidth: "800px",
                aspectRatio: "16/9",
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                scrollSnapAlign: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}
            >
              <Image
                src={img}
                alt={`${project.title} screenshot ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}

      {/* Content Grid */}
      <div className={styles.projectGrid}>
        {/* Left Column: Description */}
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              marginBottom: "1.5rem",
              color: "white",
            }}
          >
            {t.sections.aboutProject}
          </h3>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "rgba(255,255,255,0.8)",
              whiteSpace: "pre-line",
            }}
          >
            {content}
          </p>
        </div>

        {/* Right Column: Sidebar */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {/* Tech Stack */}
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: "600",
              }}
            >
              {t.sections.technologies}
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.1)",
                    fontSize: "0.85rem",
                    color: "white",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links Actions */}
          {hasLinks && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {hasLive && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.8rem",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "var(--color-primary)",
                    color: "black",
                    fontWeight: "bold",
                    textDecoration: "none",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <ExternalLink size={20} />
                  {t.sections.viewDemo}
                </a>
              )}
              {hasRepo && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.8rem",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontWeight: "bold",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "background 0.2s ease",
                  }}
                >
                  <Github size={20} />
                  {t.sections.viewCode}
                </a>
              )}
            </div>
          )}

          {/* Confidential Project Notice */}
          {!hasLinks && project.isConfidential && (
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                🔒 {t.sections.ndaProject}
              </h4>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {langKey === "ES"
                  ? "Este proyecto fue desarrollado bajo un acuerdo de confidencialidad (NDA). Por razones de privacidad del cliente, no puedo compartir enlaces públicos ni código fuente."
                  : "This project was developed under a non-disclosure agreement (NDA). For client privacy reasons, I cannot share public links or source code."}
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
