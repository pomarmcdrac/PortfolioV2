export type ProjectCategory = "Mobile" | "Frontend" | "Backend" | "Full Stack";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  techStack: string[];
  imageUrl?: string;
  repoUrl?: string; // Opcional
  liveUrl?: string; // Opcional
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Fintech Core Banking",
    description:
      "App móvil internacional para gestión de pagos digitales y transferencias bancarias.",
    longDescription:
      "Lideré el desarrollo de una solución fintech robusta que permite a usuarios internacionales realizar transferencias bancarias y gestionar un core bancario completo. El reto principal fue garantizar la seguridad de las transacciones y la fluidez de la UI en múltiples idiomas, implementando arquitecturas limpias y gestionando integraciones complejas con APIs bancarias.",
    category: "Mobile",
    techStack: ["Flutter", "Dart", "Clean Architecture", "Bloc", "Security"],
    // repoUrl: "#", // Privado por ser bancario
    liveUrl: "#",
  },
  {
    id: "2",
    title: "E-commerce Super App",
    description:
      "Migración y optimización de plataforma de ventas masiva a Flutter.",
    longDescription:
      "Proyecto estratégico de migración de una plataforma de ventas legacy a una arquitectura moderna en Flutter. Se logró una reducción significativa en tiempos de carga y costos de mantenimiento. Implementación de metodología Kanban para la gestión del ciclo de vida del software, resultando en una experiencia de usuario (UX) superior y aumento en la retención de clientes.",
    category: "Full Stack",
    techStack: ["Flutter", "Kanban", "Rest APIs", "Optimization"],
    liveUrl: "https://shelonabel.com",
  },
  {
    id: "3",
    title: "Smart Home IoT System",
    description:
      "Sistema integral de control para Hogares Inteligentes (Software + Hardware).",
    longDescription:
      "Desarrollo e implementación de soluciones IoT para domótica. El proyecto abarcó desde la programación de controladores de hardware hasta la interfaz de usuario para el control de dispositivos inteligentes, enfocándose en la interoperabilidad y la facilidad de uso para el usuario final.",
    category: "Backend",
    techStack: ["IoT", "Hardware Control", "C++", "Mobile"],
  },
  {
    id: "4",
    title: "Portfolio V2 (McDrac)",
    description:
      "Sitio personal Premium con Next.js 15, i18n y animaciones avanzadas.",
    longDescription:
      "Este mismo sitio web. Un showcase de habilidades Frontend modernas utilizando Next.js App Router, Framer Motion para animaciones orquestadas, variables CSS dinámicas para theming y un sistema de internacionalización (i18n) ligero basado en React Context. Optimizado para SEO y performance (Lighthouse 100).",
    category: "Frontend",
    techStack: ["Next.js 15", "TypeScript", "Framer Motion", "CSS Modules"],
    repoUrl: "https://github.com/pomarmcdrac/PortfolioV2",
    liveUrl: "https://www.mcdrac.com",
  },
];
