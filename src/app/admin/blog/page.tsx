"use client";

import { useEffect, useState } from "react";
import { getBlogs, createBlog, deleteBlog } from "@/lib/api";
import { Plus, Trash2, ExternalLink } from "lucide-react";

// Estilos de inputs (reutilizados del estándar)
const baseInputStyle: any = {
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

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: new Date().toISOString().split("T")[0],
    excerpt: "",
    tags: "",
    content: "",
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    const data = await getBlogs();
    setBlogs(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este post?")) {
      const success = await deleteBlog(id);
      if (success) loadBlogs();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      // Auto-generate slug if empty
      slug:
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
    };

    const success = await createBlog(payload);
    if (success) {
      setFormData({
        title: "",
        slug: "",
        date: new Date().toISOString().split("T")[0],
        excerpt: "",
        tags: "",
        content: "",
      });
      loadBlogs();
    } else {
      alert("Error al crear el post");
    }
  };

  if (loading && blogs.length === 0)
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
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Gestionar Blog</h1>

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
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            Escribir Nuevo Post
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1rem" }}
          >
            <input
              placeholder="Título del Post"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              style={baseInputStyle}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <input
                placeholder="Slug (opcional)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                style={baseInputStyle}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                style={baseInputStyle}
              />
            </div>

            <input
              placeholder="Tags (separados por coma)"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              style={baseInputStyle}
            />

            <textarea
              placeholder="Extracto (breve resumen)"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              required
              style={{ ...baseInputStyle, minHeight: "80px" }}
            />

            <textarea
              placeholder="Contenido (Markdown soportado)"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              style={{
                ...baseInputStyle,
                minHeight: "300px",
                fontFamily: "monospace",
              }}
            />

            <button
              type="submit"
              style={{
                background: "var(--color-primary)",
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
              <Plus size={20} /> Publicar Post
            </button>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            Posts Publicados
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {blogs.map((blog) => (
              <div
                key={blog.id || blog.slug}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        color: "var(--color-primary)",
                        margin: 0,
                      }}
                    >
                      {blog.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {blog.date} • {blog.slug}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(blog.id || blog.slug)}
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

                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.9rem",
                    margin: "0.5rem 0",
                    lineHeight: "1.5",
                  }}
                >
                  {blog.excerpt}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  {blog.tags &&
                    blog.tags.map((tag: string) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.75rem",
                          background: "rgba(255,255,255,0.1)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "99px",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                No hay posts publicados.
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
