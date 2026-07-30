#!/usr/bin/env bash
# bootflower branch-janitor — report (and optionally clean) branch hygiene.
# Deletion happens only with an explicit flag; zombies are NEVER auto-deleted.
set -uo pipefail

NAMING_RE='^(main|master|HEAD|feat|fix|chore|docs|refactor|test|spike|release|archive|dependabot)(/.*)?$'
ZOMBIE_DAYS=90
MODE="report"

usage() {
  cat <<'EOF'
Usage: branch-janitor.sh [--report] [--delete-merged] [--zombie-days N] [--help]

Checks local and remote branches for:
  - naming violations (pattern configurable via NAMING_RE / manifest)
  - merged-but-undeleted branches (fully merged into the default branch)
  - zombie branches (unmerged, no commits in N days; default 90)

Options:
  --report          Print the report (default)
  --delete-merged   Delete local branches fully merged into the default branch
                    (asks for confirmation; never touches zombies or remotes)
  --zombie-days N   Zombie threshold in days (default 90)
  --help            Show this help and exit 0
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --report) MODE="report"; shift ;;
    --delete-merged) MODE="delete-merged"; shift ;;
    --zombie-days) ZOMBIE_DAYS="$2"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown argument: $1"; usage; exit 2 ;;
  esac
done

DEFAULT="$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')"
[[ -z "$DEFAULT" ]] && DEFAULT="$(git rev-parse --verify -q main >/dev/null && echo main || echo master)"
NOW="$(date +%s)"
CUTOFF=$((NOW - ZOMBIE_DAYS * 86400))

echo "branch-janitor: default branch = $DEFAULT, zombie threshold = ${ZOMBIE_DAYS}d"
echo

echo "== Naming violations =="
git for-each-ref --format='%(refname:short)' refs/heads refs/remotes/origin \
  | sed 's@^origin/@@' | sort -u \
  | grep -vE "$NAMING_RE" | sed 's/^/  /' || echo "  none"
echo

echo "== Merged but undeleted (into $DEFAULT) =="
MERGED="$(git branch --merged "$DEFAULT" --format='%(refname:short)' | grep -vE "^($DEFAULT|master|main)$" || true)"
if [[ -n "$MERGED" ]]; then echo "$MERGED" | sed 's/^/  local:  /'; else echo "  none (local)"; fi
git branch -r --merged "$DEFAULT" --format='%(refname:short)' 2>/dev/null \
  | grep -vE "origin/(HEAD|$DEFAULT|main|master)$" | sed 's/^/  remote: /' || true
echo

echo "== Zombies (unmerged, idle > ${ZOMBIE_DAYS}d) =="
FOUND=0
while IFS='|' read -r ref ts; do
  [[ -z "$ref" ]] && continue
  short="${ref#origin/}"
  [[ "$short" =~ ^(main|master|HEAD)$ ]] && continue
  if [[ "$ts" -lt "$CUTOFF" ]] && ! git merge-base --is-ancestor "$ref" "$DEFAULT" 2>/dev/null; then
    days=$(( (NOW - ts) / 86400 ))
    echo "  $ref (idle ${days}d)"; FOUND=1
  fi
done < <(git for-each-ref --format='%(refname:short)|%(committerdate:unix)' refs/heads refs/remotes/origin)
[[ "$FOUND" -eq 0 ]] && echo "  none"
echo

if [[ "$MODE" == "delete-merged" ]]; then
  if [[ -z "$MERGED" ]]; then echo "Nothing to delete."; exit 0; fi
  echo "Will delete these LOCAL merged branches:"; echo "$MERGED" | sed 's/^/  /'
  read -r -p "Proceed? [y/N] " ANSWER
  if [[ "$ANSWER" =~ ^[Yy]$ ]]; then
    echo "$MERGED" | xargs -r -n1 git branch -d
    echo "Done. Remote deletion is manual: git push origin --delete <branch>"
  else
    echo "Aborted."
  fi
fi
