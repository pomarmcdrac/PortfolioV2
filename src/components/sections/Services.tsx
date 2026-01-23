"use client";

import styles from "./Services.module.css";
import { Smartphone, Globe, Server, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      title: t.services.fullstack.title,
      description: t.services.fullstack.desc,
      icon: <Globe size={28} />,
      features: [
        "Landing Pages Premium",
        "Apps SaaS",
        "E-commerce",
        "Admin Panels",
      ], // Podrías traducir esto también si quisieras
    },
    {
      title: t.services.mobile.title,
      description: t.services.mobile.desc,
      icon: <Smartphone size={28} />,
      features: [
        "UI/UX Nativo",
        "Animaciones",
        "iOS & Android",
        "Store Publish",
      ],
    },
    {
      title: t.services.backend.title,
      description: t.services.backend.desc,
      icon: <Server size={28} />,
      features: [
        "APIs REST/GraphQL",
        "SQL/NoSQL",
        "Auth Security",
        "Cloud Scale",
      ],
    },
  ];

  return (
    <section className={styles.servicesContainer}>
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        {t.services.title}
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.6)",
          maxWidth: "600px",
          margin: "0 auto",
          fontSize: "1.1rem",
        }}
      >
        {t.services.subtitle}
      </p>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconWrapper}>{service.icon}</div>
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>

            <ul className={styles.featureList}>
              {service.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <CheckCircle2 className={styles.checkIcon} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}
      >
        <Link
          href="/booking"
          style={{
            padding: "1rem 2.5rem",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "99px",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            transition: "all 0.3s ease",
            fontSize: "1.1rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 0 30px -10px var(--color-primary-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Globe size={20} style={{ color: "var(--color-primary)" }} />
          {t.services.cta}
        </Link>
      </div>
    </section>
  );
}
