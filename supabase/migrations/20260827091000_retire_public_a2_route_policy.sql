begin;

-- Follow-up for projects where the catalog policy predates the server-owned
-- A2/A3 boundary migration.
drop policy if exists "Rutas visibles para todos" on public.a2_learning_routes;

commit;
