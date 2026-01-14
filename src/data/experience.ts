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
    role: "Lead Mobile Developer",
    company: "Nextline",
    period: "May 2024 - Presente",
    description:
      "Liderazgo técnico en desarrollo móvil implementando metodología SCRUM y soporte bilingüe. Desarrollo exitoso de aplicaciones fintech internacionales para transferencias bancarias y gestión de core bancario como método de pago digital.",
  },
  {
    id: "2",
    role: "Desarrollador de Software",
    company: "Sheló NABEL",
    period: "Abr 2022 - May 2024",
    description:
      "Desarrollo Web y Móvil. Lideré la migración estratégica de e-commerce a Flutter usando metodología Kanban, logrando optimizar el rendimiento, reducir costos de mantenimiento y mejorar drásticamente la experiencia de usuario.",
  },
  {
    id: "3",
    role: "Becario de Programación",
    company: "Alive!",
    period: "Dic 2019 - Sept 2021",
    description:
      "Implementación de proyectos de Software y Hardware enfocados en Hogares Inteligentes (IoT). Encargado de la documentación técnica de procesos y despliegue de soluciones.",
  },
];
