-- ============================================================
-- FotballTrening App - Database Schema
-- Run this in Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE public.clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.year_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2030),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(club_id, year)
);

CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_group_id UUID NOT NULL REFERENCES public.year_groups(id) ON DELETE CASCADE,
    gender TEXT NOT NULL CHECK (gender IN ('boys', 'girls', 'mixed')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(year_group_id, gender)
);

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('admin', 'player')),
    club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    total_points INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    UNIQUE(username, club_id)
);

-- ============================================================
-- EXERCISE TABLES
-- ============================================================

CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    instructions TEXT NOT NULL DEFAULT '',
    image_url TEXT,
    video_url TEXT,
    duration_seconds INTEGER NOT NULL DEFAULT 120,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category TEXT NOT NULL CHECK (category IN ('warmup', 'strength', 'agility', 'skill', 'cooldown')),
    points INTEGER NOT NULL DEFAULT 10,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_by_club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.exercise_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, exercise_id)
);

-- ============================================================
-- ACHIEVEMENT TABLE
-- ============================================================

CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'first_exercise', 'streak_7', 'streak_30',
        'points_100', 'points_500', 'points_1000',
        'exercises_10', 'exercises_50', 'all_categories'
    )),
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, type)
);

-- ============================================================
-- EXERCISE STORE TABLES
-- ============================================================

CREATE TABLE public.store_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL CHECK (category IN ('warmup', 'strength', 'agility', 'skill', 'cooldown')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration_seconds INTEGER NOT NULL DEFAULT 120,
    points INTEGER NOT NULL DEFAULT 10,
    rating NUMERIC(2,1) NOT NULL DEFAULT 0,
    downloads INTEGER NOT NULL DEFAULT 0,
    author TEXT NOT NULL DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    instructions TEXT NOT NULL DEFAULT '',
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.store_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES public.store_exercises(id) ON DELETE CASCADE,
    club_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.store_downloads (
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    store_exercise_id UUID NOT NULL REFERENCES public.store_exercises(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (club_id, store_exercise_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_club_id ON public.profiles(club_id);
CREATE INDEX idx_profiles_team_id ON public.profiles(team_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_year_groups_club_id ON public.year_groups(club_id);
CREATE INDEX idx_teams_year_group_id ON public.teams(year_group_id);
CREATE INDEX idx_exercises_club_id ON public.exercises(created_by_club_id);
CREATE INDEX idx_exercises_public ON public.exercises(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_exercise_completions_user_id ON public.exercise_completions(user_id);
CREATE INDEX idx_exercise_completions_exercise_id ON public.exercise_completions(exercise_id);
CREATE INDEX idx_exercise_completions_completed_at ON public.exercise_completions(completed_at);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_store_reviews_exercise_id ON public.store_reviews(exercise_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
