import styles from "./Services.module.css";
import { Smartphone, Globe, Server, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Desarrollo Web Full Stack",
    description:
      "Sitios web modernos, rápidos y optimizados para SEO utilizando la última tecnología de Next.js y React.",
    icon: <Globe size={28} />,
    features: [
      "Landing Pages Premium",
      "Aplicaciones SaaS",
      "E-commerce",
      "Paneles de Administración",
    ],
  },
  {
    title: "Apps Móviles Multiplataforma",
    description:
      "Aplicaciones nativas para iOS y Android desde un único código base con Flutter. Fluidez y rendimiento garantizados.",
    icon: <Smartphone size={28} />,
    features: [
      "Diseño UI/UX Nativo",
      "Animaciones Fluidas",
      "Integración Nativa",
      "Publicación en Tiendas",
    ],
  },
  {
    title: "Backend & APIs",
    description:
      "Arquitecturas robustas y escalables para soportar tu negocio. Gestión de datos, seguridad y alto rendimiento.",
    icon: <Server size={28} />,
    features: [
      "APIs RESTful / GraphQL",
      "Bases de Datos SQL/NoSQL",
      "Autenticación Segura",
      "Integración Cloud",
    ],
  },
];

export default function Services() {
  return (
    <section className={styles.servicesContainer}>
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Mis <span style={{ color: "var(--color-secondary)" }}>Servicios</span>
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
        Soluciones integrales para llevar tu idea al siguiente nivel, con código
        limpio y arquitectura escalable.
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
    </section>
  );
}
