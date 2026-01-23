"use client";

import { Mail, ArrowRight, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ContactForm from "../forms/ContactForm";
import Link from "next/link";

export default function ContactCTA() {
  const { t } = useLanguage();

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
          maxWidth: "700px",
          width: "100%",
          margin: "0 auto",
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
            gap: "2.5rem",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "600px" }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                marginBottom: "1rem",
              }}
            >
              {t.sections.contactTitle}
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.7)",
                marginBottom: "2rem",
              }}
            >
              {t.sections.contactDesc}
            </p>

            <Link
              href="/booking"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <CalendarCheck
                size={18}
                style={{ color: "var(--color-primary)" }}
              />
              {t.sections.contactMeet}
            </Link>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
