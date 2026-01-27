"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/api";
import { notFound, useParams } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import styles from "./markdown.module.css";

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      try {
        const data = await getBlogBySlug(slug);
        if (!data) setPost(null);
        else setPost(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#0a0a0a",
        }}
      >
        <Loader2
          className="animate-spin"
          size={40}
          color="var(--color-primary)"
        />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        minHeight: "100vh",
      }}
    >
      <Link
        href="/blog"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "2rem",
          color: "rgba(255,255,255,0.6)",
          transition: "color 0.2s",
        }}
      >
        <ArrowLeft size={20} /> Volver al Blog
      </Link>

      {post.imageUrl && (
        <div
          style={{
            width: "100%",
            height: "440px",
            borderRadius: "24px",
            overflow: "hidden",
            marginBottom: "3rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <span style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(post.tags || []).map((tag: string) => (
          <span
            key={tag}
            style={{
              color: "var(--color-primary)",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
            }}
          >
            {tag}
          </span>
        ))}
      </span>

      <h1
        style={{
          fontSize: "3.5rem",
          marginBottom: "1.5rem",
          lineHeight: 1.1,
          color: "white",
          fontWeight: "800",
        }}
      >
        {post.title}
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "rgba(255,255,255,0.6)",
          marginBottom: "4rem",
        }}
      >
        <Calendar size={18} /> {new Date(post.date).toLocaleDateString()}
      </div>

      <article className={styles.markdown}>
        <Markdown remarkPlugins={[remarkGfm]}>{post.content || ""}</Markdown>
      </article>
    </main>
  );
}
