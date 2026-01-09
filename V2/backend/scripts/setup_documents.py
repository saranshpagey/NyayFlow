
import os
from supabase.client import create_client
from dotenv import load_dotenv

load_dotenv()

def optimize_documents_table():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ Missing Supabase credentials in .env")
        return

    supabase = create_client(url, key)
    
    print("🛠️  Optimizing 'documents' table...")

    # SQL to create/verify table and ADD INDEX
    # Using IVFFlat for stability on smaller instances.
    sql = """
    -- 0. INCREASE MEMORY FOR INDEX BUILD (Fixes 54000 Error)
    SET maintenance_work_mem = '64MB';

    -- Ensure extension
    create extension if not exists vector;

    -- Ensure Table
    create table if not exists documents (
        id uuid primary key default uuid_generate_v4(),
        content text,
        metadata jsonb,
        embedding vector(768) -- text-embedding-004
    );

    -- DROP existing index if any to rebuild (ensures freshness)
    drop index if exists documents_embedding_idx;

    -- Create IVFFlat Index (Lists = rows / 1000 is rule of thumb, assuming <100k rows, 100 is fine)
    create index documents_embedding_idx 
    on documents 
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

    -- Optimized Match Function
    -- DROP ALL variations to be safe
    DROP FUNCTION IF EXISTS match_documents(vector, float, int);
    DROP FUNCTION IF EXISTS match_documents(vector, double precision, int);

    create or replace function match_documents (
        query_embedding vector(768),
        match_threshold float,
        match_count int
    )
    returns table (
        id text,
        content text,
        metadata jsonb,
        similarity float
    )
    language plpgsql
    as $$
    begin
        return query
        select
            documents.id,
            documents.content,
            documents.metadata,
            1 - (documents.embedding <=> query_embedding) as similarity
        from documents
        where 1 - (documents.embedding <=> query_embedding) > match_threshold
        order by documents.embedding <=> query_embedding
        limit match_count;
    end;
    $$;
    """

    print("\n📝 PLEASE RUN THIS SQL IN SUPABASE EDITOR TO FIX TIMEOUTS:")
    print("-" * 50)
    print(sql)
    print("-" * 50)
    print("\n⚠️  Note: If you have >10k rows, run this inside Supabase dashboard directly.")

if __name__ == "__main__":
    optimize_documents_table()
