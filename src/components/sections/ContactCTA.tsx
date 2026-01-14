import { Mail, ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "6rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(rgba(5, 16, 32, 0.8), rgba(5, 16, 32, 0.8)), linear-gradient(to right, var(--color-primary), var(--color-secondary))",
          padding: "1px",
          borderRadius: "24px",
          boxShadow: "0 0 40px -10px var(--color-primary-glow)",
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "23px",
            padding: "4rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            ¿Tienes un proyecto en mente?
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "600px",
            }}
          >
            Estoy disponible para nuevos retos. Ya sea una app móvil, un sitio
            web o asesoría técnica, hablemos.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <a
              href="mailto:tuemail@ejemplo.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                background: "var(--color-primary)",
                color: "white",
                borderRadius: "99px",
                fontWeight: "700",
                fontSize: "1.1rem",
                boxShadow: "0 4px 20px rgba(56, 189, 248, 0.4)",
              }}
            >
              <Mail size={20} />
              Envíame un correo
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: "99px",
                fontWeight: "600",
                fontSize: "1.1rem",
                transition: "background 0.2s",
              }}
            >
              Conectar en LinkedIn <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
