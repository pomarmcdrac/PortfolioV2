"use client";

import { useState, useEffect } from "react";
import { getExperience, createExperience, deleteExperience } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Calendar, Briefcase, Building } from "lucide-react";
import { useForm } from "react-hook-form";

export default function AdminExperience() {
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Check auth
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
      router.push("/admin");
      return;
    }

    loadData();
  }, [router]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getExperience();
      setExperienceList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta experiencia?")) return;
    const success = await deleteExperience(id);
    if (success) {
      loadData();
    } else {
      alert("Error al eliminar");
    }
  };

  const onSubmit = async (data: any) => {
    // Basic format adjustment if needed by API
    const payload = {
      ...data,
      current: data.endDate === "", // Simple logic for current job
    };

    const success = await createExperience(payload);
    if (success) {
      reset();
      loadData();
    } else {
      alert("Error al crear experiencia");
    }
  };

  if (loading && experienceList.length === 0)
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
        Gestionar Experiencia
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
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            Agregar Nueva
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Puesto / Rol
              </label>
              <input
                {...register("position", { required: true })}
                style={inputStyle}
                placeholder="Ej. Senior Frontend Dev"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Empresa
              </label>
              <input
                {...register("company", { required: true })}
                style={inputStyle}
                placeholder="Ej. Google"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Fecha Inicio
                </label>
                <input
                  {...register("startDate", { required: true })}
                  style={inputStyle}
                  placeholder="Ej. 2022"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Fecha Fin
                </label>
                <input
                  {...register("endDate")}
                  style={inputStyle}
                  placeholder="Ej. 2024 o dejar vacío"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Descripción
              </label>
              <textarea
                {...register("description", { required: true })}
                style={{
                  ...inputStyle,
                  minHeight: "100px",
                  resize: "vertical",
                }}
                placeholder="Logros y responsabilidades..."
              />
            </div>

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
                marginTop: "1rem",
              }}
            >
              <Plus size={20} /> Guardar Experiencia
            </button>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
            Experiencia Actual
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {experienceList.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
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

                <h3
                  style={{ fontSize: "1.2rem", color: "var(--color-primary)" }}
                >
                  {item.position || item.role}
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    margin: "0.5rem 0",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Building size={14} /> {item.company}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Calendar size={14} /> {item.startDate} -{" "}
                    {item.endDate || "Presente"}
                  </span>
                </div>
                <p
                  style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
            {experienceList.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                No hay experiencia registrada.
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "8px",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
  colorScheme: "dark",
};
