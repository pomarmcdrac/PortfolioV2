"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Comment {
  id: string;
  blog_slug: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
}

interface BlogCommentsProps {
  blogSlug: string;
}

export default function BlogComments({ blogSlug }: BlogCommentsProps) {
  const { language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Load comments
    loadComments();

    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [blogSlug]);

  async function loadComments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_slug", blogSlug)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href, // Redirects back to current blog post
        },
      });
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !session) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        blog_slug: blogSlug,
        user_id: user.id,
        user_name: user.user_metadata.full_name || user.user_metadata.name || "Usuario verificado",
        user_avatar: user.user_metadata.avatar_url || null,
        content: newComment.trim(),
      };

      const { error } = await supabase.from("blog_comments").insert([payload]);
      if (error) {
        if (error.message.includes("spam")) {
          throw new Error(
            language === "ES"
              ? "Por favor espera 30 segundos entre comentarios para evitar spam."
              : "Please wait 30 seconds between comments to prevent spam."
          );
        }
        throw error;
      }
      setNewComment("");
      await loadComments();
    } catch (err: any) {
      console.error("Error creating comment:", err);
      setErrorMessage(err.message || (language === "ES" ? "Error al publicar tu comentario." : "Error posting your comment."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const confirmMsg = language === "ES"
      ? "¿Seguro que quieres eliminar tu comentario?"
      : "Are you sure you want to delete your comment?";
    if (!confirm(confirmMsg)) return;

    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(language === "ES" ? "Error al eliminar el comentario." : "Error deleting comment.");
    }
  };

  return (
    <div style={{ marginTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
        <MessageSquare size={24} style={{ color: "var(--color-primary)" }} />
        <h2 style={{ fontSize: "1.75rem", margin: 0, color: "white" }}>
          {language === "ES" ? "Comentarios" : "Comments"} ({comments.length})
        </h2>
      </div>

      {/* Input de nuevo comentario */}
      <div style={{ marginBottom: "3rem" }}>
        {!user ? (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "2rem",
            borderRadius: "16px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.2rem", fontSize: "0.95rem" }}>
              {language === "ES"
                ? "Inicia sesión con Google para compartir tu opinión sobre este artículo de forma segura."
                : "Sign in with Google to share your thoughts on this article securely."}
            </p>
            <button
              onClick={handleLogin}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1.5rem",
                background: "white",
                color: "black",
                border: "none",
                borderRadius: "99px",
                fontWeight: "700",
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 10px 20px -5px rgba(255,255,255,0.15)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.6z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.91-2.26a5.6 5.6 0 0 1-8.1-2.92H.9v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.95 10.62A5.4 5.4 0 0 1 3.6 9c0-.56.1-1.11.35-1.62V5.05H.9a9 9 0 0 0 0 7.9l3.05-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A9 9 0 0 0 .9 5.05l3.05 2.33A5.4 5.4 0 0 1 9 3.58z"/>
              </svg>
              {language === "ES" ? "Comentar con Google" : "Comment with Google"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              {user.user_metadata.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                />
              ) : (
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "0.8rem"
                }}>
                  {user.email?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>
                {language === "ES" ? "Identificado como" : "Signed in as"} {user.user_metadata.full_name || user.user_metadata.name}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <textarea
                placeholder={
                  language === "ES"
                    ? "Deja tu comentario sobre este artículo (máx. 500 caracteres)..."
                    : "Leave your comment on this article (max 500 characters)..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                required
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "1rem",
                  borderRadius: "14px",
                  background: "#121d2d",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: "1.5",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <span style={{
                position: "absolute",
                bottom: "0.75rem",
                right: "1rem",
                fontSize: "0.8rem",
                color: newComment.length >= 450 ? "#ff6b6b" : "rgba(255,255,255,0.4)"
              }}>
                {newComment.length}/500
              </span>
            </div>

            {errorMessage && (
              <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "0" }}>
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              style={{
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.5rem",
                background: "var(--color-primary)",
                color: "black",
                border: "none",
                borderRadius: "99px",
                fontWeight: "700",
                cursor: "pointer",
                opacity: submitting || !newComment.trim() ? 0.6 : 1,
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => !submitting && (e.currentTarget.style.transform = "scale(1)")}
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              {submitting
                ? (language === "ES" ? "Publicando..." : "Posting...")
                : (language === "ES" ? "Comentar" : "Comment")}
            </button>
          </form>
        )}
      </div>

      {/* Lista de comentarios */}
      <div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Loader2 className="animate-spin" size={24} color="var(--color-primary)" />
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", opacity: 0.5 }}>
            <p style={{ fontSize: "0.95rem", margin: 0 }}>
              {language === "ES"
                ? "No hay comentarios aún. ¡Sé el primero en comentar!"
                : "No comments yet. Be the first to comment!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {comments.map((comment) => {
              const isOwner = user && user.id === comment.user_id;
              return (
                <div
                  key={comment.id}
                  style={{
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    padding: "1.25rem",
                    borderRadius: "16px",
                    display: "flex",
                    gap: "1rem",
                    textAlign: "left"
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {comment.user_avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={comment.user_avatar}
                        alt="Avatar"
                        style={{ width: "38px", height: "38px", borderRadius: "50%" }}
                      />
                    ) : (
                      <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white"
                      }}>
                        <User size={18} />
                      </div>
                    )}
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <div>
                        <span style={{ color: "white", fontWeight: "600", fontSize: "0.95rem", marginRight: "0.5rem" }}>
                          {comment.user_name}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                          {new Date(comment.created_at).toLocaleDateString(language === "ES" ? "es-ES" : "en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(255,255,255,0.3)",
                            cursor: "pointer",
                            padding: "0.2rem",
                            borderRadius: "4px",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#ff6b6b";
                            e.currentTarget.style.background = "rgba(255,0,0,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                            e.currentTarget.style.background = "none";
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", whiteSpace: "pre-line", margin: 0, lineHeight: "1.5" }}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
