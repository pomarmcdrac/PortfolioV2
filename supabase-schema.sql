-- Esquema de base de datos para comentarios y reacciones del blog en Supabase

-- =====================================================================
-- 1. Tabla de Comentarios
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT content_length CHECK (char_length(content) >= 2 AND char_length(content) <= 500)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Comentarios
CREATE POLICY "Permitir lectura pública de comentarios"
    ON public.blog_comments FOR SELECT
    USING (true);

CREATE POLICY "Permitir crear comentarios a usuarios verificados con Google"
    ON public.blog_comments FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = user_id
        -- Asegurar que el email está verificado por Google (Supabase Auth guarda esto en el JWT context)
        AND (auth.jwt() ->> 'email_verified')::boolean = true
    );

CREATE POLICY "Permitir eliminar sus propios comentarios"
    ON public.blog_comments FOR DELETE
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Trigger Anti-Spam: Limita a 1 comentario cada 30 segundos por usuario
CREATE OR REPLACE FUNCTION public.check_comment_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.blog_comments
        WHERE user_id = auth.uid()
          AND created_at > now() - INTERVAL '30 seconds'
    ) THEN
        RAISE EXCEPTION 'Por favor espera 30 segundos entre comentarios para evitar spam.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_comment_rate_limit
    BEFORE INSERT ON public.blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.check_comment_rate_limit();


-- =====================================================================
-- 2. Tabla de Reacciones
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.blog_reactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    blog_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Restricción para evitar múltiples reacciones iguales del mismo usuario en un post
    CONSTRAINT unique_user_reaction_per_blog UNIQUE (blog_slug, user_id, reaction_type),
    CONSTRAINT valid_reaction_types CHECK (reaction_type IN ('like', 'rocket', 'thumbs', 'lightbulb'))
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.blog_reactions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Reacciones
CREATE POLICY "Permitir lectura pública de reacciones"
    ON public.blog_reactions FOR SELECT
    USING (true);

CREATE POLICY "Permitir gestionar sus propias reacciones"
    ON public.blog_reactions FOR ALL
    USING (auth.role() = 'authenticated' AND auth.uid() = user_id);
