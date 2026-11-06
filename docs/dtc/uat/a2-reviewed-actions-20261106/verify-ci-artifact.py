#!/usr/bin/env python3
"""Verify an extracted AG04 CI artifact without changing code or raw evidence.

Usage: python verify-ag04-ci-artifact.py DIR FULL_CANDIDATE_SHA [--repo PATH]

The only output file is DIR/verified-summary.json. A failed check writes FAIL,
never a partial PASS. The caller must separately verify the GitHub run identity,
conclusion, artifact metadata and downloaded ZIP digest. This script does not
contact GitHub, execute application code, use a database, or rerun the tests.
"""

from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import struct
import subprocess
import sys
from typing import Any


class VerificationError(Exception):
    pass


def require(condition: Any, message: str) -> None:
    if not condition:
        raise VerificationError(message)


def digest(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def integer(value: Any, minimum: int = 0) -> bool:
    return type(value) is int and value >= minimum


def strict_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        require(key not in result, "JSON contains a duplicate key")
        result[key] = value
    return result


def reject_constant(value: str) -> None:
    raise VerificationError(f"Invalid non-finite JSON constant: {value}")


PROGRESS_TABLES = [
    "despega_user_profiles", "despega_journey_state", "a2_user_task_completions",
    "a3_user_progress", "a3_route_progression", "user_gamification_profile", "user_dtc_balance",
]

ACTION_SOURCES = {
    "app/despega/a2/coach/page.tsx", "components/a2-chat-coach.tsx",
    "components/a2-assistant-action.tsx", "components/a2-reviewed-plan.tsx",
    "components/layout/app-shell.tsx",
    "app/api/a2/assistant-actions/route.ts", "app/api/despega/a2-coach/route.ts",
    "lib/a2/assistant-action-contract.ts", "lib/a2/assistant-action-api.ts",
    "lib/a2/assistant-action-service.ts", "lib/a2/assistant-contract.ts",
    "lib/a2/practice-adjustment.ts", "lib/a2/api-access.ts", "lib/a2/plan-contract.ts",
    "lib/a2/plan-context.ts", "lib/a2/plan-service.ts", "lib/journey/next-action.ts",
    "lib/journey/next-action-service.ts", "lib/journey/service.ts",
    "lib/a2/swarm/contracts.ts", "lib/a2/swarm/runtime.ts", "lib/a2/swarm/openai.ts",
    "lib/a2/swarm/canary.ts",
}

PLAN_SOURCES = {
    "app/despega/a2/coach/page.tsx", "components/a2-chat-coach.tsx",
    "components/a2-reviewed-plan.tsx", "components/a2-assistant-action.tsx",
    "app/api/a2/assistant-actions/route.ts", "app/api/a2/plan/route.ts",
    "app/api/despega/a2-coach/route.ts", "lib/a2/assistant-contract.ts",
    "lib/a2/swarm/contracts.ts", "lib/a2/swarm/runtime.ts", "lib/a2/swarm/openai.ts",
    "lib/a2/swarm/canary.ts", "lib/a2/plan-api.ts", "lib/a2/plan-context.ts",
    "lib/a2/plan-contract.ts", "lib/a2/plan-service.ts",
    "lib/a2/assistant-action-contract.ts", "lib/a2/assistant-action-api.ts",
    "lib/a2/assistant-action-service.ts",
}

ACTION_LIMITS = [
    "real provider output, utility, latency, cost or real canary traffic",
    "remote migration, deployment, production document schema or external OAuth",
    "global transactional freshness across independent context writes",
    "physical mobile, touch or Safari; mobile means Chromium viewport 390 by 844",
    "manual UAT participant cases or effectiveness of the practice",
]

PLAN_LIMITS = [
    "model quality, model calls or generated plan quality",
    "remote deployment or migration application",
    "atomic freshness across independent context source writes",
    "a real participant completing A2 or the manual UAT cases",
]

ACTION_COMMON_STEPS = [
    "proposal and edits do not write; explicit confirmation persists the exact reviewed adjustment and receipt",
    "identical command replays without writes and a real reload recovers the confirmed adjustment as canonical context",
    "all adjustment operations preserve complete snapshots of seven canonical progress and XP tables",
]
ACTION_STEPS = {
    (phase, name) for phase in ("desktop", "mobile") for name in ACTION_COMMON_STEPS
} | {
    ("desktop", "source changes reject stale confirmation, preserve the draft and require explicit context review before a new command"),
    ("desktop", "lost delivery preserves the exact command; retry acknowledges its receipt without resurrecting a later deletion"),
    ("desktop", "account change during real committed HTTP delivery clears personal UI and rejects the prior actor result"),
    ("mobile", "mobile lost delivery retries the exact command and confirms its current saved effect without duplicate writes"),
    ("access", "actual API rejects anonymous reads and A2-locked reads and confirmations before any action document or receipt"),
    ("access", "missing canonical state rejects read and confirmation without initialization or any canonical progress mutation"),
    ("access", "wrong expected actor and revoked admission reject both read and confirmation without persistence effects"),
}

PLAN_COMMON_STEPS = [
    "actual email login and owner GET show no prior plan",
    "explicit save persists through reload and paused plans resume from the same owner slot",
    "correction, declared step completion, completion and cancellation preserve explicit user control",
    "all plan operations leave the complete canonical progress and XP snapshots unchanged",
]
PLAN_STEPS = {
    (phase, name) for phase in ("desktop", "mobile") for name in PLAN_COMMON_STEPS
} | {
    ("desktop", "real CAS conflict preserves the local draft until explicit comparison and a fresh save"),
    ("desktop", "source changes require explicit re-review and preserve the canonical continuation"),
    ("desktop", "real read and source failures preserve saved data and never present a false fresh or empty plan"),
    ("desktop", "a real tab return refreshes source freshness while retaining the editor for explicit review"),
    ("desktop", "lost ACK retains the draft; GET does not confirm the command; exact replay returns receipt plus current deletion"),
    ("desktop", "actual account change during delivery clears personal UI and cannot apply the prior actor response"),
    ("mobile", "mobile editor caps steps at five and preserves focus when removing them"),
    ("mobile", "mobile deletion requires confirmation, purges content and retains the owner revision tombstone"),
    ("access", "actual API rejects anonymous and admitted-but-A2-locked owners without creating a plan"),
}

ACTION_VISUALS = {
    ("desktop", name) for name in ("review", "saved", "context-conflict", "replay-after-deletion", "account-change")
} | {("mobile", name) for name in ("review", "saved", "recovered-confirmation")}
PLAN_VISUALS = {
    ("desktop", name) for name in ("editor", "completed", "conflict-retains-draft", "replay-after-deletion", "account-change")
} | {("mobile", name) for name in ("editor", "completed", "deleted")}

PRODUCERS = [
    ".github/workflows/a1-browser-qa.yml",
    "scripts/a1-browser-qa/a2-action-prepare.mjs", "scripts/a1-browser-qa/a2-action-seed.ts",
    "scripts/a1-browser-qa/a2-action-advisors.mjs", "scripts/a1-browser-qa/a2-action-browser.mjs",
    "scripts/test-a2-action-sql.mjs", "scripts/test-a2-action-contract.mjs", "scripts/test-a2-action-api.mjs",
    "scripts/a1-browser-qa/a2-plan-prepare.mjs", "scripts/a1-browser-qa/a2-plan-seed.ts",
    "scripts/a1-browser-qa/a2-plan-advisors.mjs", "scripts/a1-browser-qa/a2-plan-browser.mjs",
    "scripts/test-a2-plan-sql.mjs", "scripts/test-a2-plan-contract.mjs", "scripts/test-a2-plan-api.mjs",
    "scripts/a1-browser-qa/focus-visibility-preflight.mjs",
    "scripts/a1-browser-qa/prepare-native-tab-focus.mjs", "scripts/a1-browser-qa/native-tab-return.mjs",
    "scripts/test-a2-assistant.cjs", "scripts/test-a2-swarm.mjs",
    "scripts/test-a2-swarm-provider.mjs", "scripts/test-a2-swarm-canary.mjs",
]


class Verifier:
    def __init__(self, directory: Path, candidate: str, repo: Path):
        self.directory, self.candidate, self.repo = directory.resolve(), candidate, repo.resolve()
        self.files: dict[str, list[Path]] = {}
        self.inputs: dict[str, dict[str, Any]] = {}
        self.json_cache: dict[str, dict[str, Any]] = {}
        self.source_cache: dict[str, tuple[bytes, dict[str, Any]]] = {}
        self.missing_commit_fields: list[str] = []

    def git(self, *args: str) -> bytes:
        result = subprocess.run(
            ["git", "-C", str(self.repo), *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            env={**os.environ, "GIT_OPTIONAL_LOCKS": "0"}, check=False,
        )
        require(result.returncode == 0, "Read-only git command failed: " + " ".join(args))
        return result.stdout

    def initialize(self) -> str:
        require(bool(re.fullmatch(r"[0-9a-f]{40}", self.candidate)), "Candidate must be a full lowercase 40-character commit SHA")
        require(self.directory.is_dir(), "Artifact directory does not exist")
        require(self.git("rev-parse", self.candidate + "^{commit}").decode().strip() == self.candidate,
                "Candidate does not resolve to the exact supplied commit")
        require(Path(self.git("rev-parse", "--show-toplevel").decode().strip()).resolve() == self.repo,
                "--repo must point to the repository root")
        for path in self.directory.rglob("*"):
            require(not path.is_symlink(), "Artifact contains a symbolic link: " + str(path.relative_to(self.directory)))
            if not path.is_file():
                continue
            name = path.name.lower()
            require(not (".private" in name or name.endswith(".har") or name.startswith(".env")
                        or re.search(r"storage[-_]?state", name)),
                    "Artifact contains a private or credential-bearing filename: " + str(path.relative_to(self.directory)))
            self.files.setdefault(path.name, []).append(path)
        return self.git("rev-parse", self.candidate + "^{tree}").decode().strip()

    def file(self, name: str) -> Path:
        matches = self.files.get(name, [])
        require(len(matches) == 1, f"Expected one {name}, found {len(matches)}")
        return matches[0]

    def read_json(self, name: str) -> dict[str, Any]:
        if name in self.json_cache:
            return self.json_cache[name]
        path = self.file(name)
        require(path.stat().st_size <= 32 * 1024 * 1024, f"JSON unexpectedly large: {name}")
        raw = path.read_bytes()
        try:
            value = json.loads(raw, object_pairs_hook=strict_object, parse_constant=reject_constant)
        except (UnicodeError, json.JSONDecodeError) as error:
            raise VerificationError(f"Invalid JSON in {name}: {type(error).__name__}") from error
        require(isinstance(value, dict), f"Expected a JSON object in {name}")
        self.inputs[name] = {"path": str(path.relative_to(self.directory)), "bytes": len(raw), "sha256": digest(raw)}
        self.json_cache[name] = value
        for key in ("commit", "sourceCommit"):
            if key in value:
                require(value[key] == self.candidate, f"Wrong {key} in {name}")
        return value

    def source(self, path: str, claimed: str | None = None) -> tuple[bytes, dict[str, Any]]:
        if path not in self.source_cache:
            relative = PurePosixPath(path)
            require(isinstance(path, str) and not relative.is_absolute() and ".." not in relative.parts
                    and "\\" not in path and str(relative) == path, "Unsafe or noncanonical source path")
            local = self.repo / path
            require(local.is_file() and not local.is_symlink() and local.resolve().is_relative_to(self.repo),
                    "Missing or unsafe local source: " + path)
            committed = self.git("show", self.candidate + ":" + path)
            candidate_hash = digest(committed)
            local_hash = digest(local.read_bytes())
            require(candidate_hash == local_hash, "Checkout differs from candidate: " + path)
            self.source_cache[path] = (committed, {
                "path": path, "sha256": candidate_hash, "candidateMatchesLocal": True,
            })
        data, record = self.source_cache[path]
        if claimed is not None:
            require(bool(re.fullmatch(r"[0-9a-f]{64}", claimed)), "Invalid source digest: " + path)
            require(claimed == record["sha256"], "Artifact source digest differs from candidate/local: " + path)
        return data, record.copy()

    def verdict(self, name: str) -> dict[str, Any]:
        value = self.read_json(name)
        require(value.get("verdict") == "PASS", f"{name} is not PASS")
        require(value.get("failure") is None, f"{name} records a failure")
        if "commit" not in value and "sourceCommit" not in value:
            self.missing_commit_fields.append(name)
        return value

    def scope(self, prefix: str, expected_sources: set[str], limits: list[str]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        name = prefix + "-scope.json"
        value = self.read_json(name)
        require(value.get("commit") == self.candidate, f"Missing candidate anchor in {name}")
        expected_environment = "disposable-local-" + prefix
        require(value.get("environment") == expected_environment, f"Unexpected environment in {name}")
        copied = value.get("copied")
        require(isinstance(copied, list) and all(isinstance(item, dict) for item in copied), f"Invalid copied sources in {name}")
        paths = [item.get("path") for item in copied]
        require(all(isinstance(path, str) for path in paths), f"Invalid source paths in {name}")
        require(len(paths) == len(set(paths)), f"Duplicate source paths in {name}")
        require(set(paths) == expected_sources, f"Wrong source set in {name}: missing={sorted(expected_sources - set(paths))}, extra={sorted(set(paths) - expected_sources)}")
        require(all(isinstance(item.get("sha256"), str) and re.fullmatch(r"[0-9a-f]{64}", item["sha256"]) for item in copied),
                f"A copied source digest is missing or malformed in {name}")
        verified = [self.source(item["path"], item.get("sha256"))[1] for item in copied]
        for key in ("genuine", "fixtures", "substitutions", "notVerified"):
            require(isinstance(value.get(key), list) and value[key] and all(isinstance(item, str) and item for item in value[key]),
                    f"Missing declared scope {key} in {name}")
        require(set(limits).issubset(set(value["notVerified"])), f"Missing limits in {name}")
        require(isinstance(value.get("privacy"), str) and bool(value["privacy"]), f"Missing privacy scope in {name}")
        return value, verified

    def seed(self, prefix: str, owners: int, eligible: int) -> dict[str, Any]:
        value = self.verdict(prefix + "-seed.json")
        migration = "20261106221437_a2_assistant_action_receipts.sql" if prefix == "a2-action" else "20261106201731_a2_reviewed_plan_atomic.sql"
        require(value.get("migration") == migration, f"Wrong {prefix} seed migration")
        require(value.get("migrationAppliedTwice") is True, f"{prefix} migration was not applied twice")
        require(value.get("syntheticAuthOwnersCreated") == owners and value.get("eligibleA2") == eligible
                and value.get("admittedWithoutA2") == 1, f"Wrong {prefix} browser owner setup")
        require(value.get("remoteOperations") == 0, f"{prefix} seed reports remote operations")
        _, migration_source = self.source("supabase/migrations/" + migration)
        if prefix == "a2-action":
            require(value.get("migrationSha256") == migration_source["sha256"], "AG04 migration digest differs from candidate/local")
            require(value.get("initialActionReceipts") == 0 and value.get("initialOwnerDocuments") == 0,
                    "AG04 browser fixtures did not begin empty")
            require(value.get("contextFixture") == "Inherited minimal dtc_documents owner SELECT/INSERT from AG03; actual new receipt/RPC schema.",
                    "Missing inherited-document-fixture declaration")
        else:
            require(value.get("initialPlanRows") == 0, "AG03 browser fixtures did not begin empty")
        return {"migration": migration, "migrationAppliedTwice": True,
                "migrationSource": migration_source, "migrationHashEmbeddedInSeed": "migrationSha256" in value,
                "syntheticBrowserOwners": owners, "eligibleA2": eligible, "admittedWithoutA2": 1,
                "remoteOperations": 0, "contextFixture": value.get("contextFixture"),
                "canonicalProgress": value.get("canonicalProgress")}

    def sql(self, prefix: str, owners: int, migration: str) -> dict[str, Any]:
        name = prefix + "-sql.json"
        value = self.verdict(name)
        expected_scope = "disposable-local-postgresql-a2-action" if prefix == "a2-action" else "disposable-local-postgresql"
        require(value.get("scope") == expected_scope and value.get("migration") == migration, f"Wrong SQL scope or migration in {name}")
        require(value.get("syntheticOwnersCreated") == owners, f"Wrong synthetic SQL owner count in {name}")
        require(value.get("syntheticOwnersRemoved") is True and value.get("browserOwnersUnchanged") is True,
                f"SQL cleanup or browser-owner preservation failed in {name}")
        require(value.get("remoteOperations") == 0, f"Remote SQL operation reported in {name}")
        cases = value.get("cases")
        require(isinstance(cases, list) and cases, f"Missing SQL cases in {name}")
        require(all(isinstance(case, dict) and isinstance(case.get("name"), str)
                    and case.get("verdict") == "PASS" and not case.get("error") for case in cases),
                f"A SQL case failed or is malformed in {name}")
        names = [case["name"] for case in cases]
        require(len(names) == len(set(names)), f"Duplicate SQL case names in {name}")
        source, _ = self.source(f"scripts/test-{prefix}-sql.mjs")
        literal_cases = set(re.findall(r"await run\('([^'\n]+)'\s*,", source.decode()))
        require(literal_cases, f"Could not identify literal SQL scenarios in the candidate producer for {name}")
        if prefix == "a2-action":
            dynamic_cases = {f"A {table} fault rolls back both the effect and receipt" for table in ("dtc_documents", "a2_assistant_action_receipts")}
            require(value.get("context") == "Dated server projection; action writes serialize their consumed adjustment, without a global legacy/source fence.",
                    "AG04 SQL context limitation is missing")
        else:
            dynamic_cases = {f"real failure at {target} rolls back current/history/receipt and same command can retry" for target in ("current", "history", "receipt")}
        required_cases = literal_cases | dynamic_cases
        require(required_cases == set(names), f"SQL scenario set differs from candidate producer in {name}: missing={sorted(required_cases - set(names))}, extra={sorted(set(names) - required_cases)}")
        return {"scope": expected_scope, "casesPassed": len(cases), "caseNames": names,
                "syntheticOwnersCreated": owners, "syntheticOwnersRemoved": True,
                "browserOwnersUnchanged": True, "remoteOperations": 0,
                "invarianceEvidence": "Passing producer assertions compare complete seeded before/after rows; raw row snapshots are not present in this summary."}

    def advisors(self, prefix: str) -> dict[str, Any]:
        value = self.verdict(prefix + "-advisors.json")
        require(value.get("candidateFindings") == [], f"{prefix} candidate has security findings")
        require(integer(value.get("totalLaboratoryFindings")), f"Invalid total advisor findings for {prefix}")
        require(value.get("remoteOperations") == 0, f"{prefix} advisors were not local-only")
        require(value.get("cliVersion") == "2.117.0", f"Unexpected advisor CLI version for {prefix}")
        require(value.get("command") == "supabase db advisors --local --type security --level warn --output-format json",
                f"Unexpected advisor command for {prefix}")
        expected_scope = "AG04 private receipts/functions plus the inherited document fixture" if prefix == "a2-action" else "candidate A2 plan tables, private history/receipts and functions"
        require(value.get("scope") == expected_scope, f"Unexpected advisor scope for {prefix}")
        return {"scope": value["scope"], "candidateFindings": 0,
                "totalLaboratoryFindings": value["totalLaboratoryFindings"], "cliVersionReported": value["cliVersion"],
                "command": value["command"], "remoteOperations": 0}

    def screenshots(self, prefix: str, layouts: list[dict[str, Any]]) -> list[dict[str, Any]]:
        results = []
        for layout in layouts:
            name = f"{prefix}-{layout['phase']}-{layout['name']}.png"
            path = self.file(name)
            raw = path.read_bytes()
            require(len(raw) > 33 and raw[:8] == b"\x89PNG\r\n\x1a\n" and raw[12:16] == b"IHDR",
                    "Missing or invalid PNG: " + name)
            width, height = struct.unpack(">II", raw[16:24])
            # Both harnesses capture fullPage:true and record scrollWidth. In
            # headed Chromium a classic scrollbar can occupy viewport pixels
            # outside that document capture. Require the exact observed document
            # width; do not introduce a viewport tolerance or an assumed offset.
            require(width == layout["document"] and height > 0,
                    "Full-page screenshot width does not match the recorded document: " + name)
            results.append({"name": name, "path": str(path.relative_to(self.directory)), "bytes": len(raw),
                            "sha256": digest(raw), "width": width, "height": height,
                            "recordedViewportWidth": layout["viewport"], "recordedDocumentWidth": layout["document"],
                            "widthCheck": "exact full-page document width"})
        return results

    def browser(self, prefix: str, scope: dict[str, Any], essential_steps: set[tuple[str, str]],
                essential_visuals: set[tuple[str, str]]) -> tuple[dict[str, Any], dict[str, Any]]:
        name = prefix + "-browser-results.json"
        value = self.verdict(name)
        require(value.get("commit") == self.candidate, f"Missing candidate anchor in {name}")
        require(value.get("scope") == scope["environment"], f"Browser scope mismatch in {name}")
        require(value.get("notVerified") == scope["notVerified"], f"Browser limits differ from scope in {name}")
        require(value.get("progressTablesCompared") == PROGRESS_TABLES, f"The seven canonical invariants are incomplete in {name}")
        require(value.get("javascriptErrors") == [] and value.get("blockedHosts") == [], f"JavaScript errors or external requests in {name}")
        require(value.get("failureScreenshot") is None, f"Unexpected failure capture in {name}")
        steps = value.get("steps")
        require(isinstance(steps, list) and steps, f"Missing browser steps in {name}")
        require(all(isinstance(step, dict) and step.get("status") == "PASS"
                    and isinstance(step.get("phase"), str) and isinstance(step.get("name"), str) for step in steps),
                f"A browser step failed or is malformed in {name}")
        step_keys = [(step["phase"], step["name"]) for step in steps]
        require(len(set(step_keys)) == len(step_keys), f"Duplicate browser steps in {name}")
        require(essential_steps.issubset(set(step_keys)), f"Essential browser scenarios missing in {name}: {sorted(essential_steps - set(step_keys))}")
        layouts, scans = value.get("layouts"), value.get("accessibility")
        require(isinstance(layouts, list) and isinstance(scans, list) and layouts and scans,
                f"Missing visual or accessibility evidence in {name}")
        for kind, entries in (("layout", layouts), ("axe", scans)):
            require(all(isinstance(row, dict) and row.get("phase") in ("desktop", "mobile")
                        and isinstance(row.get("name"), str) and re.fullmatch(r"[a-z0-9-]+", row["name"]) for row in entries),
                    f"Malformed {kind} record in {name}")
        layout_keys = [(row["phase"], row["name"]) for row in layouts]
        scan_keys = [(row["phase"], row["name"]) for row in scans]
        require(len(set(layout_keys)) == len(layout_keys) and len(set(scan_keys)) == len(scan_keys), f"Duplicate visual evidence in {name}")
        require(set(layout_keys) == set(scan_keys) and essential_visuals.issubset(set(layout_keys)),
                f"Missing or mismatched visual/accessibility stages in {name}")
        for layout in layouts:
            expected_width = 1440 if layout["phase"] == "desktop" else 390
            require(layout.get("viewport") == expected_width and integer(layout.get("document"), 1)
                    and layout["document"] <= layout["viewport"] + 1, f"Horizontal overflow or invalid layout in {name}")
        for scan in scans:
            require(scan.get("violations") == [], f"Accessibility violations in {name}: {scan['phase']}/{scan['name']}")
            require(isinstance(scan.get("incomplete"), list) and all(isinstance(rule, str) and rule for rule in scan["incomplete"]),
                    f"Incomplete accessibility results were omitted in {name}")
        failures = value.get("requestFailures")
        require(isinstance(failures, list), f"HTTP failures not separately recorded in {name}")
        require(isinstance(value.get("controlledFaults"), list), f"Missing controlled-fault records in {name}")
        screenshots = self.screenshots(prefix, layouts)
        return value, {
            "stepsPassed": len(steps), "stepsByPhase": dict(Counter(step["phase"] for step in steps)),
            "steps": steps, "progressTablesCompared": PROGRESS_TABLES,
            "canonicalInvariantEvidence": "Passing desktop/mobile full-snapshot comparison scenarios; no raw canonical row snapshots are exported.",
            "accessibilityScans": len(scans), "accessibilityViolations": [],
            "incompleteScans": sum(bool(scan["incomplete"]) for scan in scans),
            "incompleteResults": sum(len(scan["incomplete"]) for scan in scans),
            "incompleteRules": sorted({rule for scan in scans for rule in scan["incomplete"]}),
            "accessibility": scans, "layouts": layouts,
            "javascriptErrors": 0, "externalRequests": 0,
            "recordedRequestFailures": failures, "recordedRequestFailureCount": len(failures),
            "controlledFaults": value["controlledFaults"], "screenshots": screenshots,
            "screenshotReview": "PNG presence, dimensions and SHA-256 verified; human visual review is not performed by this script.",
            "transport": value.get("transport"), "notVerified": value["notVerified"],
        }

    @staticmethod
    def fault(value: dict[str, Any], phase: str, kind: str, expected: dict[str, Any]) -> dict[str, Any]:
        found = [item for item in value["controlledFaults"] if isinstance(item, dict)
                 and item.get("phase") == phase and item.get("kind") == kind]
        require(len(found) == 1, f"Expected one controlled fault {phase}/{kind}")
        require(all(found[0].get(key) == target for key, target in expected.items()), f"Controlled-fault assertions incomplete: {phase}/{kind}")
        return found[0]

    def action_browser(self, value: dict[str, Any], scope: dict[str, Any], summary: dict[str, Any]) -> None:
        require("only the assistant generation HTTP response is a declared synthetic reviewed proposal" in scope["substitutions"],
                "AG04 generation substitution is not declared")
        require("minimal dtc_documents table inherited explicitly from AG03; its production creation migration is absent" in scope["fixtures"],
                "AG04 production document-schema limitation is not declared")
        require(value.get("transport") == "Actual UI, email Auth, action API, owner RLS and PostgreSQL. Only assistant generation responses use declared synthetic proposals.",
                "AG04 transport declaration changed or is missing")
        fixtures = value.get("generationFixtures")
        require(isinstance(fixtures, list) and fixtures, "Missing declared generation fixtures")
        require(all(isinstance(item, dict) and item.get("replacement") == "assistant-generation-http-only"
                    and item.get("contextRead") == "actual-action-api" and isinstance(item.get("label"), str)
                    and item.get("phase") in ("desktop", "mobile") for item in fixtures),
                "A generation fixture exceeds the declared substitution boundary")
        keys = [(item["phase"], item["label"]) for item in fixtures]
        require(len(keys) == len(set(keys)), "Duplicate generation fixture deliveries")
        required = {("desktop", label) for label in ("desktop-first", "context-conflict", "desktop-lost-delivery", "account-change")}
        required |= {("mobile", label) for label in ("mobile-first", "mobile-lost-delivery")}
        require(required.issubset(set(keys)), "Essential reviewed proposal fixtures are missing")
        for phase, deleted, effect in (("desktop", True, "removed"), ("mobile", False, "present")):
            self.fault(value, phase, "lost_http_after_verified_commit", {
                "exactReplay": True, "laterDeletion": deleted, "currentEffect": effect,
                "unchangedPersistenceOnReplay": True,
            })
        self.fault(value, "access", "missing_canonical_journey_fixture", {
            "ownerFixture": "a2-action-locked",
            "setup": "one local journey row deleted after genuine login; existing session reused without page navigation",
        })
        summary.update({"generationFixtureCount": len(fixtures), "generationFixtures": fixtures,
                        "modelGeneration": "synthetic; no live model result is certified",
                        "exactReplayAndAntiResurrection": True,
                        "missingJourneyGetAndPostDeniedWithoutInitialization": True})

    @staticmethod
    def native_return(value: Any, label: str) -> None:
        require(isinstance(value, dict), f"Missing native return: {label}")
        require(value.get("mechanism") == "headed_chromium_native_tab_activation"
                and value.get("focusEmulation") == "disabled_in_pinned_adapter", f"Unexpected native-return mechanism: {label}")
        require(value.get("away") == {"page": {"visibility": "hidden", "focused": False},
                                     "sibling": {"visibility": "visible", "focused": True}}, f"Native departure not observed: {label}")
        require(value.get("returned") == {"page": {"visibility": "visible", "focused": True},
                                         "sibling": {"visibility": "hidden", "focused": False}}, f"Native return not observed: {label}")
        events = value.get("events")
        require(isinstance(events, list) and all(isinstance(event, dict) for event in events), f"Missing native events: {label}")
        hidden = [index for index, event in enumerate(events) if event.get("type") == "visibilitychange"
                  and event.get("isTrusted") is True and event.get("visibility") == "hidden"]
        require(hidden, f"No trusted hidden event: {label}")
        after = events[hidden[0] + 1:]
        require(any(event.get("type") == "visibilitychange" and event.get("isTrusted") is True
                    and event.get("visibility") == "visible" for event in after), f"No trusted visible return: {label}")
        require(any(event.get("type") == "focus" and event.get("isTrusted") is True
                    and event.get("focused") is True for event in after), f"No trusted focus return: {label}")

    def plan_browser(self, value: dict[str, Any], summary: dict[str, Any]) -> None:
        require(value.get("transport") == "Actual local UI, email Auth, API, RLS and SQL; no successful plan API response is mocked.",
                "AG03 transport declaration changed or is missing")
        self.fault(value, "desktop", "local_source_select_revoked", {"preservedSavedPlan": True})
        self.fault(value, "desktop", "local_plan_select_revoked", {"emptyPlanNotFabricated": True})
        self.fault(value, "desktop", "lost_200_after_verified_sql_commit", {"exactReplay": True, "laterDeletionPreserved": True})
        adapter = self.read_json("native-tab-focus-adapter.json")
        preflight = self.read_json("focus-visibility-preflight.json")
        require(adapter.get("status") == "PASS" and adapter.get("sourceCommit") == self.candidate,
                "Native adapter lacks a PASS for this candidate")
        require(adapter.get("suite") == "native-tab-focus-adapter" and adapter.get("replacements") == 1
                and adapter.get("scope") == "disposable-runner-tools-only", "Native adapter scope/count is invalid")
        require(adapter.get("playwrightVersion") == "1.56.1" and adapter.get("playwrightCoreVersion") == "1.56.1",
                "Native adapter did not use pinned Playwright/core")
        for key in ("originalSha256", "modifiedSha256"):
            require(isinstance(adapter.get(key), str) and re.fullmatch(r"[0-9a-f]{64}", adapter[key]), f"Invalid adapter {key}")
        require(adapter["originalSha256"] != adapter["modifiedSha256"], "Native adapter has no recorded change")
        require(adapter.get("environmentFlag") == {"name": "DTC_NATIVE_TAB_FOCUS", "nativeValue": "yes", "defaultEnabled": True},
                "Native adapter is not explicitly scoped by its environment flag")
        require(value.get("nativeFocusAdapter") == adapter and preflight.get("nativeFocusAdapter") == adapter,
                "Application/preflight adapter manifests differ")
        require(preflight.get("status") == "PASS" and preflight.get("sourceCommit") == self.candidate
                and preflight.get("failure") is None, "Native preflight did not pass for this candidate")
        require(preflight.get("suite") == "native-focus-visibility-preflight"
                and preflight.get("environment") == "disposable-headed-chromium-loopback", "Wrong native preflight scope")
        for key in ("headless", "applicationStarted", "authenticationUsed", "databaseUsed", "applicationLabCreated"):
            require(preflight.get(key) is False, "Native preflight scope failed: " + key)
        require(preflight.get("pagesServed") == 2 and preflight.get("blockedRequests") == 0
                and preflight.get("javascriptErrors") == [], "Native preflight did not preserve its isolated two-page conditions")
        self.native_return(preflight.get("nativeTabReturn"), "preflight")
        returns = value.get("nativeTabReturns")
        require(isinstance(returns, list) and len(returns) == 1 and returns[0].get("phase") == "desktop",
                "Missing unique desktop application native return")
        self.native_return(returns[0], "AG03 application")
        summary.update({"nativePreflightAndApplicationReturnPassed": True, "nativeTabReturns": returns,
                        "nativeFocusAdapter": adapter, "versionsReportedByPreflight": {
                            key: preflight.get(key) for key in ("nodeVersion", "playwrightVersion", "chromiumVersion")}})

    def unit_summaries(self) -> dict[str, Any]:
        specs = {
            "a2-action-contract.json": ("a2-assistant-action-contract", {"actualContracts": True, "realDatabase": False, "modelCalls": 0, "externalNetworkCalls": 0}),
            "a2-action-api.json": ("a2-action-api", {"actualRoute": True, "actualHandlers": True, "actualContextHashing": True,
                "actualStorageReader": True, "actualSupabaseSelectBuilder": True, "sessionJourneyPortsAndStore": "synthetic", "externalNetworkCalls": 0, "liveSqlOrRls": False}),
            "a2-plan-contract.json": ("a2-reviewed-plan-contract", {"actualContracts": True, "actualCanonicalJourneyProjection": True,
                "pureHelpersOnly": True, "realDatabase": False, "remoteAuth": False, "modelCalls": 0, "externalNetworkCalls": 0, "productionRollout": False}),
            "a2-plan-api.json": ("a2-plan-api", {"actualHandlers": True, "actualContextHashing": True, "actualStorageReader": True,
                "actualSupabaseSelectBuilder": True, "sessionAndStore": "synthetic", "externalNetworkCalls": 0, "liveSqlOrRls": False}),
            "a2-assistant-route.json": ("a2-assistant-route", {"actualRoute": True, "sessionAndReadPorts": "synthetic",
                "providerTransport": "synthetic", "liveAuthOrRls": False, "liveModelQuality": False, "externalNetworkCalls": 0}),
            "a2-swarm-runtime.json": ("a2-swarm-runtime", {"actualCoordinator": True, "modelCompletionsAndHttp": "synthetic",
                "externalNetworkCalls": 0, "liveModelQuality": False, "productionRollout": False}),
            "a2-swarm-provider.json": ("a2-swarm-provider", {"actualProviderAdapter": True, "http": "synthetic",
                "externalNetworkCalls": 0, "liveModelQuality": False, "productionRollout": False}),
            "a2-swarm-canary.json": ("a2-swarm-canary", {"actualSelector": True, "actualEvidenceEvaluator": True,
                "actualCli": True, "liveTelemetryCertified": False, "liveProvenanceCertified": False, "productionRollout": False, "networkRequests": 0}),
        }
        summaries = {}
        for name, (suite, assertions) in specs.items():
            value = self.read_json(name)
            require(value.get("suite") == suite, "Wrong unit suite in " + name)
            results = value.get("results")
            require(isinstance(results, list) and results and all(isinstance(result, dict)
                    and result.get("status") == "passed" and isinstance(result.get("name"), str)
                    and not result.get("error") for result in results), "Failed or malformed unit result in " + name)
            names = [item["name"] for item in results]
            require(integer(value.get("cases"), 1) and integer(value.get("passed"), 1)
                    and value["cases"] == len(results) and value["passed"] == len(results),
                    "Unit counts differ from actual result list in " + name)
            require(all(value.get(key) == expected for key, expected in assertions.items()), "Unit evidence exceeds its actual/synthetic scope in " + name)
            sources = value.get("sourceHashes", [])
            require(isinstance(sources, list), "Invalid unit source hashes in " + name)
            verified = [self.source(item["path"], item["sha256"])[1] for item in sources]
            if "commit" not in value and "sourceCommit" not in value:
                self.missing_commit_fields.append(name)
            summaries[name] = {"suite": suite, "casesPassed": len(results), "distinctCaseNames": len(set(names)),
                               "repeatedCaseNames": {label: count for label, count in Counter(names).items() if count > 1},
                               "scopeChecks": assertions,
                               "verifiedSourceHashes": verified}
            for counter in ("syntheticDatabaseHttp", "syntheticProviderCalls", "syntheticCompletionCalls", "syntheticHttpCalls", "cliRuns"):
                if counter in value:
                    require(integer(value[counter]), "Invalid synthetic operation counter in " + name)
                    summaries[name][counter] = value[counter]
        action_names = {item["name"] for item in self.json_cache["a2-action-api.json"]["results"]}
        for method in ("GET", "POST"):
            require(f"Actual {method} route reads without initialization and denies missing canonical journey" in action_names,
                    f"Missing actual {method} read-only route regression")
        require(any(name.startswith("Readback rejects a timestamp changed below millisecond precision (2026-11-06T20:00:00.123457") for name in action_names),
                "Missing one-microsecond readback regression")
        require("Readback accepts the same precise instant with fraction length" in action_names
                and "Readback accepts the same precise instant with nonzero offset" in action_names,
                "Missing equivalent precise-instant regressions")
        return summaries

    def verify(self) -> dict[str, Any]:
        tree = self.initialize()
        producers = [self.source(path)[1] for path in PRODUCERS]
        unit = self.unit_summaries()
        ag03_scope, ag03_sources = self.scope("a2-plan", PLAN_SOURCES, PLAN_LIMITS)
        ag04_scope, ag04_sources = self.scope("a2-action", ACTION_SOURCES, ACTION_LIMITS)
        ag03_seed, ag04_seed = self.seed("a2-plan", 3, 2), self.seed("a2-action", 4, 3)
        ag03_sql = self.sql("a2-plan", 20, ag03_seed["migration"])
        ag04_sql = self.sql("a2-action", 16, ag04_seed["migration"])
        ag03_advisors, ag04_advisors = self.advisors("a2-plan"), self.advisors("a2-action")
        ag03_browser, ag03_browser_summary = self.browser("a2-plan", ag03_scope, PLAN_STEPS, PLAN_VISUALS)
        self.plan_browser(ag03_browser, ag03_browser_summary)
        ag04_browser, ag04_browser_summary = self.browser("a2-action", ag04_scope, ACTION_STEPS, ACTION_VISUALS)
        self.action_browser(ag04_browser, ag04_scope, ag04_browser_summary)
        return {
            "candidateTree": tree,
            "candidateAttribution": {
                "exactEmbeddedCommitAnchors": ["a2-plan-scope.json", "a2-plan-browser-results.json", "a2-action-scope.json",
                    "a2-action-browser-results.json", "native-tab-focus-adapter.json", "focus-visibility-preflight.json"],
                "filesWithoutEmbeddedCommit": sorted(set(self.missing_commit_fields)),
                "unembeddedCommitMeaning": "Seed/SQL/advisors and unit summaries have no commit field. Their attribution depends on belonging to this same externally verified CI artifact; producer and reported source hashes are checked against the candidate and local checkout.",
                "artifactZipDigestVerifiedHere": False, "githubRunMetadataVerifiedHere": False,
            },
            "AG04": {"candidate": self.candidate, "scope": ag04_scope["environment"],
                     "sourceCount": len(ag04_sources), "verifiedCopiedSources": ag04_sources,
                     "seed": ag04_seed, "sql": ag04_sql, "advisors": ag04_advisors,
                     "browser": ag04_browser_summary, "declaredScope": {
                         key: ag04_scope[key] for key in ("genuine", "fixtures", "substitutions", "notVerified", "privacy")}},
            "AG03Reexecution": {"candidate": self.candidate, "scope": ag03_scope["environment"],
                     "sourceCount": len(ag03_sources), "verifiedCopiedSources": ag03_sources,
                     "seed": ag03_seed, "sql": ag03_sql, "advisors": ag03_advisors,
                     "browser": ag03_browser_summary, "declaredScope": {
                         key: ag03_scope[key] for key in ("genuine", "fixtures", "substitutions", "notVerified", "privacy")},
                     "historyPolicy": "Separate AG03 execution for this candidate. This verifier neither changes nor reattributes the historical 14-source AG03 evidence."},
            "unitSummaries": unit, "verifiedProducerSources": producers,
            "limitations": [
                "This program verifies the supplied records, source attribution and file integrity; it does not independently rerun PostgreSQL, RLS or browser assertions.",
                "The caller must separately verify run/candidate identity, final CI conclusion, archive metadata and ZIP digest.",
                "AG04 proposal generation is synthetic; action Auth/API/RLS/PostgreSQL behavior is covered by the recorded real laboratory assertions.",
                "Canonical invariance and cleanup are passing assertions in the SQL/browser records; full raw database snapshots are not exported.",
                "Source context is dated; no global transaction across legacy/context writers is certified.",
                "No live AI quality/cost/latency, canary activation, remote deployment, physical mobile/Safari, human visual acceptance or manual UAT execution is certified.",
            ],
        }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("directory", type=Path, help="Extracted CI artifact directory; summary is written here")
    parser.add_argument("candidate", help="Exact full candidate commit SHA")
    parser.add_argument("--repo", type=Path, default=Path.cwd(), help="Repository root (default: current directory)")
    args = parser.parse_args()
    verifier = Verifier(args.directory, args.candidate, args.repo)
    summary: dict[str, Any] = {
        "version": "dtc-ag04-ci-artifact-verification.v1", "candidate": args.candidate,
        "verifiedAt": datetime.now(timezone.utc).isoformat(), "status": "FAIL",
        "verifierSha256": digest(Path(__file__).read_bytes()),
    }
    try:
        summary.update(verifier.verify())
        summary["status"] = "PASS"
    except (VerificationError, OSError, subprocess.SubprocessError, KeyError, TypeError, ValueError) as error:
        summary["error"] = f"{type(error).__name__}: {error}"
    summary["inputEvidence"] = verifier.inputs
    output = verifier.directory / "verified-summary.json"
    if verifier.directory.is_dir():
        require(not output.is_symlink(), "Summary output must not be a symbolic link")
        output.write_text(json.dumps(summary, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    result: dict[str, Any] = {"status": summary["status"], "candidate": args.candidate,
                              "summary": str(output) if verifier.directory.is_dir() else None}
    if summary["status"] == "PASS":
        result.update({"AG04": {"sources": summary["AG04"]["sourceCount"],
                                 "sqlCases": summary["AG04"]["sql"]["casesPassed"],
                                 "browserSteps": summary["AG04"]["browser"]["stepsPassed"]},
                       "AG03": {"sources": summary["AG03Reexecution"]["sourceCount"],
                                 "sqlCases": summary["AG03Reexecution"]["sql"]["casesPassed"],
                                 "browserSteps": summary["AG03Reexecution"]["browser"]["stepsPassed"]}})
    else:
        result["error"] = summary.get("error", "Verification did not finish")
    print(json.dumps(result, ensure_ascii=False))
    return 0 if summary["status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
