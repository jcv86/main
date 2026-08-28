-- DTC documents contain user-owned career evidence. Demo fixtures must not be
-- readable by anonymous users or by unrelated authenticated users.
drop policy if exists dtc_documents_demo_read on public.dtc_documents;
