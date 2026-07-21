"use client";

import { useState, useEffect } from "react";
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Calendar, Building, Pencil, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const formatRawDate = (dateStr: string) => {
  if (!dateStr || !/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
  const [year, month] = dateStr.split('-');
  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

export default function AdminExperience() {
  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const isCurrentJob = watch("current");

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
      const data = await getExperience("raw");
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

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue("position", item.position);
    setValue("positionEs", item.positionEs || item.position);
    setValue("company", item.company);
    setValue("startDate", item.startDate);
    setValue("endDate", item.endDate || "");
    setValue("description", item.description);
    setValue("descriptionEs", item.descriptionEs || item.description);
    setValue("current", item.current || false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const payload = {
      ...data,
      current: !!data.current,
      endDate: data.current ? null : (data.endDate || null),
    };

    let success = false;
    try {
      if (editingId) {
        success = await updateExperience(editingId, payload);
      } else {
        success = await createExperience(payload);
      }

      if (success) {
        resetForm();
        loadData();
        alert(editingId ? "Actualizado correctamente" : "Creado correctamente");
      } else {
        alert("Error al guardar experiencia");
      }
    } catch (error) {
      console.error(error);
      alert("Error al guardar experiencia");
    } finally {
      setSubmitting(false);
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
              {editingId ? "Editar Experiencia" : "Agregar Nueva"}
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
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
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
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Puesto / Rol (EN)
                </label>
                <input
                  {...register("position", { required: true })}
                  style={inputStyle}
                  placeholder="Ej. Senior Frontend Dev"
                  maxLength={100}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Puesto / Rol (ES)
                </label>
                <input
                  {...register("positionEs", { required: true })}
                  style={inputStyle}
                  placeholder="Ej. Desarrollador Frontend Senior"
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.8rem",
                  opacity: 0.7,
                }}
              >
                Empresa
              </label>
              <input
                {...register("company", { required: true })}
                style={inputStyle}
                placeholder="Ej. Google"
                maxLength={100}
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
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Fecha Inicio (YYYY-MM)
                </label>
                <input
                  {...register("startDate", { required: true, pattern: /^\d{4}-\d{2}$/ })}
                  style={inputStyle}
                  placeholder="Ej. 2022-01"
                  maxLength={7}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Fecha Fin (YYYY-MM)
                </label>
                <input
                  {...register("endDate", { required: !isCurrentJob, pattern: isCurrentJob ? undefined : /^\d{4}-\d{2}$/ })}
                  disabled={isCurrentJob}
                  style={{ ...inputStyle, opacity: isCurrentJob ? 0.5 : 1 }}
                  placeholder={isCurrentJob ? "Trabajo actual" : "Ej. 2024-01"}
                  maxLength={7}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.2rem",
              }}
            >
              <input
                type="checkbox"
                id="currentJobCheckbox"
                {...register("current")}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <label
                htmlFor="currentJobCheckbox"
                style={{
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  opacity: 0.8,
                  userSelect: "none",
                }}
              >
                Este es mi trabajo actual (oculta fecha de fin)
              </label>
            </div>

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
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Descripción (EN)
                </label>
                <textarea
                  {...register("description", { required: true })}
                  style={{
                    ...inputStyle,
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                  placeholder="Achievements..."
                  maxLength={1000}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  Descripción (ES)
                </label>
                <textarea
                  {...register("descriptionEs", { required: true })}
                  style={{
                    ...inputStyle,
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                  placeholder="Logros..."
                  maxLength={1000}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: editingId
                  ? "var(--color-secondary)"
                  : "var(--color-primary)",
                color: "black",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1rem",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : editingId ? (
                <Pencil size={20} />
              ) : (
                <Plus size={20} />
              )}{" "}
              {submitting ? "Guardando..." : editingId ? "Actualizar" : "Guardar"} Experiencia
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
                  border: `1px solid ${editingId === item.id ? "var(--color-secondary)" : "rgba(255,255,255,0.1)"}`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "none",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

                <h3
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--color-primary)",
                    paddingRight: "5rem",
                  }}
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
                    <Calendar size={14} /> {formatRawDate(item.startDate)} -{" "}
                    {item.current || !item.endDate ? "Actual" : formatRawDate(item.endDate)}
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
      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
