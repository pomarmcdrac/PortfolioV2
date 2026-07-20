"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsOfServicePage() {
  const { language } = useLanguage();

  const isEs = language === "ES";

  return (
    <main
      className="fade-in"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        minHeight: "100vh",
      }}
    >
      {/* Back Button */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "rgba(255, 255, 255, 0.45)",
          textDecoration: "none",
          fontWeight: "600",
          transition: "all 0.3s",
          padding: "0.7rem 1.2rem",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          fontSize: "0.95rem",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          marginBottom: "2rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.transform = "translateX(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.45)";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        <ArrowLeft size={18} />
        <span style={{ display: "inline-block", lineHeight: "1" }}>
          {isEs ? "Volver al Inicio" : "Back to Home"}
        </span>
      </Link>

      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          background: "linear-gradient(to right, #ffffff, var(--color-primary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {isEs ? "Condiciones del Servicio" : "Terms of Service"}
      </h1>

      <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        {isEs
          ? "Última actualización: Julio 2026"
          : "Last updated: July 2026"}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          background: "rgba(11, 25, 46, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
        }}
      >
        {isEs ? (
          <>
            <section>
              <p style={{ marginBottom: "1rem" }}>
                Estas Condiciones del Servicio regulan el acceso y uso del sitio web <strong>mcdrac.com</strong>. Al navegar, interactuar o programar una cita en este sitio, usted acepta estas condiciones en su totalidad.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                1. Objeto del Sitio Web
              </h2>
              <p>
                Este sitio web es un portafolio profesional y blog tecnológico desarrollado por <strong>Omar Alejandro Morales Mendoza</strong>. Su propósito es presentar proyectos de ingeniería de software, publicar artículos informativos y ofrecer una herramienta integrada para el agendamiento de reuniones profesionales.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                2. Aceptación de las Condiciones
              </h2>
              <p>
                El uso de este sitio web atribuye la condición de usuario e implica la aceptación total y sin reservas de todas las disposiciones incluidas en estas Condiciones de Servicio en el momento en que se acceda al sitio. Si no está de acuerdo, absténgase de utilizar los servicios interactivos.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                3. Uso Adecuado de la Plataforma
              </h2>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>
                  <strong>Reservas de Citas:</strong> El usuario se compromete a proporcionar información verídica y de contacto válida al agendar citas en el calendario. Queda estrictamente prohibido realizar reservas falsas, abusivas o malintencionadas.
                </li>
                <li>
                  <strong>Participación en el Blog:</strong> El usuario es el único responsable de los comentarios que publique. No se tolerará spam, lenguaje ofensivo, discriminatorio o que infrinja los derechos de autor de terceros. El propietario se reserva el derecho de eliminar comentarios inapropiados de forma inmediata.
                </li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                4. Exclusión de Garantías y Limitación de Responsabilidad
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                Este sitio web y sus herramientas de reserva y blog se proporcionan "tal cual" (as is), sin garantías de disponibilidad constante o ausencia total de fallos de red ajenos a nuestro control:
              </p>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>El propietario no se hace responsable de daños o perjuicios directos o indirectos ocasionados por la caída temporal de los servidores de Supabase, Google Calendar, o el hosting Vercel.</li>
                <li>El propietario no garantiza que el sistema esté libre de errores tipográficos u omisiones temporales de sincronización.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                5. Propiedad Intelectual
              </h2>
              <p>
                Todo el código fuente, diseño gráfico, logotipos, imágenes y contenido redactado en el sitio web (salvo indicación contraria) son de la propiedad intelectual de <strong>Omar Alejandro Morales Mendoza</strong> y están protegidos por las leyes locales e internacionales de derechos de autor y propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                6. Modificaciones de las Condiciones
              </h2>
              <p>
                Nos reservamos el derecho de modificar o actualizar estas Condiciones de Servicio en cualquier momento sin necesidad de notificación previa. Es responsabilidad del usuario revisarlas periódicamente.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                7. Legislación y Jurisdicción
              </h2>
              <p>
                Estas condiciones se rigen por la legislación aplicable en México. Cualquier disputa o controversia relacionada con el uso de este sitio web será sometida ante los tribunales correspondientes de México, renunciando expresamente a cualquier otro fuero que pudiera corresponder.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <p style={{ marginBottom: "1rem" }}>
                These Terms of Service govern the access and use of the website <strong>mcdrac.com</strong>. By browsing, interacting, or scheduling a meeting on this site, you accept these terms in full.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                1. Purpose of the Website
              </h2>
              <p>
                This website is a professional portfolio and tech blog developed by <strong>Omar Alejandro Morales Mendoza</strong>. Its purpose is to showcase software engineering projects, publish informative articles, and offer an integrated tool for scheduling professional meetings.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                2. Acceptance of Terms
              </h2>
              <p>
                The use of this website grants you the status of user and implies the full and unreserved acceptance of all the provisions included in these Terms of Service. If you do not agree with these terms, please refrain from using the interactive features.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                3. Acceptable Use of the Platform
              </h2>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>
                  <strong>Meeting Bookings:</strong> The user agrees to provide truthful and valid contact information when booking appointments. False, abusive, or malicious bookings are strictly prohibited.
                </li>
                <li>
                  <strong>Blog Participation:</strong> The user is solely responsible for any comments posted on the blog. Spam, offensive or discriminatory language, or content that violates third-party copyright will not be tolerated. We reserve the right to delete any inappropriate comment immediately.
                </li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                4. Disclaimer of Warranties and Limitation of Liability
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                This website, its booking tools, and the blog are provided on an "as is" basis, without warranties of constant availability or lack of errors outside of our control:
              </p>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>The owner is not liable for direct or indirect damages resulting from platform downtime or server issues with Supabase, Google Calendar, or Vercel.</li>
                <li>The owner does not warrant that the system is entirely free from typographical errors or brief sync delays.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                5. Intellectual Property
              </h2>
              <p>
                All source code, graphic designs, logos, images, and written content on the website (unless otherwise stated) are the intellectual property of <strong>Omar Alejandro Morales Mendoza</strong> and are protected by local and international copyright and trademark laws.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                6. Changes to the Terms
              </h2>
              <p>
                We reserve the right to modify or update these Terms of Service at any time without prior notice. It is the user's responsibility to check this page periodically.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                7. Governing Law and Jurisdiction
              </h2>
              <p>
                These terms shall be governed by the laws applicable in Mexico. Any dispute or controversy relating to the use of this website will be submitted to the competent courts of Mexico, expressly waiving any other jurisdiction.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
