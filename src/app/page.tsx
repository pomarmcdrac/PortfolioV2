"use client";

import { useState } from "react";
import {
  projects as staticProjects,
  ProjectCategory,
  Project,
} from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import TechMarquee from "@/components/sections/TechMarquee";
import { getProjects, getAbout } from "@/lib/api";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import Services from "@/components/sections/Services";
import ContactCTA from "@/components/sections/ContactCTA";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function Home() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApiOffline, setIsApiOffline] = useState(false);
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [projectsData, aboutInfo] = await Promise.all([
          getProjects(language),
          getAbout(language),
        ]);

        // Si la API responde (incluso si está vacía), confiamos en ella
        setProjectsList(projectsData);
        setAboutData(aboutInfo);
        setIsApiOffline(false);
      } catch (error) {
        // Solo si falla la conexión usamos los estáticos como respaldo
        console.warn("API Offline: Usando datos estáticos como respaldo.");
        setProjectsList(staticProjects);
        setIsApiOffline(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [language]);

  const categories: (ProjectCategory | "All")[] = [
    "All",
    "Full Stack",
    "Mobile",
    "Frontend",
    "Backend",
  ];

  const filteredProjects = projectsList.filter((project) =>
    filter === "All" ? true : project.category === filter,
  );

  return (
    <main style={{ maxWidth: "100%", overflowX: "hidden" }}>
      {/* Hero Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
          gap: "2.5rem",
          textAlign: "center",
          paddingTop: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 0 40px -10px var(--color-primary-glow)",
              border: "2px solid rgba(56, 189, 248, 0.3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="McDrac Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <span
            style={{
              color: "var(--color-secondary)",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            {aboutData?.subtitle || t.hero.subtitle}
          </span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              background:
                "linear-gradient(to right, #fff, var(--color-primary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            {aboutData?.title || t.hero.title}
          </h1>
          <p
            style={{
              maxWidth: "650px",
              margin: "0 auto",
              fontSize: "1.25rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {aboutData?.description ? (
              aboutData.description
            ) : (
              <>
                {t.hero.description}{" "}
                <strong style={{ color: "var(--color-primary)" }}>
                  Flutter
                </strong>{" "}
                &{" "}
                <strong style={{ color: "var(--color-secondary)" }}>
                  Next.js
                </strong>
                .
              </>
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <a
            href="#projects"
            style={{
              padding: "1rem 2rem",
              background: "var(--color-primary)",
              color: "black",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              boxShadow: "0 10px 20px -5px var(--color-primary-glow)",
              fontSize: "1rem",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {t.hero.ctaProject}
          </a>
          <a
            href="/booking"
            style={{
              padding: "1rem 2rem",
              background: "white",
              color: "black",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              boxShadow: "0 10px 20px -5px rgba(255,255,255,0.2)",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <CalendarCheck size={18} /> {t.hero.ctaMeet}
          </a>
          <a
            href="/blog"
            style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              borderRadius: "99px",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              backdropFilter: "blur(10px)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            {t.hero.ctaBlog}
          </a>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <div style={{ margin: "4rem 0" }}>
        <TechMarquee />
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        {/* Services Section */}
        <Services />

        {/* Projects Grid Section */}
        <section id="projects" style={{ paddingTop: "8rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontSize: "2.5rem",
                marginBottom: "3rem",
                textAlign: "center",
              }}
            >
              {t.sections.projectsTitle}
            </h2>

            {/* Filters */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "3rem",
                flexWrap: "wrap",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: "0.6rem 1.5rem",
                    borderRadius: "99px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    background:
                      filter === cat
                        ? "var(--color-primary)"
                        : "var(--color-surface)",
                    color: filter === cat ? "white" : "var(--color-foreground)",
                    boxShadow:
                      filter === cat
                        ? "0 4px 15px -3px var(--color-primary-glow)"
                        : "none",
                  }}
                >
                  {cat === "All" ? t.sections.filterAll : cat}
                </button>
              ))}
            </div>

            <motion.div
              layout
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "2.5rem",
                marginTop: "2rem",
              }}
            >
              <AnimatePresence>
                {filteredProjects.length > 0
                  ? filteredProjects.map((project) => (
                      <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))
                  : !loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          gridColumn: "1 / -1",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "1.5rem",
                          padding: "6rem 2rem",
                          background: "rgba(255, 255, 255, 0.03)",
                          borderRadius: "24px",
                          border: "1px dashed rgba(255, 255, 255, 0.1)",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "rgba(0, 242, 255, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#00f2ff",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <Rocket size={32} />
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: "1.2rem",
                              color: "white",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {t.sections.noProjects}
                          </h3>
                          <p style={{ color: "rgba(255,255,255,0.5)" }}>
                            {isApiOffline
                              ? "Sincronizando con el servidor de respaldo..."
                              : "Nuevas soluciones tecnológicas en proceso de creación."}
                          </p>
                        </div>
                      </motion.div>
                    )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section style={{ marginTop: "8rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            {t.sections.experienceTitle}
          </h2>
          <ExperienceTimeline />
        </section>

        {/* Contact CTA */}
        <div id="contact" style={{ marginTop: "4rem" }}>
          <ContactCTA />
        </div>
      </div>
    </main>
  );
}
