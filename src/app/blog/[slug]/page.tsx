import Link from "next/link";
import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar } from "lucide-react";
import styles from "./markdown.module.css"; // Crearemos este CSS para que el markdown se vea bonito

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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

      <span style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {post.tags.map((tag) => (
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

      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1.1 }}>
        {post.title}
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "rgba(255,255,255,0.6)",
          marginBottom: "3rem",
        }}
      >
        <Calendar size={18} /> {post.date}
      </div>

      <article className={styles.markdown}>
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
      </article>
    </main>
  );
}
