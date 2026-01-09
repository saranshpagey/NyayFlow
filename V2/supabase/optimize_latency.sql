-- NYAYAFLOW OPTIMIZATION MIGRATION (RUN IN SUPABASE SQL EDITOR)
-- -------------------------------------------------------------

-- 1. INCREASE MEMORY FOR INDEX BUILDING
SET maintenance_work_mem = '64MB';

-- 2. UPGRADE DOCUMENTS TABLE TO HNSW (High Performance Search)
-- This removes the old slow index and adds the new fast one
DROP INDEX IF EXISTS documents_embedding_idx;
CREATE INDEX IF NOT EXISTS documents_hnsw_idx ON documents 
USING hnsw (embedding vector_cosine_ops);

-- 3. ACTIVATE SEMANTIC CACHE TABLE
CREATE TABLE IF NOT EXISTS answer_cache (
  id uuid primary key default uuid_generate_v4(),
  query_text text not null,
  query_embedding vector(768), 
  response_json jsonb not null,
  created_at timestamp with time zone default current_timestamp
);

CREATE INDEX IF NOT EXISTS answer_cache_embedding_idx on answer_cache 
USING ivfflat (query_embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. ACTIVATE CACHE MATCH FUNCTION
CREATE OR REPLACE FUNCTION match_cache(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  query_text text,
  response_json jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    answer_cache.id,
    answer_cache.query_text,
    answer_cache.response_json,
    1 - (answer_cache.query_embedding <=> match_cache.query_embedding) as similarity
  FROM answer_cache
  WHERE 1 - (answer_cache.query_embedding <=> match_cache.query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
