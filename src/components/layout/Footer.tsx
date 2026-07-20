"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const isEs = language === "ES";

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        marginTop: "auto",
        padding: "2rem 1.5rem",
        background: "rgba(5, 16, 32, 0.8)",
        backdropFilter: "blur(10px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          alignItems: "center",
        }}
      >
        {/* Social Links */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a
            href="https://github.com/pomarmcdrac"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              opacity: 0.7,
              transition: "opacity 0.2s",
              color: "var(--color-foreground)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/omaramorales"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              opacity: 0.7,
              transition: "opacity 0.2s",
              color: "var(--color-foreground)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            LinkedIn
          </a>
        </div>

        {/* Legal Links */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontSize: "0.85rem",
          }}
        >
          <Link
            href="/privacy"
            style={{
              color: "var(--color-foreground)",
              opacity: 0.55,
              textDecoration: "none",
              transition: "opacity 0.2s, color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.color = "var(--color-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "0.55";
              e.currentTarget.style.color = "var(--color-foreground)";
            }}
          >
            {isEs ? "Política de Privacidad" : "Privacy Policy"}
          </Link>
          <Link
            href="/terms"
            style={{
              color: "var(--color-foreground)",
              opacity: 0.55,
              textDecoration: "none",
              transition: "opacity 0.2s, color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.color = "var(--color-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "0.55";
              e.currentTarget.style.color = "var(--color-foreground)";
            }}
          >
            {isEs ? "Condiciones del Servicio" : "Terms of Service"}
          </Link>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
          &copy; {currentYear} Omar Morales. Built with Next.js & Flutter Soul.
        </p>
      </div>
    </footer>
  );
}
