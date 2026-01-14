import styles from "./TechMarquee.module.css";

const technologies = [
  "Flutter",
  "Next.js 14",
  "React",
  "TypeScript",
  "Node.js",
  "Firebase",
  "Dart",
  "Tailwind CSS",
  "Docker",
  "Git",
  "PostgreSQL",
  "GraphQL",
];

export default function TechMarquee() {
  // Duplicamos la lista para crear el efecto de loop infinito visible
  const techList = [...technologies, ...technologies, ...technologies];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {techList.map((tech, index) => (
          <span key={index} className={styles.techItem}>
            • {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
