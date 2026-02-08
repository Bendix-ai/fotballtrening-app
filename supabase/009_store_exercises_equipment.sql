-- ============================================================
-- FotballTrening App - Add equipment column
-- Run AFTER previous migrations
-- ============================================================

-- Add equipment column to store_exercises
ALTER TABLE public.store_exercises
    ADD COLUMN IF NOT EXISTS equipment TEXT NOT NULL DEFAULT '';

-- Add equipment column to exercises (club exercises)
ALTER TABLE public.exercises
    ADD COLUMN IF NOT EXISTS equipment TEXT NOT NULL DEFAULT '';
