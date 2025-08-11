-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.palettes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  name text,
  colors jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT palettes_pkey PRIMARY KEY (id)
);