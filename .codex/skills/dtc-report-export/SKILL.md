---
name: dtc-report-export
description: Implement or verify printable and PDF-ready DespegaTuCarrera reports, including pagination, provenance, privacy, and parity with the authenticated screen. Use when users need a portable report or export defects appear.
---

# DTC Report Export

Treat browser print/save-as-PDF as a report surface, not a button-only feature. Begin with `components/reports/print-report-button.tsx` and the report route being exported.

## Export requirements

- Export only the authenticated user's server-derived report.
- Keep displayed metrics and interpretations identical to the screen contract.
- Include report title, stage coverage, generated-at time, evidence cutoff when known, and a concise limitation note.
- Exclude navigation, interactive-only controls, debug data, secrets, internal IDs, hidden demo content, and unnecessary personal identifiers.
- Preserve headings with their content, prevent clipped cards/tables, avoid orphaned labels, and use readable print contrast.
- Do not imply a server-generated or signed artifact when the browser is only printing the page.

Use print CSS intentionally for page size, margins, breaks, link treatment, and color adjustment. Prefer HTML text that remains selectable over screenshots of the report.

## Verify the artifact

Test populated, partial, and empty reports. Inspect print preview and at least one generated PDF at representative page sizes. Confirm page count is reasonable, no blank terminal page appears, content is neither clipped nor duplicated, and screen/PDF values match. If PDF generation creates a local artifact solely for verification, keep it out of git.

Finish with `$dtc-report-quality`; a working click handler alone is not a passing export.
