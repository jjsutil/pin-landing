#!/usr/bin/env bash
# bootflower check-gates — mechanical PR gate checks (rule 1 subset, rules 2, 7, 8;
# visual-evidence gate for UI-surface changes).
# Judgment lives in the skills; this script gives the invariants CI teeth.
#
# Tools are invoked ephemerally with versions PINNED here — never installed as
# permanent dev-dependencies (Part 0 of the bootflower spec).
set -uo pipefail

GITLEAKS_VERSION="8.24.3"
COMMITLINT_VERSION="19.8.1"

CACHE_DIR="${BOOTFLOWER_CACHE:-.bootflower-cache}"
CONVENTIONS=".claude/repo-conventions.md"
CONFIG_DOC="docs/CONFIG.md"
BASE_REF=""
FAILURES=0
WARNINGS=0

usage() {
  cat <<'EOF'
Usage: check-gates.sh [--base <ref>] [--help]

Runs the mechanical pre-PR gate checks on <base>..HEAD:
  0. manifest sanity        machine-read keys parse as clean paths     -> warning
  1. secret scan            gitleaks (pinned), new commits only        -> blocker
  2. tracked .env files     credentials committed to git               -> blocker
  3. conventional commits   commitlint (pinned) over new commits       -> blocker
  4. config sync            params in code/seed vs docs/CONFIG.md      -> blocker
     dead params            documented but never read                  -> warning
  5. paid SDK outside gw    direct paid-SDK usage off the gateway path -> blocker
  6. generated sections     BOARD.md header + README summary markers   -> blocker
  7. issue collisions       new I-xxx number already on base           -> blocker
  8. visual evidence        UI-surface diff ships a committed shot      -> blocker
                            (only if ui_surface_glob set in manifest)
  9. review notes           review markers added to production docs     -> blocker
 10. release tag            published VERSION has its v<VERSION> tag    -> blocker
                            (only if a VERSION file exists on the base)

Options:
  --base <ref>   Base ref to diff against (default: origin/main, main, or master)
  --help         Show this help and exit 0

Exit code: 0 = all blockers pass (warnings allowed), 1 = at least one blocker.
Manifest values read from .claude/repo-conventions.md: gateway_path, config_seed,
ui_surface_glob, ui_evidence_glob (config_module is checked for parse hygiene only).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) BASE_REF="$2"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown argument: $1"; usage; exit 2 ;;
  esac
done

fail() { echo "  BLOCKER: $*"; FAILURES=$((FAILURES + 1)); }
warn() { echo "  should:  $*"; WARNINGS=$((WARNINGS + 1)); }
info() { echo "  ok:      $*"; }

# Manifest lookup: lines like `gateway_path: src/lib/gateway` in repo-conventions.md
manifest_get() {
  [[ -f "$CONVENTIONS" ]] || return 1
  grep -m1 -E "^\s*[-*]?\s*\`?$1\`?\s*:" "$CONVENTIONS" 2>/dev/null \
    | sed -E "s/^[^:]*:\s*//; s/\`//g; s/\s+$//" || return 1
}

resolve_base() {
  if [[ -n "$BASE_REF" ]]; then echo "$BASE_REF"; return; fi
  for ref in origin/main origin/master main master; do
    if git rev-parse --verify -q "$ref" >/dev/null; then echo "$ref"; return; fi
  done
  echo ""
}

BASE="$(resolve_base)"
if [[ -z "$BASE" ]]; then
  echo "check-gates: cannot resolve a base ref (use --base)"; exit 2
fi
MERGE_BASE="$(git merge-base "$BASE" HEAD 2>/dev/null || echo "$BASE")"
DIFF_ADDED="$(git diff "$MERGE_BASE"...HEAD --unified=0 2>/dev/null | grep -E '^\+[^+]' || true)"

echo "check-gates: diffing against $BASE (merge-base $MERGE_BASE)"

