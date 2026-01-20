"use client";

import { useEffect, useState } from "react";
import styles from "./ExperienceTimeline.module.css";
import {
  experiences as staticExperience,
  ExperienceItem,
} from "@/data/experience";
import { getExperience } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function ExperienceTimeline() {
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function loadExperience() {
      setLoading(true);
      try {
        const data = await getExperience(language);
        setExperienceList(data);
      } catch (error) {
        console.warn("API Offline: Usando trayectoria estática de respaldo.");
        setExperienceList(staticExperience);
      } finally {
        setLoading(false);
      }
    }
    loadExperience();
  }, [language]);

  return (
    <div className={styles.timelineContainer}>
      {experienceList.length > 0
        ? experienceList.map((item) => (
            <div key={item.id} className={styles.timelineItem}>
              <div className={styles.dot} />
              <h3 className={styles.role}>{item.role}</h3>
              <div className={styles.company}>{item.company}</div>
              <div className={styles.period}>{item.period}</div>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))
        : !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "4rem 2rem",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "20px",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(0, 242, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#00f2ff",
                }}
              >
                <Briefcase size={24} />
              </div>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "1.1rem",
                }}
              >
                {t.sections.noExperience}
              </p>
            </motion.div>
          )}
    </div>
  );
}
