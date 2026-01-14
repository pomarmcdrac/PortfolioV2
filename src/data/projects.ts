export type ProjectCategory = "Mobile" | "Frontend" | "Backend" | "Full Stack";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  imageUrl?: string; // Opcional por ahora, luego pondremos screenshots reales
  repoUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Flutter E-commerce App",
    description:
      "Aplicación móvil de compras con animaciones fluidas, gestión de carrito y pasarela de pagos integrada. Enfoque en arquitectura limpia (Clean Architecture).",
    category: "Mobile",
    techStack: ["Flutter", "Dart", "Bloc", "Firebase"],
    repoUrl: "https://github.com/tuusuario/proyecto",
  },
  {
    id: "2",
    title: "Dashboard Analítico",
    description:
      "Panel de administración reactivo con gráficos en tiempo real y gestión de usuarios.",
    category: "Frontend",
    techStack: ["Next.js", "TypeScript", "Chart.js", "Tailwind"],
    liveUrl: "https://demo.com",
  },
  {
    id: "3",
    title: "API RESTful de Reservas",
    description:
      "Backend escalable para un sistema de reservas, con autenticación JWT, tests automatizados y documentación Swagger.",
    category: "Backend",
    techStack: ["Node.js", "Express", "PostgreSQL", "Docker"],
    repoUrl: "https://github.com/tuusuario/api",
  },
  {
    id: "4",
    title: "Portfolio V2 (Este sitio)",
    description:
      "Sitio web personal con diseño premium, theme system y animaciones CSS.",
    category: "Full Stack",
    techStack: ["Next.js 15", "React", "TypeScript", "CSS Modules"],
    liveUrl: "#",
  },
];