# --- 0. Manifest sanity (machine-read keys) ------------------------------------
# I-001: manifest_get takes everything after the first colon on the key's line.
# Spaces or parentheses in a parsed value almost always mean inline prose leaked
# into the `key: value` line — §4/§5 would then compare against a corrupt path
# (fails closed, but the documented mechanism silently stops working).
echo "[0/10] manifest sanity (machine-read keys parse as clean paths)"
if [[ -f "$CONVENTIONS" ]]; then
  MANIFEST_DIRTY=0
  for key in config_seed config_module gateway_path; do
    v="$(manifest_get "$key" || true)"
    [[ -z "$v" || "$v" == "none" ]] && continue
    if [[ "${v,,}" == "none" || "${v,,}" == "none."* ]]; then
      warn "manifest \`$key\` parsed as \"$v\" — the no-value sentinel is lowercase \`none\`"
      MANIFEST_DIRTY=1
    elif [[ "$v" == *[[:space:]]* || "$v" == *['(){}|']* ]]; then
      warn "manifest \`$key\` parsed as \"$v\" — prose or unfilled-placeholder residue; keep it a bare \`key: value\` line (value = path or \`none\`, prose on follow-on lines)"
      MANIFEST_DIRTY=1
    fi
  done
  [[ $MANIFEST_DIRTY -eq 0 ]] && info "manifest keys parse clean"
else
  info "no manifest found — sanity check skipped"
fi

# --- 1. Secret scan (gitleaks, pinned) ---------------------------------------
echo "[1/10] secret scan (gitleaks $GITLEAKS_VERSION)"
GITLEAKS_BIN="$CACHE_DIR/gitleaks-$GITLEAKS_VERSION"
if [[ ! -x "$GITLEAKS_BIN" ]]; then
  mkdir -p "$CACHE_DIR"
  ARCH="$(uname -m)"; [[ "$ARCH" == "x86_64" ]] && ARCH="x64"; [[ "$ARCH" == "aarch64" ]] && ARCH="arm64"
  OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
  URL="https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_${OS}_${ARCH}.tar.gz"
  if curl -fsSL "$URL" -o "$CACHE_DIR/gitleaks.tgz" 2>/dev/null; then
    tar -xzf "$CACHE_DIR/gitleaks.tgz" -C "$CACHE_DIR" gitleaks && mv "$CACHE_DIR/gitleaks" "$GITLEAKS_BIN" && rm -f "$CACHE_DIR/gitleaks.tgz"
  fi
fi
if [[ -x "$GITLEAKS_BIN" ]]; then
  if "$GITLEAKS_BIN" detect --source . --log-opts="$MERGE_BASE..HEAD" --no-banner --redact --exit-code 1 >/dev/null 2>&1; then
    info "no secrets in new commits"
  else
    "$GITLEAKS_BIN" detect --source . --log-opts="$MERGE_BASE..HEAD" --no-banner --redact --exit-code 1 2>&1 | tail -20
    fail "gitleaks found secrets in $MERGE_BASE..HEAD"
  fi
else
  if [[ "${CI:-}" == "true" ]]; then fail "gitleaks $GITLEAKS_VERSION unavailable in CI"; else warn "gitleaks unavailable (offline?) — secret scan skipped"; fi
fi

# --- 2. Tracked .env files ----------------------------------------------------
echo "[2/10] tracked credential files"
TRACKED_ENV="$(git ls-files | grep -E '(^|/)\.env(\.[A-Za-z0-9]+)?$' | grep -vE '\.(example|template|sample)$' || true)"
if [[ -n "$TRACKED_ENV" ]]; then fail ".env file(s) tracked in git: $TRACKED_ENV"; else info "no tracked .env files"; fi

# --- 3. Conventional commits (commitlint, pinned) ------------------------------
echo "[3/10] conventional commits (commitlint $COMMITLINT_VERSION)"
COMMITS="$(git log --format=%s "$MERGE_BASE..HEAD" --no-merges)"
# dependency-free fallback: regex subset of the spec ($1 = why the fallback ran)
CONVENTIONAL_RE='^(feat|fix|chore|docs|refactor|test|ci|build|perf|style|revert)(\([a-zA-Z0-9._-]+\))?!?: .+'
lint_commits_regex() {
  BAD="$(echo "$COMMITS" | grep -vE "$CONVENTIONAL_RE" || true)"
  if [[ -n "$BAD" ]]; then fail "non-conventional commit subjects:"$'\n'"$BAD"; else info "all commit messages conform (regex fallback — $1)"; fi
}
if [[ -z "$COMMITS" ]]; then
  info "no new commits"
