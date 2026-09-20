# A4 Opportunity Engine v1 — source and recommendation contract

Date: 2026-09-20
Status: implementation contract

## Product outcome

A4 must end in real, currently actionable job opportunities. A recommendation is useful only when the user can understand why it appeared and can reach the original job publication.

## Current-state audit

DTC already has an authenticated A4 job-matching API, an active job-listings query with expiry filtering, a matching algorithm, A1–A4 evidence and Career Identity, plus historical LinkedIn-market and recommendation tables.

But the current experience still contains claims such as “100% match accuracy”, “AI analysis” and “Real-time updated daily” that are not supported by the runtime contract. Those claims must be retired.

The legacy A4 Supabase job-matching service also contains mock matching output and must not be used as recommendation evidence.

## Source contract

Every recommendable opportunity must contain: stable source id; title; company; location/remote status when known; original publication URL; source/provider; published_at when known; last_verified_at; verification_status; and description/requirements sufficient to explain the recommendation.

Allowed verification states:
- verified_active
- verified_restricted
- stale
- unavailable
- unknown

Only verified_active and verified_restricted may be presented as current recommendations.

verified_restricted means DTC has a traceable original URL but automated verification is limited; the UI must disclose that limitation.

## LinkedIn

LinkedIn is a first-class source target, but DTC must not fabricate LinkedIn inventory or label another provider as LinkedIn.

A LinkedIn recommendation requires a traceable original LinkedIn job publication URL. DTC should deep-link the user to that original publication.

Collection must use an authorized/sustainable access path. Until that path is connected, the engine may ingest user-provided LinkedIn job URLs or other verified feeds, but must not claim complete LinkedIn coverage.

## Recommendation explanation

Do not present an opaque universal “87% compatible” as truth.

For each opportunity expose evidence buckets:
- supported: requirement has user evidence;
- partial: related evidence exists but does not fully establish the requirement;
- missing: no supporting evidence found;
- unknown: job information is insufficient.

The recommendation card should answer why this job appeared, what evidence supports the fit, what is partial/missing, what to prepare before applying, where/when it was published or verified, and provide Open original publication.

## Inputs

Recommendation evidence can use Career Identity/A1 target and strengths; A2 evidence and execution artifacts; A3 interview evidence only for preparation/readiness, not role fit; A4 verified signals and reviewed decision memory; and explicit user job-search preferences.

Missing evidence stays missing. It is never inferred from generic profile text.

## Feedback loop

User actions: viewed, saved, dismissed, applied, external_result.

Applied can feed the A4 outcome loop. Subsequent recruiter/interview/offer events remain observations, not proof that DTC caused them.

## Fail-closed rules

- no original URL -> not recommendable;
- unknown/unavailable/stale -> not current recommendation;
- expired listing -> not current recommendation;
- synthetic/mock listing -> never user-facing recommendation;
- source mislabeled as LinkedIn -> reject;
- no profile evidence -> show insufficient evidence, not a low match score;
- no verified inventory -> honest empty state, never seeded fake jobs.

## V1 delivery order

1. canonical opportunity schema + source verification metadata;
2. adapter from current job listings;
3. evidence-based explainer;
4. Spanish recommendation UI;
5. action tracking;
6. authorized LinkedIn ingestion/deep-link adapter;
7. additional official employer/ATS feeds.
