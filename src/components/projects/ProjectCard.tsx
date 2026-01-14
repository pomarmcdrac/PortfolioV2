import styles from "./ProjectCard.module.css";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
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

        <div className={styles.links}>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
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
            >
              Ver Demo &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