elif command -v npm >/dev/null 2>&1; then
  # Ephemeral prefix install (not `npx -p`): commitlint resolves `extends` relative
  # to the config file's directory, so config-conventional must sit in a node_modules
  # right next to the config — npx's cache is invisible from there. The .install-ok
  # stamp is written only after a verified install, so an interrupted/partial install
  # is wiped and retried instead of poisoning every later run with a false verdict.
  CL_DIR="$CACHE_DIR/commitlint-$COMMITLINT_VERSION"
  CL_BIN="$CL_DIR/node_modules/.bin/commitlint"
  CL_OK="$CL_DIR/.install-ok"
  if [[ ! -f "$CL_OK" || ! -x "$CL_BIN" ]]; then
    rm -rf "$CL_DIR"
    mkdir -p "$CL_DIR"
    if npm install --prefix "$CL_DIR" --no-save --no-audit --no-fund --ignore-scripts --loglevel=error \
        "@commitlint/cli@$COMMITLINT_VERSION" "@commitlint/config-conventional@$COMMITLINT_VERSION" \
        >"$CACHE_DIR/commitlint-install.out" 2>&1 && [[ -x "$CL_BIN" ]]; then
      touch "$CL_OK"
    fi
  fi
  if [[ -f "$CL_OK" ]]; then
    CL_CONF="$CL_DIR/commitlint.config.mjs"
    echo "export default { extends: ['@commitlint/config-conventional'] };" > "$CL_CONF"
    if "$CL_BIN" --config "$CL_CONF" --from "$MERGE_BASE" --to HEAD >"$CACHE_DIR/commitlint.out" 2>&1; then
      info "all commit messages conform"
    else
      cat "$CACHE_DIR/commitlint.out" | tail -20
      fail "commit messages violate Conventional Commits"
    fi
  elif [[ "${CI:-}" == "true" ]]; then
    tail -5 "$CACHE_DIR/commitlint-install.out" 2>/dev/null
    fail "commitlint $COMMITLINT_VERSION could not be installed ephemerally"
  else
    # mirror §1's local degrade: offline machines get the regex check, CI stays loud
    warn "commitlint install failed (offline?) — degraded to regex check"
    lint_commits_regex "install failed"
  fi
else
  lint_commits_regex "npm unavailable"
fi

# --- 4. Config sync + dead params ----------------------------------------------
echo "[4/10] config registry sync (heuristic: backticked params in $CONFIG_DOC vs seed/code)"
CONFIG_SEED="$(manifest_get config_seed || true)"
if [[ -f "$CONFIG_DOC" ]]; then
  DOCED="$(grep -oE '^(###|\|)[^|]*`[a-zA-Z0-9_.]+`' "$CONFIG_DOC" | grep -oE '`[a-zA-Z0-9_.]+`' | tr -d '`' | sort -u || true)"
  SEEDED=""
  if [[ -n "$CONFIG_SEED" && -f "$CONFIG_SEED" ]]; then
    SEEDED="$(grep -oE '^\s*"?[a-zA-Z0-9_.]+"?\s*[:=]' "$CONFIG_SEED" | grep -oE '[a-zA-Z0-9_.]+' | sort -u || true)"
  fi
  # seeded params missing from CONFIG.md -> blocker
  for p in $SEEDED; do
    if ! echo "$DOCED" | grep -qx "$p"; then fail "param \`$p\` in seed ($CONFIG_SEED) but not documented in $CONFIG_DOC"; fi
  done
  # documented params never read in code -> dead param (should)
  for p in $DOCED; do
    if ! git grep -qF "$p" -- ':!docs/' ":!$CONVENTIONS" ':!planning/' ':!*.md' 2>/dev/null; then
      warn "dead param \`$p\`: documented in $CONFIG_DOC but never read in code"
    fi
  done
  [[ $FAILURES -eq 0 ]] && info "config docs and seed in sync (docs: $(echo "$DOCED" | grep -c . || true) params)"
else
  warn "$CONFIG_DOC not found — config-registry first run pending"
fi

# --- 5. Paid SDK usage outside the gateway --------------------------------------
echo "[5/10] paid SDKs outside the gateway (added lines only)"
GATEWAY_PATH="$(manifest_get gateway_path || true)"
PAID_RE='(from|require|import)[^"'"'"']*["'"'"'](openai|@anthropic-ai/|anthropic|stripe|twilio|@sendgrid/|sendgrid|replicate|cohere|@mistralai/|mistralai|elevenlabs|@google-cloud/aiplatform)'
HITS="$(git diff "$MERGE_BASE"...HEAD --unified=0 -- . ':!*.md' ':!.claude' ':!*test*' ':!*spec*' ':!*mock*' 2>/dev/null \
  | grep -E '^\+[^+]' | grep -iE "$PAID_RE" || true)"
