"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs } from "@/lib/api";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogIndex() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogs(language);
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [language]);

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
        <span style={{ display: "inline-block", lineHeight: "1" }}>{t.blog.backBtn}</span>
      </Link>

      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>{t.blog.title}</h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "4rem",
        }}
      >
        {t.blog.subtitle}
      </p>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
        >
          <Loader2
            className="animate-spin"
            size={40}
            color="var(--color-primary)"
          />
        </div>
      ) : (
        <div style={{ display: "grid", gap: "2rem" }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <article
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                className="blog-card"
              >
                {post.imageUrl && (
                  <div
                    style={{
                      height: "240px",
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      className="card-image"
                    />
                  </div>
                )}
                <div style={{ padding: "2rem" }}>
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
                      <Calendar size={16} />{" "}
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span style={{ display: "flex", gap: "0.5rem" }}>
                      {(post.tags || []).map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            color: "var(--color-primary)",
                            background: "rgba(56, 189, 248, 0.1)",
                            padding: "0.1rem 0.6rem",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
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
                      marginBottom: "1rem",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.6,
                      fontSize: "1rem",
                    }}
                  >
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-primary-glow);
          background: rgba(255, 255, 255, 0.05);
        }
        .blog-card:hover .card-image {
          transform: scale(1.05);
        }
      `}</style>
    </main>
  );
}
