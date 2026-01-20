"use client";

import { useEffect, useState } from "react";
import styles from "./TechMarquee.module.css";
import { getSkillsFull } from "@/lib/api";
import Image from "next/image";

interface SkillItem {
  name: string;
  icon?: string;
  id?: string;
}

const staticTechnologies: SkillItem[] = [
  { name: "Flutter" },
  { name: "Next.js 14" },
  { name: "React" },
  { name: "TypeScript" },
  { name: "Node.js" },
  { name: "Firebase" },
  { name: "Dart" },
  { name: "Tailwind CSS" },
  { name: "Docker" },
  { name: "Git" },
  { name: "PostgreSQL" },
  { name: "GraphQL" },
];

export default function TechMarquee() {
  const [skills, setSkills] = useState<SkillItem[]>([]);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await getSkillsFull();
        setSkills(data.length > 0 ? data : staticTechnologies);
      } catch (error) {
        console.warn("API Offline: Usando tecnologías estáticas de respaldo.");
        setSkills(staticTechnologies);
      }
    }
    loadSkills();
  }, []);

  if (skills.length === 0) return null;

  // Para que el scroll infinito se vea bien con pocas skills,
  // repetimos la lista hasta tener al menos 20 elementos.
  const minItems = 20;
  const loopCount = Math.ceil(minItems / skills.length);
  const techList = Array(loopCount * 2)
    .fill(skills)
    .flat();

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {techList.map((skill, index) => (
          <div key={index} className={styles.techItem}>
            {skill.icon ? (
              <img
                src={skill.icon}
                alt={skill.name}
                className={styles.skillIcon}
                loading="lazy"
              />
            ) : (
              <span className={styles.dot}>•</span>
            )}
            <span className={styles.skillName}>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