if [[ -n "$HITS" ]]; then
  # exempt hunks inside the gateway path (attribute via full diff per-file)
  OFFENDING=""
  while IFS= read -r f; do
    [[ -n "$GATEWAY_PATH" && "$f" == "$GATEWAY_PATH"* ]] && continue
    ADDED="$(git diff "$MERGE_BASE"...HEAD --unified=0 -- "$f" | grep -E '^\+[^+]' | grep -icE "$PAID_RE" || true)"
    [[ "${ADDED:-0}" -gt 0 ]] && OFFENDING+="$f "
  done < <(git diff "$MERGE_BASE"...HEAD --name-only -- . ':!*.md' ':!.claude' 2>/dev/null)
  if [[ -n "$OFFENDING" ]]; then
    fail "paid-SDK import added outside gateway (${GATEWAY_PATH:-<gateway_path unset>}): $OFFENDING"
  else
    info "paid-SDK imports confined to the gateway"
  fi
else
  info "no new paid-SDK imports"
fi

# --- 6. Generated sections intact ------------------------------------------------
echo "[6/10] generated sections (BOARD.md, README summary markers)"
if [[ -f planning/BOARD.md ]] && ! grep -q 'GENERATED by roadmap-board' planning/BOARD.md; then
  fail "planning/BOARD.md is missing its generated header — hand-edited? (rule 7)"
fi
if [[ -f README.md ]]; then
  S=$(grep -c 'BOARD-SUMMARY:START' README.md || true); E=$(grep -c 'BOARD-SUMMARY:END' README.md || true)
  if [[ "$S" != "$E" ]]; then fail "README BOARD-SUMMARY markers unbalanced (start=$S end=$E)"; fi
fi
[[ $FAILURES -eq 0 ]] && info "generated sections intact"

# --- 7. Issue-number collisions ----------------------------------------------------
echo "[7/10] issue-number collisions (rule 8)"
NEW_ISSUES="$(git diff "$MERGE_BASE"...HEAD --name-only --diff-filter=A -- 'planning/issues/I-*.md' 2>/dev/null || true)"
for f in $NEW_ISSUES; do
  NUM="$(basename "$f" | grep -oE '^I-[0-9]+' || true)"
  [[ -z "$NUM" ]] && continue
  CLASH="$(git ls-tree -r --name-only "$BASE" -- planning/issues/ 2>/dev/null | grep -E "/${NUM}-" | grep -v "^$f$" || true)"
  [[ -n "$CLASH" ]] && fail "issue number $NUM in $f already exists on $BASE: $CLASH — renumber before merge"
done
info "issue numbering checked"

# --- 8. Visual evidence for UI-surface changes ---------------------------------
# The visual-evidence rule (repo CONTRIBUTING) had no mechanical teeth: it relied
# solely on the reviewer verifying it, and in autonomous mode author == reviewer,
# so four UI PRs merged with zero screenshots (foja postmortem 2026-07-23). This
# gate is the lock the author can't pick: a diff that touches the UI surface must
# ship a committed screenshot under the evidence glob, OR a commit must declare
# there is no visible surface. Opt-in per repo via `ui_surface_glob` in the
# manifest (repos with no tracked UI skip cleanly). It proves evidence EXISTS and
# is committed (the embed URL in the PR body points at exactly that committed
# file); whether the shot actually matches the artifact is verified in review.
echo "[8/10] visual evidence (UI-surface diff ships a committed screenshot)"
UI_SURFACE="$(manifest_get ui_surface_glob || true)"
if [[ -z "$UI_SURFACE" || "${UI_SURFACE,,}" == "none" ]]; then
  info "no ui_surface_glob in manifest — repo has no tracked UI surface, check skipped"
