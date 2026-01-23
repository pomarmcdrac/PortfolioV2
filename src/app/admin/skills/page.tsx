"use client";

import { useEffect, useState } from "react";
import {
  getSkillsFull,
  createSkill,
  updateSkill,
  deleteSkill,
  uploadImage,
} from "@/lib/api";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: 90,
    icon: "",
    yearsOfExperience: 1,
    order: 0,
  });

  useEffect(() => {
    // Check auth
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
      router.push("/admin");
      return;
    }

    loadSkills();
  }, [router]);

  async function loadSkills() {
    setLoading(true);
    try {
      const data = await getSkillsFull();
      setSkills(data);
    } catch (error) {
      console.error("Error loading skills:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta skill?")) {
      const success = await deleteSkill(id);
      if (success) loadSkills();
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level || 0,
      icon: skill.icon || "",
      yearsOfExperience: skill.yearsOfExperience || 0,
      order: skill.order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Frontend",
      level: 90,
      icon: "",
      yearsOfExperience: 1,
      order: 0,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        setFormData({ ...formData, icon: url });
        alert("Icono subido!");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (editingId) {
      success = await updateSkill(editingId, formData);
    } else {
      success = await createSkill(formData);
    }

    if (success) {
      resetForm();
      loadSkills();
      alert(editingId ? "Actualizado correctamente" : "Creado correctamente");
    } else {
      alert("Error al guardar la skill");
    }
  };

  if (loading && skills.length === 0)
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
        Gestionar Habilidades
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
              {editingId ? "Editar Skill" : "Agregar Nueva Skill"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1rem" }}
          >
            <input
              placeholder="Nombre (ej: React)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              maxLength={50}
              style={baseInputStyle}
            />

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
              <option value="Tools">Tools</option>
            </select>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    color: "#888",
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  Nivel (0-100)
                </label>
                <input
                  type="number"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: parseInt(e.target.value) || 0,
                    })
                  }
                  style={baseInputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    color: "#888",
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  Años Exp.
                </label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: parseInt(e.target.value) || 0,
                    })
                  }
                  style={baseInputStyle}
                />
              </div>
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
                {formData.icon ? "✅ Icono subido" : "📁 Subir Icono (SVG/PNG)"}
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
              {editingId ? "Actualizar" : "Guardar"} Skill
            </button>
          </form>
        </div>

        {/* Lista Grid */}
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            Skills Existentes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {skills.map((skill) => (
              <div
                key={skill.id}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: `1px solid ${editingId === skill.id ? "var(--color-secondary)" : "rgba(255,255,255,0.1)"}`,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0.3rem",
                    right: "0.3rem",
                    display: "flex",
                  }}
                >
                  <button
                    onClick={() => handleEdit(skill)}
                    style={{
                      background: "none",
                      color: "white",
                      border: "none",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    style={{
                      background: "none",
                      color: "#ff4444",
                      border: "none",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {skill.icon ? (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                )}

                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>{skill.name}</h3>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {skill.category}
                  </span>
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div
                style={{
                  padding: "2rem",
                  color: "rgba(255,255,255,0.4)",
                  gridColumn: "1 / -1",
                  textAlign: "center",
                }}
              >
                No hay skills registradas.
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
