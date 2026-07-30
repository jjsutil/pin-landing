# Rule 13 — Skill admission & retirement

Owner decision, 2026-07-28. Every skill's `description` is loaded into context on
every session — a skill in the set is never free.

1. **Admission.** A new skill enters the set only with a clear trigger in its
   `description` (when it fires, in the user's words), and only if it does not
   overlap an already-installed global plugin (superpowers, document-skills),
   another skill in the set, **or any skill installed at user scope
   (`~/.claude/skills/`) whose origin is not this repo**. Overlap means the
   capability already exists: extend the existing one instead.
   **The user-scope half is not optional and not theoretical.** Those skills load
   their description in every session and compete for the same triggers, while
   bootflower has no write path to them — so an overlap discovered after the fact
   cannot be fixed by editing the new skill alone. #31 is that failure: `direccion`
   and `ceo-zoomout` claimed the same phrases, and only one of the two was
   reachable. Check `ls ~/.claude/skills/` as part of admission, and record which
   of them the new skill borders (see I-010).
   **Admission also states the scope.** Default is repo scope: the skill is vendored
   into every adopted repo. A skill whose subject is the portfolio rather than one
   repo declares `scope: portfolio` under `metadata:` in its frontmatter and installs
   once at `~/.claude/skills/` (user scope — `~/Projects/.claude/` is NOT discovered from inside a repo, I-008), never as a copy in ten repos. Choosing repo
   scope for a portfolio subject is the overlap trap in disguise: it puts a
   fleet-level skill next to the repo-level piece that already owns that ground.
2. **No local edits.** Vendored copies are never modified in adopted repos — every
   improvement lands in the meta-repo and reaches repos via `workflow-sync`
   (Rule 9 restated as lifecycle: upstream is the only write path).
3. **Retirement.** A skill with no recorded invocations over a prolonged period is
   a retirement candidate at the next release. Its description loads context in
   every session; without use, that is pure cost.