else
  UI_EVIDENCE="$(manifest_get ui_evidence_glob || true)"
  [[ -z "$UI_EVIDENCE" || "${UI_EVIDENCE,,}" == "none" ]] && UI_EVIDENCE="web/e2e/screenshots"
  # UI-surface files in the diff, minus tests/specs/stories and type declarations
  # (those carry no pixels).
  UI_CHANGED="$(git diff "$MERGE_BASE"...HEAD --name-only -- "$UI_SURFACE" 2>/dev/null \
    | grep -vE '\.(test|spec|stories)\.[jt]sx?$' | grep -vE '\.d\.ts$' || true)"
  if [[ -z "$UI_CHANGED" ]]; then
    info "no UI-surface files changed under $UI_SURFACE"
  else
    # Evidence = an added/modified image committed under the evidence glob.
    EVIDENCE="$(git diff "$MERGE_BASE"...HEAD --name-only --diff-filter=AM -- "$UI_EVIDENCE" 2>/dev/null \
      | grep -iE '\.(png|jpe?g|webp|gif)$' || true)"
    # Escape hatch for genuinely pixel-less UI-surface edits (refactor, a11y attr,
    # comment): a commit in the range declares it, greppable and visible in review.
    OVERRIDE="$(git log --format='%B' "$MERGE_BASE..HEAD" 2>/dev/null \
      | grep -iE 'no-visible-surface|sin superficie visible' || true)"
    if [[ -n "$EVIDENCE" ]]; then
      info "UI-surface change ships $(echo "$EVIDENCE" | grep -c .) committed screenshot(s) under $UI_EVIDENCE"
    elif [[ -n "$OVERRIDE" ]]; then
      info "UI-surface change declares no visible surface (commit trailer) — evidence waived"
    else
      fail "UI-surface change under $UI_SURFACE ships no committed screenshot under $UI_EVIDENCE, and no commit declares 'no-visible-surface'. Attach visual evidence (see CONTRIBUTING) or add the declaration."
    fi

    # --- 8b. SHA-pinned embed of each committed screenshot in the PR body ------
    # Presence of a committed shot is not enough: the PR body must EMBED each one
    # with the CONTRIBUTING format, anchored to a 40-hex COMMIT SHA — not the
    # branch (branch `blob/<branch>/…` links die on merge `--delete-branch`; they
    # had to be re-anchored by hand on foja #437), and not `raw.githubusercontent.com`
    # or an `<img src>` tag (both 404 on a private repo).
    #
    # Reading the PR body needs `gh`, so this fires wherever `gh` can resolve the
    # PR. In THIS fleet Actions is billing-blocked, so the LOCAL pre-merge run of
    # this script IS the enforcement point (the same place every other gate here
    # bites). In CI it fires only once the workflow grants `pull-requests: read`,
    # exports a token, and passes CHECK_GATES_PR — wiring left to the repo (not done
    # by default; see the release notes). Before a PR exists there is nothing to
    # verify and the check defers — but a PR ref given explicitly yet unreadable is a
    # broken setup, not "no PR", and fails rather than passing blind.
    if [[ -n "$EVIDENCE" ]] && command -v gh >/dev/null 2>&1; then
      PR_NUM="$(gh pr view ${CHECK_GATES_PR:-} --json number -q .number 2>/dev/null || true)"
      if [[ -z "$PR_NUM" ]]; then
        if [[ -n "${CHECK_GATES_PR:-}" ]]; then
          fail "CHECK_GATES_PR=$CHECK_GATES_PR was set but gh could not read that PR (unauthenticated, or the workflow lacks 'pull-requests: read'?). Cannot verify the SHA-pinned evidence embeds — fix the setup, or unset CHECK_GATES_PR to defer to the local merge gate."
        else
          info "no PR open for this branch yet (or gh unavailable) — SHA-pinned embed check deferred to PR/merge time"
        fi
      else
        PR_BODY="$(gh pr view ${CHECK_GATES_PR:-} --json body -q .body 2>/dev/null || true)"
        SLUG="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
        if [[ -z "$SLUG" ]]; then
          warn "could not resolve the repo slug via gh — SHA-pinned embed verification skipped"
        else
          # Escape EVERY regex-special char in the slug and each path — a legal
          # screenshot path can contain ( ) + spaces etc., and escaping only `.`
          # would turn those into an operator and false-reject a correct embed.
          SLUG_RE="$(printf '%s' "$SLUG" | sed 's/[^A-Za-z0-9]/\\&/g')"
          EMBED_FAIL=0
          while IFS= read -r shot; do
            [[ -z "$shot" ]] && continue
            P_RE="$(printf '%s' "$shot" | sed 's/[^A-Za-z0-9]/\\&/g')"
            # Valid: a blob embed for this shot pinned to a 40-hex commit SHA.
            GOOD="$(printf '%s\n' "$PR_BODY" \
              | grep -oiE "https://github\.com/${SLUG_RE}/blob/[0-9a-f]{40}/${P_RE}\?raw=true" || true)"
            # Broken anchor 1: a github blob link to this shot whose ref is NOT 40-hex
            # (a branch, tag or short sha).
            BRANCHED="$(printf '%s\n' "$PR_BODY" \
              | grep -oiE "https://github\.com/${SLUG_RE}/blob/[^)\"' ]*${P_RE}" \
              | grep -viE "/blob/[0-9a-f]{40}/${P_RE}" || true)"
            # Broken anchor 2/3: raw.githubusercontent.com host, or an <img> tag.
            RAWHOST="$(printf '%s\n' "$PR_BODY" | grep -oiE "raw\.githubusercontent\.com/[^)\"' ]*${P_RE}" || true)"
            IMGTAG="$(printf '%s\n' "$PR_BODY" | grep -oiE "<img[^>]*${P_RE}[^>]*>" || true)"
            if [[ -n "$BRANCHED$RAWHOST$IMGTAG" ]]; then
              fail "PR #$PR_NUM body embeds $shot with a broken anchor (branch link, raw.githubusercontent.com, or <img>): $(printf '%s' "$BRANCHED$RAWHOST$IMGTAG" | head -1). Pin it to a 40-hex commit SHA — ![alt](https://github.com/${SLUG}/blob/<sha40>/${shot}?raw=true); run scripts/ui-evidence-embed.sh to generate it."
              EMBED_FAIL=1
            elif [[ -z "$GOOD" ]]; then
              fail "PR #$PR_NUM body has no SHA-pinned embed for committed screenshot $shot. Add ![alt](https://github.com/${SLUG}/blob/<sha40>/${shot}?raw=true) — run scripts/ui-evidence-embed.sh to generate it."
              EMBED_FAIL=1
            fi
          done <<< "$EVIDENCE"
          [[ $EMBED_FAIL -eq 0 ]] && info "PR #$PR_NUM: each committed screenshot is SHA-pinned in the body"
        fi
      fi
    fi
  fi
