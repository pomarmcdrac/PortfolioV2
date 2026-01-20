"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { sendEmail } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      // Basic client-side sanitization (trimming)
      const sanitizedData = {
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      };

      const success = await sendEmail(sanitizedData);
      if (success) {
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "2rem 0",
              color: "#4ade80",
            }}
          >
            <CheckCircle size={48} />
            <h3 style={{ color: "white" }}>¡Mensaje Enviado!</h3>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
              Gracias por contactarme. Te responderé lo antes posible.
            </p>
            <button
              onClick={() => setStatus("idle")}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "99px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Enviar otro message
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                }}
              >
                Nombre
              </label>
              <input
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "Solo letras y espacios",
                  },
                })}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  border: `1px solid ${
                    errors.name ? "#ff4444" : "rgba(255,255,255,0.1)"
                  }`,
                  color: "white",
                  outline: "none",
                }}
                placeholder="Tu nombre"
              />
              {errors.name && (
                <span style={{ color: "#ff4444", fontSize: "0.8rem" }}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                }}
              >
                Asunto
              </label>
              <input
                {...register("subject", {
                  required: "El asunto es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  border: `1px solid ${
                    errors.subject ? "#ff4444" : "rgba(255,255,255,0.1)"
                  }`,
                  color: "white",
                  outline: "none",
                }}
                placeholder="Motivo del contacto"
              />
              {errors.subject && (
                <span style={{ color: "#ff4444", fontSize: "0.8rem" }}>
                  {errors.subject.message}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                }}
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  border: `1px solid ${
                    errors.email ? "#ff4444" : "rgba(255,255,255,0.1)"
                  }`,
                  color: "white",
                  outline: "none",
                }}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <span style={{ color: "#ff4444", fontSize: "0.8rem" }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                }}
              >
                Mensaje
              </label>
              <textarea
                {...register("message", {
                  required: "El mensaje es obligatorio",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                })}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.2)",
                  border: `1px solid ${
                    errors.message ? "#ff4444" : "rgba(255,255,255,0.1)"
                  }`,
                  color: "white",
                  outline: "none",
                  resize: "vertical",
                }}
                placeholder="Cuéntame sobre tu proyecto..."
              />
              {errors.message && (
                <span style={{ color: "#ff4444", fontSize: "0.8rem" }}>
                  {errors.message.message}
                </span>
              )}
            </div>

            {status === "error" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#ff4444",
                  fontSize: "0.9rem",
                  background: "rgba(255, 68, 68, 0.1)",
                  padding: "0.8rem",
                  borderRadius: "8px",
                }}
              >
                <AlertCircle size={16} /> Error al enviar. Intenta de nuevo.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "1rem",
                borderRadius: "12px",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: status === "loading" ? 0.7 : 1,
                transition: "transform 0.2s",
              }}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send size={20} /> Enviar Mensaje
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
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
