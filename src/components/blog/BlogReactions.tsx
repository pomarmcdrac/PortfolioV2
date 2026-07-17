"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ReactionCount {
  like: number;
  rocket: number;
  thumbs: number;
  lightbulb: number;
}

interface UserReactions {
  like: boolean;
  rocket: boolean;
  thumbs: boolean;
  lightbulb: boolean;
}

interface BlogReactionsProps {
  blogSlug: string;
}

const REACTION_CONFIG = [
  { type: "like" as const, emoji: "❤️", label: "Me gusta", color: "rgba(239, 68, 68, 0.15)", activeGlow: "rgba(239, 68, 68, 0.4)" },
  { type: "rocket" as const, emoji: "🚀", label: "Brillante", color: "rgba(59, 130, 246, 0.15)", activeGlow: "rgba(59, 130, 246, 0.4)" },
  { type: "thumbs" as const, emoji: "👍", label: "De acuerdo", color: "rgba(16, 185, 129, 0.15)", activeGlow: "rgba(16, 185, 129, 0.4)" },
  { type: "lightbulb" as const, emoji: "💡", label: "Útil", color: "rgba(245, 158, 11, 0.15)", activeGlow: "rgba(245, 158, 11, 0.4)" },
];

export default function BlogReactions({ blogSlug }: BlogReactionsProps) {
  const { language } = useLanguage();
  const [counts, setCounts] = useState<ReactionCount>({ like: 0, rocket: 0, thumbs: 0, lightbulb: 0 });
  const [userReactions, setUserReactions] = useState<UserReactions>({ like: false, rocket: false, thumbs: false, lightbulb: false });
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [togglingType, setTogglingType] = useState<string | null>(null);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      loadReactions(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      loadReactions(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, [blogSlug]);

  async function loadReactions(userId: string | null) {
    try {
      setLoading(true);
      // Fetch counts and user status
      const { data, error } = await supabase
        .from("blog_reactions")
        .select("reaction_type, user_id")
        .eq("blog_slug", blogSlug);

      if (error) throw error;

      // Reset
      const newCounts = { like: 0, rocket: 0, thumbs: 0, lightbulb: 0 };
      const newUserReactions = { like: false, rocket: false, thumbs: false, lightbulb: false };

      if (data) {
        data.forEach((r: any) => {
          const type = r.reaction_type as keyof ReactionCount;
          if (type in newCounts) {
            newCounts[type]++;
          }
          if (userId && r.user_id === userId && type in newUserReactions) {
            newUserReactions[type] = true;
          }
        });
      }

      setCounts(newCounts);
      setUserReactions(newUserReactions);
    } catch (err) {
      console.error("Error loading reactions:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      });
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const handleToggleReaction = async (type: "like" | "rocket" | "thumbs" | "lightbulb") => {
    if (!user || !session) {
      // Trigger login if clicked while anonymous
      handleLogin();
      return;
    }

    setTogglingType(type);

    try {
      const hasReacted = userReactions[type];

      if (hasReacted) {
        // Delete reaction
        const { error } = await supabase
          .from("blog_reactions")
          .delete()
          .eq("blog_slug", blogSlug)
          .eq("user_id", user.id)
          .eq("reaction_type", type);

        if (error) throw error;

        // Update UI optimistically/directly
        setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
        setUserReactions((prev) => ({ ...prev, [type]: false }));
      } else {
        // Insert reaction
        const { error } = await supabase
          .from("blog_reactions")
          .insert([
            {
              blog_slug: blogSlug,
              user_id: user.id,
              reaction_type: type,
            },
          ]);

        if (error) throw error;

        setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
        setUserReactions((prev) => ({ ...prev, [type]: true }));
      }
    } catch (err) {
      console.error("Error toggling reaction:", err);
    } finally {
      setTogglingType(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "2rem 0" }}>
        <Loader2 className="animate-spin" size={20} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div style={{ margin: "2.5rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {language === "ES" ? "¿Qué te pareció este artículo?" : "What did you think of this article?"}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
        {REACTION_CONFIG.map(({ type, emoji, label, color, activeGlow }) => {
          const isActive = userReactions[type];
          const isToggling = togglingType === type;
          const labelTranslated = language === "ES" ? label : ({
            "Me gusta": "Like",
            "Brillante": "Brilliant",
            "De acuerdo": "Agree",
            "Útil": "Useful"
          }[label] || label);

          return (
            <button
              key={type}
              onClick={() => handleToggleReaction(type)}
              disabled={isToggling}
              title={labelTranslated}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.2rem",
                borderRadius: "99px",
                background: isActive ? color : "rgba(255,255,255,0.02)",
                border: isActive
                  ? `1px solid ${activeGlow}`
                  : "1px solid rgba(255,255,255,0.05)",
                color: "white",
                fontSize: "1.1rem",
                cursor: isToggling ? "not-allowed" : "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? `0 0 15px -3px ${activeGlow}` : "none",
                transform: isToggling ? "scale(0.95)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isToggling) {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !isToggling) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                }
              }}
            >
              <span>{emoji}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: "600", color: isActive ? "white" : "rgba(255,255,255,0.6)" }}>
                {counts[type]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