fi

# --- 9. Review notes in production docs (added lines only) ----------------------
# The owner writes review notes INSIDE documentation files, meaning "an agent must
# resolve this and then delete it". Nothing stopped them from being merged: foja's
# README shipped 24 of them to `main`, visible in production. This gate makes the
# marker a blocker at the moment it is ADDED.
#
# Scope = documentation that reaches a reader: `*.md` at the repo root and anything
# under `docs/`, plus AGENTS.md / CLAUDE.md / README.md / CONTRIBUTING.md wherever
# they live. Deliberately OUT of scope, because a pending note there is legitimate
# working material, not a leak: `planning/` (plans, issues, specs),
# `docs/superpowers/` (work evidence), `HANDOFF.md` (session working state),
# CHANGELOG.md and `docs/releases/` + BOOTFLOWER.md (release history and the
# workflow catalog, which must be able to quote the markers verbatim).
#
# Only ADDED lines count (like §5). Pre-existing notes in a file this branch merely
# touches do not block — otherwise adopting this gate would freeze every repo that
# already carries notes until a remediation session lands.
#
# Patterns (case-insensitive):
#   a) `CORR.:` / `CORR:` opening a line, allowing a blockquote (`>`), a list bullet
#      and/or bold/underline emphasis in front — covers `> **CORR.: ...`. Anchoring at
#      line start is what keeps prose that merely mentions the marker from tripping it.
#   b) `[comentario ... : ...` — a bracketed note starting with "comentario" that
#      contains a colon. Markdown links such as `[comentarios de review](url)` carry
#      no colon inside the brackets and do not match.
#   c) `[... por borrar ...` — any bracketed note containing "por borrar".
# Escape hatch: a line carrying the literal token `check-gates:allow-note` is skipped,
# for docs that must quote a marker on purpose.
echo "[9/10] review notes in production docs (added lines only)"
NOTE_ALLOW='check-gates:allow-note'
NOTE_RE=$'^[0-9]+\t[[:space:]]*(>[[:space:]]*)*([-*+][[:space:]]+)?(\\*\\*|__)?CORR\\.?:|\\[[[:space:]]*comentario[^]]*:|\\[[^]]*por borrar'
NOTE_PATHSPEC=(
  ':(glob)*.md'
  ':(glob)docs/**/*.md'
  ':(glob)**/AGENTS.md'
  ':(glob)**/CLAUDE.md'
  ':(glob)**/README.md'
  ':(glob)**/CONTRIBUTING.md'
  ':(exclude,glob)planning/**'
  ':(exclude,glob)docs/superpowers/**'
  ':(exclude,glob)docs/releases/**'
  ':(exclude)CHANGELOG.md'
  ':(exclude)HANDOFF.md'
  ':(exclude)BOOTFLOWER.md'
)
NOTE_FOUND=0
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  # added lines of this file, as `<new-file line number>\t<content>`
  HITS="$(git diff "$MERGE_BASE"...HEAD --unified=0 -- "$f" 2>/dev/null \
    | awk '/^@@/ { split($3, a, ","); ln = substr(a[1], 2) + 0; next }
           /^\+/ && !/^\+\+\+/ { print ln "\t" substr($0, 2); ln++ }' \
    | grep -vF "$NOTE_ALLOW" | grep -iE "$NOTE_RE" || true)"
  [[ -z "$HITS" ]] && continue
  NOTE_FOUND=1
  while IFS= read -r hit; do
    [[ -z "$hit" ]] && continue
    LN="${hit%%$'\t'*}"; TXT="${hit#*$'\t'}"
    fail "review note ADDED to production doc $f:$LN — \"${TXT:0:100}\". A review note must be ADDRESSED AND DELETED before publishing, never merged (foja shipped 24 of them to its README). Resolve the note and remove the line; if the work is not done yet, move it to planning/ or open an issue. If this line quotes a marker on purpose, append the token $NOTE_ALLOW to it."
  done <<< "$HITS"
