"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
const EMAIL_ADDRESS =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "legal@mcdrac.com";

export default function PrivacyPolicyPage() {
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
          background:
            "linear-gradient(to right, #ffffff, var(--color-primary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {isEs ? "Política de Privacidad" : "Privacy Policy"}
      </h1>

      <p
        style={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "0.95rem",
          marginBottom: "2rem",
        }}
      >
        {isEs ? "Última actualización: Julio 2026" : "Last updated: July 2026"}
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
                Esta Política de Privacidad describe cómo se recopilan, utilizan
                y protegen sus datos personales al interactuar con el sitio web{" "}
                <strong>mcdrac.com</strong>.
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                1. Responsable del Tratamiento
              </h2>
              <p>
                El responsable del tratamiento de los datos recopilados en este
                sitio web es <strong>Omar Alejandro Morales Mendoza</strong>,
                con correo de contacto principal:{" "}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "underline",
                  }}
                >
                  {EMAIL_ADDRESS}
                </a>
                .
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                2. Datos Personales que Recopilamos
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                Recopilamos únicamente los datos necesarios para brindar las
                funcionalidades del sitio:
              </p>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong>Autenticación con Google (Google OAuth):</strong> Si
                  decide iniciar sesión en el blog para comentar o dejar
                  reacciones, recopilamos su nombre, dirección de correo
                  electrónico y foto de perfil.
                </li>
                <li>
                  <strong>Formulario de Citas (Google Calendar):</strong> Al
                  agendar una reunión, solicitamos su nombre completo, correo
                  electrónico, teléfono de contacto y detalles o notas de la
                  sesión.
                </li>
                <li>
                  <strong>Datos Técnicos y de Navegación:</strong> Información
                  técnica no identificable y de rendimiento del sitio gestionada
                  por nuestro proveedor de hosting (Vercel).
                </li>
              </ul>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                3. Finalidad del Tratamiento de Datos
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                Los datos personales se procesan estrictamente con las
                siguientes finalidades:
              </p>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  Agendar y sincronizar citas directamente en Google Calendar.
                </li>
                <li>
                  Gestionar y publicar comentarios y reacciones de forma
                  legítima en las publicaciones del blog.
                </li>
                <li>
                  Atender solicitudes, dudas o propuestas de colaboración
                  técnica recibidas.
                </li>
              </ul>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                4. Proveedores y Terceros
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                Para garantizar el correcto funcionamiento técnico del sitio,
                compartimos datos esenciales con los siguientes proveedores:
              </p>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong>Supabase Inc.</strong>: Para el almacenamiento seguro
                  de bases de datos de comentarios y la autenticación de
                  usuarios.
                </li>
                <li>
                  <strong>Google LLC (Google Calendar API):</strong> Para
                  programar y enviar invitaciones a reuniones de Google Meet.
                </li>
                <li>
                  <strong>Vercel Inc.</strong>: Para el alojamiento técnico y
                  análisis de rendimiento.
                </li>
              </ul>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                5. Conservación de Datos
              </h2>
              <p>
                Los datos de comentarios permanecerán públicos en el blog
                mientras el post esté activo. Los datos de reservas se
                mantendrán por un plazo máximo de un año posterior al evento
                para efectos de seguimiento profesional, o bien, hasta que
                solicite su eliminación.
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                6. Derechos del Usuario (ARCO)
              </h2>
              <p>
                Usted tiene pleno derecho a acceder, rectificar, cancelar u
                oponerse al tratamiento de sus datos personales. Puede solicitar
                de manera gratuita la eliminación de su cuenta, sus comentarios
                en el blog o la cancelación de citas enviando un correo
                electrónico directamente a{" "}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "underline",
                  }}
                >
                  {EMAIL_ADDRESS}
                </a>
                . Su solicitud será procesada en un plazo menor a 72 horas.
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                7. Seguridad y Encriptación
              </h2>
              <p>
                Utilizamos encriptación de datos SSL/TLS de extremo a extremo en
                todas las comunicaciones del sitio y limitamos estrictamente el
                acceso a las variables de entorno de base de datos a nivel de
                servidor mediante APIs privadas y seguras.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <p style={{ marginBottom: "1rem" }}>
                This Privacy Policy describes how your personal data is
                collected, used, and protected when interacting with the website{" "}
                <strong>mcdrac.com</strong>.
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                1. Data Controller
              </h2>
              <p>
                The data controller responsible for the processing of data
                collected on this website is{" "}
                <strong>Omar Alejandro Morales Mendoza</strong>, with the
                primary contact email:{" "}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "underline",
                  }}
                >
                  {EMAIL_ADDRESS}
                </a>
                .
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                2. Personal Data We Collect
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                We collect only the data necessary to provide the website's
                functionalities:
              </p>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong>Google Authentication (Google OAuth):</strong> If you
                  choose to log into the blog to comment or leave reactions, we
                  collect your name, email address, and profile picture.
                </li>
                <li>
                  <strong>Booking Form (Google Calendar):</strong> When
                  scheduling a meeting, we request your full name, email
                  address, contact phone, and session context/notes.
                </li>
                <li>
                  <strong>Technical and Navigational Data:</strong> Technical,
                  non-identifiable, and performance information managed by our
                  hosting provider (Vercel).
                </li>
              </ul>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                3. Purpose of Data Processing
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                Personal data is strictly processed for the following purposes:
              </p>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  To schedule and synchronize meetings directly in Google
                  Calendar.
                </li>
                <li>
                  To manage and publish comments and reactions legitimately on
                  the blog.
                </li>
                <li>
                  To answer requests, inquiries, or professional collaboration
                  proposals.
                </li>
              </ul>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                4. Third-Party Services
              </h2>
              <p style={{ marginBottom: "0.5rem" }}>
                To ensure correct technical operation of the site, we share
                essential data with the following providers:
              </p>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong>Supabase Inc.</strong>: For secure database storage of
                  comments and user session authorization.
                </li>
                <li>
                  <strong>Google LLC (Google Calendar API):</strong> To schedule
                  and send invitations to Google Meet virtual calls.
                </li>
                <li>
                  <strong>Vercel Inc.</strong>: For technical hosting and
                  performance analytics.
                </li>
              </ul>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                5. Data Retention
              </h2>
              <p>
                Comments data will remain public on the blog while the post is
                active. Booking details will be kept for a maximum of one year
                following the event for professional follow-up purposes, or
                until you request their deletion.
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                6. User Rights
              </h2>
              <p>
                You have the full right to access, rectify, cancel, or object to
                the processing of your personal data. You can request the
                deletion of your account, blog comments, or scheduled meetings
                at any time and free of charge by writing to{" "}
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "underline",
                  }}
                >
                  {EMAIL_ADDRESS}
                </a>
                . Your request will be processed in less than 72 hours.
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                7. Security and Encryption
              </h2>
              <p>
                We use end-to-end SSL/TLS data encryption for all communications
                and restrict access to backend environment variables via secure
                server-side routes.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
