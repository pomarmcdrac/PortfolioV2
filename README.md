# 🚀 Portfolio V2 - Omar Morales (McDrac)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)

> Portafolio web moderno y dinámico construido con Next.js 15, ahora integrado con una API de NestJS para gestión dinámica de contenido, sistema de internacionalización (ES/EN) y seguridad avanzada.

🌐 **Live Demo**: [www.mcdrac.com](https://www.mcdrac.com)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura y Patrones de Diseño](#🏗️-arquitectura-y-patrones-de-diseño)
- [Seguridad y Administración](#🔐-seguridad-y-administración)
- [Tech Stack](#️-tech-stack)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap](#-roadmap)
- [Autor](#-autor)

---

## ✨ Características

- 🎨 **Diseño Premium**: Tema oscuro personalizado con paleta "McDrac" (Deep Navy + Electric Cyan).
- 🌍 **Internacionalización (i18n)**: Soporte para Español e Inglés con cambio en tiempo real.
- ⚡ **API Dinámica**: Integración completa con backend NestJS para proyectos y experiencia.
- 🛠️ **Panel Admin**: Dashboard privado para gestionar proyectos y habilidades sin tocar el código.
- 📱 **Responsive Design**: Optimizado para móviles, tablets y desktop.
- ⚡ **Performance**: Lighthouse Score cercano a 100 en Performance y SEO.
- 🎭 **Animaciones Fluidas**: Framer Motion para transiciones orquestadas.
- �️ **Seguridad Blindada**: Sistema de rate limiting y ocultamiento de API.

---

## 🏗️ Arquitectura y Patrones de Diseño

Este proyecto sigue principios sólidos de ingeniería de software para garantizar escalabilidad y mantenimiento:

- **Proxy Pattern (Capa de Seguridad)**: Se utiliza el Patrón Proxy en el lado del servidor (`Next.js API Routes`) para actuar como intermediario entre el cliente y la API real, ocultando la infraestructura del backend.
- **Service Pattern**: Las peticiones externas están centralizadas en una capa de servicio (`src/lib/api.ts`), desacoplando la lógica de negocio de la interfaz de usuario.
- **Separation of Concerns (SoC)**: Clara división de responsabilidades:
  - **UI Components**: Solo representación visual.
  - **API Proxy**: Seguridad y orquestación de red.
  - **Context/State**: Gestión global del idioma.
- **Defensive Programming**: Implementación de fallbacks dinámicos; si la API falla, el sitio utiliza datos estáticos de respaldo automáticamente.

---

## 🔐 Seguridad y Administración

### Panel Administrativo (`/admin`)

Sistema privado para el control total del contenido:

- **Gestión de Proyectos**: CRUD completo con soporte para categorías dinámicas.
- **Gestión de Skills**: Administración de habilidades e iconos del marquee técnico.
- **Cloudinary Integration**: Subida directa de imágenes desde el panel admin con optimización automática.

### Blindaje de Seguridad

- **Rate Limiting**: El login administrativo está protegido contra ataques de fuerza bruta (bloqueo automático tras 5 intentos fallidos por 15 minutos).
- **Invisible API**: La URL del backend de NestJS está configurada como variable de entorno privada de servidor. El navegador del usuario solo ve las rutas locales del proxy.
- **JWT Auth**: Autenticación segura mediante Bearer tokens para todas las operaciones de escritura.

---

## 🛠️ Tech Stack

### Frontend & Core

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: CSS Modules + Variables CSS (HSL)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)

### Backend (API Externa)

- **Framework**: [NestJS](https://nestjs.com/)
- **Base de Datos**: PostgreSQL / Supabase
- **Almacenamiento**: [Cloudinary](https://cloudinary.com/) (Imágenes)

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Una API configurada (Opcional, el sitio tiene fallback estático)

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/pomarmcdrac/PortfolioV2.git
cd PortfolioV2
```

2. **Configurar envs**
   Crea un archivo `.env.local` con tu URL privada:

```bash
API_URL=https://tu-api.vercel.app/api/v1
```

3. **Instalar y correr**

```bash
npm install
npm run dev
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/             # Dashboard administrativo privado
│   ├── api/               # API Routes (Proxy de Seguridad + Rate Limit)
│   ├── blog/              # Sistema de blog Markdown
│   ├── project/[id]/      # Detalle dinámico de proyectos
│   └── page.tsx           # Homepage con fetching dinámico
├── components/            # UI atómica y secciones
├── context/               # Estado global (i18n)
├── data/                  # Repositorios estáticos (Fallback)
├── lib/                   # Capa de Servicio (Service Pattern)
```

---

## 🗺️ Roadmap

- [x] Sistema de Blog con Markdown
- [x] Internacionalización (ES/EN)
- [x] Integración con API (NestJS)
- [x] Panel de administración completo
- [x] Seguridad Avanzada (Rate Limit & Proxy)
- [x] Subida de imágenes a Cloudinary
- [ ] Sistema de comentarios en blog
- [ ] Modo claro/oscuro toggle
- [ ] Galería de imágenes expandible en proyectos

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

⭐ **Si te gustó este proyecto, dale una estrella en GitHub!**
