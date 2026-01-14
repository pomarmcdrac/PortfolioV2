import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omar Morales - Full Stack Developer",
  description:
    "Portafolio de desarrollador Full Stack especializado en Flutter y Next.js",
  icons: {
    icon: "/logo.jpg",
  },
};

import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/ui/AmbientBackground";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={nunito.className}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <LanguageProvider>
          <AmbientBackground />
          <LanguageToggle />
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