done < <(git diff "$MERGE_BASE"...HEAD --name-only --diff-filter=AM -- "${NOTE_PATHSPEC[@]}" 2>/dev/null)
[[ $NOTE_FOUND -eq 0 ]] && info "no review-note markers added to production docs"

# --- 10. Release tag for the published VERSION ----------------------------------
# Releases of a versioned repo are tagged BY HAND after the merge, and for weeks
# nobody did it: bootflower reached NINE missing tags. The damage was not the
# absent tag — it was that `scripts/bootflower-sync.sh` resolves each vendored
# file's baseline as `git show v<stamped>:<path>`, so with no tag every file reads
# as diverged and the sync refuses to update. It warned and carried on, producing
# a report that looked like a divergence problem instead of a missing tag; foja and
# puki silently went without the release.
#
# This gate makes the debt unable to survive a single PR. It cannot verify the tag
# of the release IN FLIGHT (that tag is created after the merge), so it verifies
# the release ALREADY PUBLISHED: the VERSION as it stands on the base ref. That is
# deliberate — a branch that bumps VERSION must not fail on its own future tag, and
# checking the base means the very next PR after an untagged release turns red.
#
# Where the tags come from, in order: the remote (`git ls-remote --tags`, the only
# place that proves the tag is PUBLISHED — this fleet has already created release
# tags locally and forgotten to push them, see the puki row in BOOTFLOWER.md), then
# the local tag store as a fallback. The check NEVER passes because it could not
# look:
#   - remote reachable, tag absent there              -> blocker
#   - remote unreachable, tag absent locally too      -> blocker (debt is proven
#                                                       without needing the network)
#   - remote unreachable, tag present locally         -> in CI blocker; locally a
#                                                       `should` naming exactly what
#                                                       is unverified (publication),
#                                                       mirroring how §1/§3 degrade
#                                                       offline. It is never silent.
echo "[10/10] release tag for the published VERSION"
if ! git rev-parse -q --verify "$BASE^{commit}" >/dev/null 2>&1; then
  # An unresolvable base is a broken invocation, not "this repo has no VERSION".
  # Collapsing the two would let the step pass by failing to look — the one outcome
  # this whole check exists to forbid.
  fail "base ref $BASE does not resolve to a commit, so the published VERSION cannot be read. Fetch the base or pass a valid --base."
elif ! git cat-file -e "$BASE:VERSION" 2>/dev/null; then
  info "no VERSION file on $BASE — repo is not version-tagged, check skipped"
