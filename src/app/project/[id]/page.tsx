// Tip: En Next.js 15, params es una Promise que debes esperar (await).
// Esto es nuevo y confunde a mucha gente, ¡así que atento!

import { projects } from "@/data/projects";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Desempaquetamos el ID de la URL
  const { id } = await params;

  // ---------------------------------------------------------
  // TU MISIÓN EMPIEZA AQUÍ
  // ---------------------------------------------------------

  // Ejercicio: Encuentra el proyecto en el array 'projects' que coincida con este 'id'.
  // const project = ...

  // Por ahora, usaremos datos falsos para que no rompa.
  // Cuando resuelvas el ejercicio, borra esto y usa el proyecto real.
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Proyecto no encontrado 😢</h1>
        <Link
          href="/"
          style={{ color: "var(--color-primary)", marginTop: "1rem" }}
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        minHeight: "100vh",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "3rem",
          color: "rgba(255,255,255,0.6)",
          transition: "color 0.2s",
        }}
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1
        style={{
          fontSize: "3rem",
          marginTop: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {project.title}
      </h1>

      <h4
        style={{
          color: "var(--color-secondary)",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {project.category}
      </h4>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        {project.techStack.map((tech) => (
          <span
            key={tech}
            style={{
              padding: "0.3rem 1rem",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.1)",
              fontSize: "0.9rem",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      <p
        style={{
          fontSize: "1.2rem",
          lineHeight: "1.8",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {project.longDescription}
      </p>

      {/* 
         RETO EXTRA:
         Aquí podrías añadir más detalles si modificaras 'src/data/projects.ts' 
         para incluir un campo 'longDescription' o 'challenges'.
      */}

      <div
        style={{
          marginTop: "4rem",
          padding: "2rem",
          background: "var(--color-surface)",
          borderRadius: "16px",
        }}
      >
        <h3>Links del Proyecto</h3>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              style={{ color: "var(--color-primary)" }}
            >
              GitHub Repo -&gt;
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              style={{ color: "var(--color-primary)" }}
            >
              Ver Demo en Vivo -&gt;
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
