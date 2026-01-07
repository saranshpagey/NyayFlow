import os
from supabase.client import create_client
from dotenv import load_dotenv

load_dotenv()

def setup_cache_table():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ Missing Supabase credentials in .env")
        return

    supabase = create_client(url, key)
    
    print("🛰️ Setting up 'answer_cache' table in Supabase...")
    
    # We use RPC to run SQL if the service key has permissions, 
    # but usually we just provide the SQL for the user or try to run an edge function/direct query.
    # For simplicity in this environment, I will provide the SQL and try to check if I can execute it.
    
    sql = """
    CREATE TABLE IF NOT EXISTS answer_cache (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        query_text TEXT NOT NULL,
        query_embedding VECTOR(768), -- Dimension for text-embedding-004
        response_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS answer_cache_embedding_idx ON answer_cache 
    USING ivfflat (query_embedding vector_cosine_ops)
    WITH (lists = 100);
    
    -- Function to match cached answers
    CREATE OR REPLACE FUNCTION match_cache(
        query_embedding VECTOR(768),
        match_threshold FLOAT,
        match_count INT
    )
    RETURNS TABLE (
        id UUID,
        query_text TEXT,
        response_json JSONB,
        similarity FLOAT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
        SELECT
            answer_cache.id,
            answer_cache.query_text,
            answer_cache.response_json,
            1 - (answer_cache.query_embedding <=> match_cache.query_embedding) AS similarity
        FROM answer_cache
        WHERE 1 - (answer_cache.query_embedding <=> match_cache.query_embedding) > match_threshold
        ORDER BY answer_cache.query_embedding <=> match_cache.query_embedding
        LIMIT match_count;
    END;
    $$;
    """
    
    print("\n📝 PLEASE RUN THE FOLLOWING SQL IN YOUR SUPABASE DASHBOARD SQL EDITOR:")
    print("-" * 50)
    print(sql)
    print("-" * 50)
    print("\n✅ Once run, semantic caching will be fully active.")

if __name__ == "__main__":
    setup_cache_table()
