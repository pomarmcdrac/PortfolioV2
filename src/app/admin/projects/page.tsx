"use client";

import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
} from "@/lib/api";
import { Project } from "@/data/projects";
import { Plus, Trash2, Github, ExternalLink, Pencil } from "lucide-react";

import { useRouter } from "next/navigation";

const baseInputStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "12px",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  fontSize: "0.9rem",
  outline: "none",
  colorScheme: "dark",
};

const selectStyle: any = {
  ...baseInputStyle,
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
  backgroundSize: "1em",
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    titleEs: "",
    description: "",
    descriptionEs: "",
    longDescription: "",
    longDescriptionEs: "",
    category: "Frontend",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    order: 0,
  });

  useEffect(() => {
    // Check auth
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
      router.push("/admin");
      return;
    }

    loadProjects();
  }, [router]);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await getProjects("es"); // Admin default to 'es' for list
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proyecto?")) {
      const success = await deleteProject(id);
      if (success) loadProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      titleEs: (project as any).titleEs || project.title,
      description: project.description,
      descriptionEs: (project as any).descriptionEs || project.description,
      longDescription: project.longDescription || "",
      longDescriptionEs:
        (project as any).longDescriptionEs || project.longDescription || "",
      category: project.category,
      technologies: project.techStack.join(", "),
      githubUrl: project.repoUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrl: project.imageUrl || "",
      featured: project.featured || false,
      order: project.order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      titleEs: "",
      description: "",
      descriptionEs: "",
      longDescription: "",
      longDescriptionEs: "",
      category: "Frontend",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      featured: false,
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      order: Number(formData.order),
      technologies: formData.technologies.split(",").map((t) => t.trim()),
    };

    let success = false;
    if (editingId) {
      success = await updateProject(editingId, payload);
    } else {
      success = await createProject(payload);
    }

    if (success) {
      resetForm();
      loadProjects();
      alert(editingId ? "Proyecto actualizado" : "Proyecto creado");
    } else {
      alert("Error al guardar el proyecto");
    }
  };

  if (loading && projects.length === 0)
    return <div style={{ padding: "2rem", color: "white" }}>Cargando...</div>;

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>
        Gestionar Proyectos
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "2rem",
        }}
        className="admin-grid"
      >
        {/* Formulario */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "1.5rem",
            borderRadius: "16px",
            height: "fit-content",
            position: "sticky",
            top: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>
              {editingId ? "Editar Proyecto" : "Agregar Nuevo Proyecto"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Cancelar
              </button>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Título (EN)
                </label>
                <input
                  placeholder="Título (EN)"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  maxLength={100}
                  style={baseInputStyle}
                />
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Título (ES)
                </label>
                <input
                  placeholder="Título (ES)"
                  value={formData.titleEs}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEs: e.target.value })
                  }
                  required
                  maxLength={100}
                  style={baseInputStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Short Desc (EN)
                </label>
                <textarea
                  placeholder="Short Description (EN)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  maxLength={300}
                  style={baseInputStyle}
                />
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Desc Corta (ES)
                </label>
                <textarea
                  placeholder="Descripción corta (ES)"
                  value={formData.descriptionEs}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionEs: e.target.value })
                  }
                  required
                  maxLength={300}
                  style={baseInputStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Long Desc (EN)
                </label>
                <textarea
                  placeholder="Long Description (EN)"
                  value={formData.longDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longDescription: e.target.value,
                    })
                  }
                  maxLength={5000}
                  style={{ ...baseInputStyle, minHeight: "80px" }}
                />
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Desc Larga (ES)
                </label>
                <textarea
                  placeholder="Descripción larga (ES)"
                  value={formData.longDescriptionEs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longDescriptionEs: e.target.value,
                    })
                  }
                  maxLength={5000}
                  style={{ ...baseInputStyle, minHeight: "80px" }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  style={selectStyle}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Tecnologías (separadas por coma)
                </label>
                <input
                  placeholder="React, Node, etc."
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  maxLength={200}
                  style={baseInputStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  GitHub URL
                </label>
                <input
                  placeholder="GitHub URL"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  maxLength={255}
                  style={baseInputStyle}
                />
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Live URL
                </label>
                <input
                  placeholder="Live URL"
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, liveUrl: e.target.value })
                  }
                  maxLength={255}
                  style={baseInputStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                alignItems: "flex-end",
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                  Orden
                </label>
                <input
                  type="number"
                  placeholder="Orden"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  style={baseInputStyle}
                />
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  paddingBottom: "0.8rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                Destacado (Featured)
              </label>
            </div>

            <div
              style={{
                border: "2px dashed rgba(255,255,255,0.1)",
                padding: "1rem",
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
            </div>

            <button
              type="submit"
              style={{
                background: editingId
                  ? "var(--color-secondary)"
                  : "var(--color-primary)",
                color: "black",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              {editingId ? <Pencil size={20} /> : <Plus size={20} />}{" "}
              {editingId ? "Actualizar Proyecto" : "Guardar Proyecto"}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            Proyectos Existentes
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: `1px solid ${editingId === project.id ? "var(--color-secondary)" : "rgba(255,255,255,0.1)"}`,
                  position: "relative",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        color: "var(--color-primary)",
                        margin: 0,
                      }}
                    >
                      {project.title}
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(project)}
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "white",
                          border: "none",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Pencil size={14} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        style={{
                          background: "rgba(255,0,0,0.1)",
                          color: "#ff4444",
                          border: "none",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      background: "rgba(255,255,255,0.1)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "99px",
                      marginTop: "0.3rem",
                      display: "inline-block",
                    }}
                  >
                    {project.category}
                  </span>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.9rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    {project.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          color: "white",
                        }}
                      >
                        <Github size={14} /> Repo
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          color: "white",
                        }}
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                No hay proyectos registrados.
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
