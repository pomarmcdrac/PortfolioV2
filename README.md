# 🚀 Portfolio V2 - Omar Morales (McDrac)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> Portafolio web moderno y dinámico construido con Next.js 15, showcasing de proyectos Full Stack y Mobile, con sistema de internacionalización (ES/EN) y animaciones avanzadas.

🌐 **Live Demo**: [www.mcdrac.com](https://www.mcdrac.com)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#️-tech-stack)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características Destacadas](#-características-destacadas)
- [Roadmap](#-roadmap)
- [Autor](#-autor)

---

## ✨ Características

- 🎨 **Diseño Premium**: Tema oscuro personalizado con paleta "McDrac" (Deep Navy + Electric Cyan)
- 🌍 **Internacionalización (i18n)**: Soporte para Español e Inglés con cambio en tiempo real
- 📱 **Responsive Design**: Optimizado para móviles, tablets y desktop
- ⚡ **Performance**: Lighthouse Score 100 en Performance y SEO
- 🎭 **Animaciones Fluidas**: Framer Motion para transiciones orquestadas
- 📝 **Blog Técnico**: Sistema de posts con Markdown/MDX
- 🔍 **SEO Optimizado**: Meta tags dinámicos y estructura semántica
- 🎯 **Filtrado Dinámico**: Sistema de categorías para proyectos
- 📊 **Timeline Profesional**: Visualización de experiencia laboral

---

## 🛠️ Tech Stack

### Core

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: CSS Modules + Variables CSS (HSL)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)

### Librerías Adicionales

- **Markdown**: `react-markdown` + `remark-gfm`
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Fuentes**: Google Fonts (Nunito)

### Herramientas de Desarrollo

- **Linter**: ESLint
- **Package Manager**: npm
- **Control de Versiones**: Git

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/pomarmcdrac/PortfolioV2.git
cd PortfolioV2
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

### Build para Producción

```bash
npm run build
npm start
```

---

## 📁 Estructura del Proyecto

```
PortfolioV2/
├── public/
│   └── logo.jpg              # Logo McDrac
├── src/
│   ├── app/
│   │   ├── blog/             # Sistema de blog
│   │   │   ├── [slug]/       # Detalle de post
│   │   │   └── page.tsx      # Lista de posts
│   │   ├── project/
│   │   │   └── [id]/         # Detalle de proyecto
│   │   ├── globals.css       # Estilos globales + variables
│   │   ├── layout.tsx        # Layout raíz
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── layout/           # Footer, Navbar
│   │   ├── projects/         # ProjectCard
│   │   ├── sections/         # Services, Timeline, CTA
│   │   └── ui/               # AmbientBackground, LanguageToggle
│   ├── context/
│   │   └── LanguageContext.tsx  # Estado global de idioma
│   ├── data/
│   │   ├── projects.ts       # Datos de proyectos
│   │   └── experience.ts     # Trayectoria profesional
│   ├── i18n/
│   │   └── translations.ts   # Diccionario ES/EN
│   └── lib/
│       └── blog.ts           # Utilidades para Markdown
├── content/
│   └── posts/                # Artículos en Markdown
├── package.json
└── README.md
```

---

## 🎯 Características Destacadas

### 1. Sistema de Internacionalización

Implementación ligera con React Context que permite cambiar el idioma sin recargar la página.

```typescript
// Uso en componentes
const { t, language, setLanguage } = useLanguage();
<h1>{t.hero.title}</h1>;
```

### 2. Blog con Markdown

Los posts se escriben en archivos `.md` en `content/posts/` y se renderizan automáticamente con syntax highlighting.

### 3. Routing Dinámico

- `/project/[id]` - Detalle de proyecto
- `/blog/[slug]` - Detalle de artículo

### 4. Animaciones Orquestadas

Uso de `AnimatePresence` y `layout` animations para transiciones fluidas en filtros y navegación.

---

## 🗺️ Roadmap

- [x] Sistema de Blog con Markdown
- [x] Internacionalización (ES/EN)
- [x] Página de detalle de proyectos
- [x] Timeline de experiencia
- [ ] Integración con API (NestJS)
- [ ] Panel de administración
- [ ] Sistema de comentarios en blog
- [ ] Modo claro/oscuro toggle
- [ ] Galería de imágenes en proyectos

---

## 👨‍💻 Autor

**Omar Alejandro Morales Mendoza**

- 🌐 Website: [www.mcdrac.com](https://www.mcdrac.com)
- 💼 LinkedIn: [omaramorales](https://linkedin.com/in/omaramorales)
- 🐙 GitHub: [@pomarmcdrac](https://github.com/pomarmcdrac)
- 📧 Email: pomaral@live.com.mx

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🙏 Agradecimientos

- Diseño inspirado en portfolios modernos de la comunidad de desarrolladores.
- Iconos por [Lucide](https://lucide.dev/)
- Fuente Nunito por Google Fonts

---

⭐ **Si te gustó este proyecto, dale una estrella en GitHub!**
