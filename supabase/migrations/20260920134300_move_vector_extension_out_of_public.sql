-- Move the relocatable pgvector extension out of the exposed public schema.
-- Type OIDs remain stable, so existing vector columns and indexes continue to work.
create schema if not exists extensions;
alter extension vector set schema extensions;
