# Security Wave 5 — SECURITY DEFINER views

Read-only production audit on 2026-09-15 found 20 public views reported by Supabase as SECURITY DEFINER. All 20 were selectable by both `anon` and `authenticated` even after their underlying relations were hardened by P0/Waves 2–4.

GitHub callsite searches found no active `.from(<view>)` consumer for the 20 views. `cerebro_intelligence_metrics` appears only in `CerebroIntelligence.getIntelligenceMetrics()`, and no caller of that method was found.

Wave 5 therefore keeps the views for controlled diagnostics but:

- sets `security_invoker=true`;
- revokes all privileges from `PUBLIC`, `anon`, and `authenticated`;
- grants `SELECT` explicitly to `service_role`.

The migration is not to be applied remotely until the disposable Supabase preflight passes twice and the PR Preview/CI are green.
