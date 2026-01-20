"use client";

import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  deleteProject,
  uploadImage,
} from "@/lib/api";
import { Project } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "Frontend",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 0,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proyecto?")) {
      const success = await deleteProject(id);
      if (success) loadProjects();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        setFormData({ ...formData, imageUrl: url });
        alert("Imagen subida con éxito!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologies: formData.technologies.split(",").map((t) => t.trim()),
    };

    const success = await createProject(payload);
    if (success) {
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        longDescription: "",
        category: "Frontend",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        imageUrl: "",
        featured: false,
        order: 0,
      });
      loadProjects();
    } else {
      alert("Error al crear el proyecto");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <h1>Gestión de Proyectos</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/admin/skills"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #444",
              borderRadius: "8px",
            }}
          >
            Skills
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "0.5rem 1.5rem",
              background: "var(--color-primary)",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Nuevo Proyecto
          </button>
        </div>
      </header>

      {loading ? (
        <p>Cargando proyectos...</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{project.title}</h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.9rem",
                    marginTop: "0.4rem",
                  }}
                >
                  {project.category}
                </p>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                style={{
                  background: "#ff4444",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Simplified for logic demonstration */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <motion.form
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onSubmit={handleSubmit}
              style={{
                background: "var(--color-surface)",
                padding: "2rem",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
                display: "grid",
                gap: "1rem",
              }}
            >
              <h2 style={{ marginBottom: "1rem" }}>Nuevo Proyecto</h2>

              <input
                placeholder="Título"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                style={inputStyle}
              />

              <textarea
                placeholder="Descripción corta"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                style={inputStyle}
              />

              <textarea
                placeholder="Descripción larga"
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData({ ...formData, longDescription: e.target.value })
                }
                style={inputStyle}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
                <input
                  placeholder="Tecnologías (separadas por coma)"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <input
                  placeholder="URL GitHub"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  placeholder="URL Live Demo"
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, liveUrl: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  border: "2px dashed rgba(255,255,255,0.1)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <label style={{ cursor: "pointer", display: "block" }}>
                  {formData.imageUrl
                    ? "✅ Imagen subida"
                    : "📁 Subir Imagen (Cloudinary)"}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </label>
                {formData.imageUrl && (
                  <p
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "0.5rem",
                      color: "var(--color-primary)",
                    }}
                  >
                    {formData.imageUrl}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "transparent",
                    border: "1px solid #444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "12px",
                    background: "var(--color-primary)",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Guardar Proyecto
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "12px",
  background: "rgba(0,0,0,0.2)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  fontSize: "0.9rem",
};