else
  PUBLISHED_VERSION="$(git show "$BASE:VERSION" 2>/dev/null | tr -d '[:space:]' || true)"
  REL_TAG="v$PUBLISHED_VERSION"
  # Commit to tag = the last commit that touched VERSION on the base (the release
  # commit that bumped it), so the suggested command lands on the right sha. Under a
  # merge-commit workflow history simplification resolves this to the feature commit
  # rather than the merge commit — still an ancestor of the base, so the tag is not
  # wrong, just one commit early; exact under squash-merge, which this fleet uses.
  REL_SHA="$(git rev-list -1 "$BASE" -- VERSION 2>/dev/null || true)"
  [[ -z "$REL_SHA" ]] && REL_SHA="$(git rev-parse "$BASE" 2>/dev/null || echo "<release-commit>")"
  REMOTE_NAME="$(git remote 2>/dev/null | grep -x origin || git remote 2>/dev/null | head -1 || true)"
  TAG_ON_REMOTE=""
  REMOTE_REACHED=0
  if [[ -n "$REMOTE_NAME" ]]; then
    # `timeout` is GNU coreutils and is absent on stock macOS: assuming it exists
    # turns "127: command not found" into a phantom "remote unreachable" on every
    # run. Probe for it, and bound ssh independently — GIT_TERMINAL_PROMPT only
    # silences git's own credential prompt, not ssh's host-key/passphrase prompt,
    # which would hang the gate on a TTY.
    TO=(); command -v timeout >/dev/null 2>&1 && TO=(timeout 20)
    LS_REMOTE="$(GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=10' \
      "${TO[@]}" git ls-remote --tags "$REMOTE_NAME" "refs/tags/$REL_TAG" 2>/dev/null)" && LS_RC=0 || LS_RC=$?
    if [[ "$LS_RC" -eq 0 ]]; then
      REMOTE_REACHED=1
      # Exact field match, never a regex: a version string may legally carry ERE
      # metacharacters (`1.0(rc1)`, `+build`) and splicing it into `grep -E` would
      # false-report a published tag as missing.
      TAG_ON_REMOTE="$(printf '%s\n' "$LS_REMOTE" | awk -v t="refs/tags/$REL_TAG" '$2==t || $2==(t "^{}")' || true)"
    fi
  fi
  TAG_LOCAL=""
  git rev-parse -q --verify "refs/tags/$REL_TAG" >/dev/null 2>&1 && TAG_LOCAL=1
  # The remedy differs by outcome: a tag that already exists locally only needs
  # pushing — telling the user to `git tag -a` it would just error "already exists".
  if [[ -n "$TAG_LOCAL" ]]; then
    FIX="The tag object already exists locally — it only needs publishing: git push ${REMOTE_NAME:-origin} $REL_TAG"
  else
    FIX="Create it on the release commit and publish it: git tag -a $REL_TAG $REL_SHA -m \"$REL_TAG\" && git push ${REMOTE_NAME:-origin} $REL_TAG"
  fi
  UNREACHED="${REMOTE_NAME:+$REMOTE_NAME could not be reached}"
  UNREACHED="${UNREACHED:-no remote is configured}"
  if [[ "$REMOTE_REACHED" -eq 1 ]]; then
    if [[ -n "$TAG_ON_REMOTE" ]]; then
      info "$REL_TAG (published VERSION $PUBLISHED_VERSION) is tagged on $REMOTE_NAME"
    else
      fail "the released VERSION $PUBLISHED_VERSION on $BASE has NO tag $REL_TAG on $REMOTE_NAME$([[ -n "$TAG_LOCAL" ]] && echo " (the tag exists locally but was never pushed)"). Untagged releases break bootflower-sync, which resolves every vendored file against \`git show $REL_TAG:<path>\` and reports false divergence instead. $FIX"
    fi
  elif [[ -z "$TAG_LOCAL" ]]; then
    fail "the released VERSION $PUBLISHED_VERSION on $BASE has NO tag $REL_TAG (no local tag, and $UNREACHED, so the published ones could not be checked). The tag is missing regardless of the network. $FIX"
  elif [[ "${CI:-}" == "true" ]]; then
    fail "$REL_TAG exists locally but $UNREACHED, so its publication cannot be verified — in CI that is a broken setup, not an offline machine. Restore access to the remote, or push the tag: git push ${REMOTE_NAME:-origin} $REL_TAG"
  else
    warn "$REL_TAG exists locally but $UNREACHED — cannot verify the tag was PUSHED (this is the only part left unverified). Confirm with: git push ${REMOTE_NAME:-origin} $REL_TAG"
  fi
fi

echo
echo "check-gates: $FAILURES blocker(s), $WARNINGS should-level warning(s)"
[[ $FAILURES -gt 0 ]] && exit 1
exit 0
