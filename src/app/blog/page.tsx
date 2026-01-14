import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { ArrowLeft, Calendar } from "lucide-react";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        minHeight: "100vh",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "2rem",
          color: "rgba(255,255,255,0.6)",
          transition: "color 0.2s",
        }}
      >
        <ArrowLeft size={20} /> Volver al Inicio
      </Link>

      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Blog Técnico</h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "4rem",
        }}
      >
        Compartiendo conocimientos sobre desarrollo web, mobile y arquitectura
        de software.
      </p>

      <div style={{ display: "grid", gap: "2rem" }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none" }}
          >
            <article
              style={{
                background: "var(--color-surface)",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "2rem",
                borderRadius: "16px",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Calendar size={16} /> {post.date}
                </span>
                <span style={{ display: "flex", gap: "0.5rem" }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        color: "var(--color-primary)",
                        background: "rgba(56, 189, 248, 0.1)",
                        padding: "0 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </span>
              </div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.5rem",
                  color: "var(--color-foreground)",
                }}
              >
                {post.title}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                {post.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
