export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: "1",
    role: "Senior Flutter Developer",
    company: "Tech Solutions Inc.",
    period: "2023 - Presente",
    description:
      "Liderando el desarrollo de aplicaciones móviles multiplataforma y migración de arquitectura a Clean Architecture + Bloc.",
  },
  {
    id: "2",
    role: "Full Stack Developer",
    company: "Digital Agency",
    period: "2021 - 2023",
    description:
      "Desarrollo de web apps con Next.js y APIs REST con Node.js. Implementación de pasarelas de pago y dashboards en tiempo real.",
  },
  {
    id: "3",
    role: "Mobile Developer",
    company: "Startup Innovadora",
    period: "2019 - 2021",
    description:
      "Desarrollo inicial de MVP en Flutter y publicación en Play Store y App Store.",
  },
];
