"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => {
    const newLang = language === "ES" ? "EN" : "ES";
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggle}
      style={{
        position: "fixed",
        top: "2rem",
        right: "2rem",
        zIndex: 50,
        background: "rgba(5, 16, 32, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "0.5rem 1rem",
        borderRadius: "99px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Globe size={16} />
      {language}
    </button>
  );
}
