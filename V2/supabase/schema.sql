-- Create a table for public profiles (extends auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('advocate', 'firm_admin', 'student', 'judge')) default 'advocate',
  bar_enrollment_number text,
  organization text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Access policies (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for workspaces
create table workspaces (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    owner_id uuid references auth.users not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Link users to workspaces (Many-to-Many via membership)
create table workspace_members (
    workspace_id uuid references workspaces not null,
    user_id uuid references auth.users not null,
    role text check (role in ('owner', 'member', 'viewer')) default 'member',
    primary key (workspace_id, user_id)
);

-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists documents (
  id text primary key, -- LangChain uses UUID strings
  content text,
  metadata jsonb,
  embedding vector(768)
);

-- Add high-speed HNSW index for the documents table (pgvector 0.5.0+)
create index if not exists documents_hnsw_idx on documents 
using hnsw (embedding vector_cosine_ops);

-- Create a function to search for documents
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
  order by similarity desc
  limit match_count;
end;

-- 4. Create a table for Semantic Caching (Intelligence Memory)
create table if not exists answer_cache (
  id uuid primary key default uuid_generate_v4(),
  query_text text not null,
  query_embedding vector(768), 
  response_json jsonb not null,
  created_at timestamp with time zone default current_timestamp
);

-- Search index for semantic cache
create index if not exists answer_cache_embedding_idx on answer_cache 
using ivfflat (query_embedding vector_cosine_ops)
with (lists = 100);

-- Function to match cached answers
create or replace function match_cache(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  query_text text,
  response_json jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    answer_cache.id,
    answer_cache.query_text,
    answer_cache.response_json,
    1 - (answer_cache.query_embedding <=> match_cache.query_embedding) as similarity
  from answer_cache
  where 1 - (answer_cache.query_embedding <=> match_cache.query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
