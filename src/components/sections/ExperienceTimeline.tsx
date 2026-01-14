import styles from "./ExperienceTimeline.module.css";
import { experiences } from "@/data/experience";

export default function ExperienceTimeline() {
  return (
    <div className={styles.timelineContainer}>
      {experiences.map((item) => (
        <div key={item.id} className={styles.timelineItem}>
          <div className={styles.dot} />
          <h3 className={styles.role}>{item.role}</h3>
          <div className={styles.company}>{item.company}</div>
          <div className={styles.period}>{item.period}</div>
          <p className={styles.description}>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
