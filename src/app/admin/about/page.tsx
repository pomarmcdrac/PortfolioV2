"use client";

import { useState, useEffect } from "react";
import { getAbout, updateAbout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Save, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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
      const data = await getAbout();
      if (data) {
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("title", data.title);
        setValue("titleEs", data.titleEs);
        setValue("bio", data.bio);
        setValue("bioEs", data.bioEs);
        setValue("longBio", data.longBio);
        setValue("longBioEs", data.longBioEs);
        setValue("phone", data.phone);
        setValue("location", data.location);
        setValue("resumeUrl", data.resumeUrl);
        setValue("avatar", data.avatar);
        setValue("availableForWork", data.availableForWork);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: any) => {
    setSaving(true);
    const success = await updateAbout(data);
    if (success) {
      alert("Información actualizada correctamente");
    } else {
      alert("Error al actualizar");
    }
    setSaving(false);
  };

  if (loading)
    return <div style={{ padding: "2rem", color: "white" }}>Cargando...</div>;

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            padding: "0.8rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
          }}
        >
          <User size={24} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Editar Sobre Mí</h1>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "2rem",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Nombre Completo
              </label>
              <input
                {...register("name", { required: true })}
                style={inputStyle}
                placeholder="Ej. Omar Morales"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Email de Contacto
              </label>
              <input
                {...register("email", { required: true })}
                style={inputStyle}
                placeholder="Ej. omar@example.com"
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
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Biografía Corta (EN)
              </label>
              <input
                {...register("bio", { required: true })}
                style={inputStyle}
                placeholder="Ej. Passioned full stack developer..."
                maxLength={150}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Biografía Corta (ES)
              </label>
              <input
                {...register("bioEs", { required: true })}
                style={inputStyle}
                placeholder="Ej. Desarrollador full stack apasionado..."
                maxLength={150}
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
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Título Principal (EN)
              </label>
              <input
                {...register("title", { required: true })}
                style={{
                  ...inputStyle,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
                placeholder="Ej. Creating digital experiences..."
                maxLength={100}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Título Principal (ES)
              </label>
              <input
                {...register("titleEs", { required: true })}
                style={{
                  ...inputStyle,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
                placeholder="Ej. Creando experiencias digitales..."
                maxLength={100}
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
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Biografía Larga (EN)
              </label>
              <textarea
                {...register("longBio", { required: true })}
                style={{
                  ...inputStyle,
                  minHeight: "200px",
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
                placeholder="Write your long biography in English..."
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Biografía Larga (ES)
              </label>
              <textarea
                {...register("longBioEs", { required: true })}
                style={{
                  ...inputStyle,
                  minHeight: "200px",
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
                placeholder="Escribe tu biografía larga en español..."
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Teléfono
              </label>
              <input {...register("phone")} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Ubicación
              </label>
              <input {...register("location")} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                URL CV
              </label>
              <input {...register("resumeUrl")} style={inputStyle} />
            </div>
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
                URL Avatar
              </label>
              <input {...register("avatar")} style={inputStyle} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                {...register("availableForWork")}
                id="availableForWork"
              />
              <label htmlFor="availableForWork">Disponible para trabajar</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: "var(--color-primary)",
              color: "black",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              marginTop: "1rem",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save size={20} /> Guardar Cambios
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx global>{`
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
  padding: "1rem",
  borderRadius: "12px",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
  transition: "border 0.2s",
  colorScheme: "dark",
};
