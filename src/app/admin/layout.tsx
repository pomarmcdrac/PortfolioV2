"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Code,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  Calendar,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/admin");
  };

  const navItems = [
    { name: "Proyectos", path: "/admin/projects", icon: LayoutDashboard },
    { name: "Experiencia", path: "/admin/experience", icon: Briefcase },
    { name: "Habilidades", path: "/admin/skills", icon: Code },
    { name: "Blog", path: "/admin/blog", icon: FileText },
    { name: "Horarios", path: "/admin/schedule", icon: Calendar },
    { name: "Sobre Mí", path: "/admin/about", icon: User },
  ];

  if (pathname === "/admin") return <>{children}</>;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-background)",
      }}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 100,
          background: "var(--color-surface)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "0.5rem",
          borderRadius: "8px",
          color: "white",
          display: "none", // Hidden by default, shown in CSS
        }}
        className="mobile-menu-btn"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}
        style={{
          width: "260px",
          background: "var(--color-surface)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ marginBottom: "3rem", paddingLeft: "0.5rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              background:
                "linear-gradient(to right, #fff, var(--color-primary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "800",
            }}
          >
            Admin Panel
          </h1>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "0.8rem 1rem",
                  borderRadius: "12px",
                  color: isActive ? "black" : "rgba(255,255,255,0.6)",
                  background: isActive ? "var(--color-primary)" : "transparent",
                  fontWeight: isActive ? "bold" : "normal",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            padding: "0.8rem 1rem",
            background: "rgba(255, 68, 68, 0.1)",
            color: "#ff4444",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            marginTop: "auto",
            fontWeight: "600",
            transition: "background 0.2s",
          }}
        >
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, width: "100%", padding: "2rem" }}>
        {children}
      </main>

      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            left: -260px;
            z-index: 99;
            transition: left 0.3s ease;
          }
          .admin-sidebar.open {
            left: 0;
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
          }
          .mobile-menu-btn {
            display: block !important;
          }
          main {
            padding-top: 5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
