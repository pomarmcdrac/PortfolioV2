"use client";

import { useEffect, useState } from "react";
import {
  getSkillsFull,
  createSkill,
  deleteSkill,
  uploadImage,
} from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]); // Assuming skills have more than just a name in management
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    loadSkills();
  }, []);

  async function loadSkills() {
    setLoading(true);
    const data = await getSkillsFull();
    setSkills(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta skill?")) {
      const success = await deleteSkill(id);
      if (success) loadSkills();
    }
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
    const success = await createSkill(formData);
    if (success) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        category: "Frontend",
        level: 90,
        icon: "",
        yearsOfExperience: 1,
        order: 0,
      });
      loadSkills();
    } else {
      alert("Error al crear la skill");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
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
        <h1>Gestión de Skills</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/admin/projects"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #444",
              borderRadius: "8px",
            }}
          >
            Proyectos
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "0.5rem 1.5rem",
              background: "var(--color-secondary)",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "black",
            }}
          >
            + Nueva Skill
          </button>
        </div>
      </header>

      {loading ? (
        <p>Cargando skills...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {skills.map((skill) => (
            <div
              key={skill.id}
              style={{
                background: "var(--color-surface)",
                padding: "1.2rem",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {skill.icon && (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    style={{ width: "30px", height: "30px" }}
                  />
                )}
                <h3 style={{ margin: 0, fontSize: "1rem" }}>{skill.name}</h3>
              </div>
              <button
                onClick={() => handleDelete(skill.id)}
                style={{
                  background: "#ff4444",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

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
                maxWidth: "400px",
                display: "grid",
                gap: "1rem",
              }}
            >
              <h2>Nueva Skill</h2>

              <input
                placeholder="Nombre (ej: React)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                style={inputStyle}
              />

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
                  <label style={{ fontSize: "0.8rem", color: "#888" }}>
                    Nivel (0-100)
                  </label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: parseInt(e.target.value),
                      })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "#888" }}>
                    Años Exp.
                  </label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: parseInt(e.target.value),
                      })
                    }
                    style={inputStyle}
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
                  {formData.icon
                    ? "✅ Icono subido"
                    : "📁 Subir Icono (SVG/PNG)"}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    borderRadius: "12px",
                    background: "transparent",
                    border: "1px solid #444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    borderRadius: "12px",
                    background: "var(--color-secondary)",
                    border: "none",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Guardar
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
