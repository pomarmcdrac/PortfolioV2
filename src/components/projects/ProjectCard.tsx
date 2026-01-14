import styles from "./ProjectCard.module.css";
import { Project } from "@/data/projects";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className={styles.card}
      style={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      {/* Enlace principal que cubre toda la tarjeta */}
      <Link
        href={`/project/${project.id}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          borderRadius: "inherit",
        }}
        aria-label={`Ver detalles de ${project.title}`}
      />

      <div
        className={styles.content}
        style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}
      >
        <span className={styles.category}>{project.category}</span>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>

        <div className={styles.techStack}>
          {project.techStack.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.links} style={{ pointerEvents: "auto" }}>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              style={{ position: "relative", zIndex: 10 }}
            >
              GitHub &rarr;
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              style={{ position: "relative", zIndex: 10 }}
            >
              Ver Demo &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
