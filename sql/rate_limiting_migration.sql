-- Migración para crear tabla de rate limiting
-- Ejecutar en Supabase SQL Editor

CREATE TABLE score_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  submitted_at timestamp with time zone DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Índice para consultas rápidas de rate limiting
CREATE INDEX idx_score_submissions_client_time 
ON score_submissions(client_id, submitted_at);

-- Comentario: Esta tabla registra intentos de envío de scores para prevenir spam
-- No afecta la tabla 'leaderboard' existente 