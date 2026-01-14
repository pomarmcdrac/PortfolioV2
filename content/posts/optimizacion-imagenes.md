---
title: "Cómo optimizar imágenes en Next.js"
date: "2024-03-15"
excerpt: "Descubre cómo el componente Image de Next.js puede mejorar drásticamente tu Core Web Vitals y la experiencia de usuario."
tags: ["Next.js", "Performance", "Web"]
---

# Optimización de Imágenes en la Web Moderna

Cuando hablamos de rendimiento web (Web Performance), las imágenes suelen ser el mayor cuello de botella. Cargar una imagen de 5MB en un móvil con 4G es un pecado capital en el desarrollo web.

## El problema de la etiqueta <img>

La etiqueta HTML estándar `<img>` no hace mucho por nosotros:

- No evita el _Layout Shift_ (CLS).
- No carga imágenes diferentes según el dispositivo.
- No hace _Lazy Loading_ nativo en todos los navegadores antiguos.

## La solución: next/image

Next.js introdujo el componente `<Image />` para solucionar esto automáticamente:

```jsx
import Image from "next/image";

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero Image"
      width={1200}
      height={600}
      priority
    />
  );
}
```

## Conclusión

Usar las herramientas nativas del framework no solo te ahorra tiempo, sino que garantiza que tu sitio vuele en Lighthouse.
