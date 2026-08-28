---
name: dtc-report-story
description: Improve the information architecture, Spanish explanation, accessibility, and next actions of DespegaTuCarrera reports without changing metric semantics. Use for report UX and narrative work after data meaning is known.
---

# DTC Report Story

Make the report help the user decide what to do next without overstating what the evidence proves. Preserve metric definitions from `$dtc-report-contract`.

## Shape each report

Use this hierarchy when the evidence supports it:

1. current stage and coverage;
2. a concise factual summary;
3. evidence breakdown and recency;
4. interpretation plus explicit limitation;
5. one primary next action and relevant detail links.

Write natural Chilean Spanish. Prefer concrete labels such as “días completados” and “sesiones verificadas” over internal schema vocabulary. Distinguish observation, self-report, automated evaluation, and recommendation. Avoid employability guarantees, diagnostic language, unexplained composite scores, and congratulatory copy when evidence is absent.

## Design states deliberately

- Empty: say what is missing, why the report cannot conclude more, and how to create the first evidence.
- Partial: show coverage and avoid presenting partial averages as comprehensive.
- Error: preserve context and give a safe retry or recovery action.
- Complete: summarize evidence without hiding limitations or timestamps.

Use semantic headings, visible focus, accessible names, sufficient contrast, and tables only for exact comparisons. On narrow screens, prevent horizontal clipping and keep the main action reachable. Reuse established report components before adding another visual language.

Verify both the page and the integral summary so the same stage is described consistently. Hand material changes to `$dtc-report-quality`.
