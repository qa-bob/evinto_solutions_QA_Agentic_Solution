# Skills

This file documents the Claude Code skills (slash commands) defined in `.claude/commands/`. Skills are reusable, invokable workflows that package a repeatable multi-step procedure into a single command.

---

## What is a skill?

A skill is a Markdown file in `.claude/commands/` (or `.claude/skills/<name>/SKILL.md`) that Claude loads on demand. Unlike `CLAUDE.md` rules — which load every session — skill content only enters the context window when you invoke the skill. This keeps long reference procedures from consuming context on every turn.

Invoke any skill by typing `/skill-name` in the Claude Code chat.

---

## Defined skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Crawls the live site defined in `site.config.json` and produces a fully-populated config with all discovered values, plus an issues checklist.

**Usage:**
```
/analyze-site
/analyze-site https://example.com
```

**What it outputs:**
- A complete `site.config.json` block ready to paste into the repo
- An issues checklist (missing meta description, no HTTPS, broken nav links, etc.)
- A confidence rating

**When to run:** After a site redesign, when onboarding the repo, or when nav items seem out of date.

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs `npm run test:smoke` and displays a formatted pass/fail table with suggested fixes for any failures.

**Usage:**
```
/run-smoke
```

**What it outputs:**
- A table of smoke test results with duration
- Failure details with root-cause suggestions
- Mirrors the underlying test exit code (0 = pass, 1 = fail)

**When to run:** Quick health check before starting a development session, or to verify the site is reachable.

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Runs `npm run baseline` to capture new visual regression screenshots, then lists all updated files and reminds you to review them before committing.

**Usage:**
```
/update-baseline
```

**What it outputs:**
- List of updated snapshot files in `__snapshots__/`
- Warning to review screenshots before `git add`
- Reports any errors during capture (site down, selector timeouts)

**When to run:** After an intentional visual change (redesign, copy update, layout change).

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses `test-results/results.json` and displays a structured summary table with per-suite pass/fail counts, failed test details, and next-step suggestions.

**Usage:**
```
/generate-report
```

**What it outputs:**
- Summary table: Total / Passed / Failed / Flaky by suite
- Overall pass rate percentage
- Failed test messages with suggestions
- Flaky test flagging for investigation

**When to run:** After any test run to get a human-readable summary.

---

### `/generate-full-suite`

Analyzes the live website and regenerates the complete POM structure and test files based on discovered pages and features.

**Usage:**
```
/generate-full-suite
```

**What it does:**
1. Crawls the live site via WebFetch
2. Identifies all pages, sections, forms, and interactive elements
3. Updates or creates page object classes in `src/pages/`
4. Generates or refreshes test files in `tests/`
5. Runs `npm run typecheck` to validate the output

**When to run:** When setting up a new site, or after a major site restructure.

---

## Adding a new skill

Create a file at `.claude/commands/<name>.md`:

```markdown
# /my-skill

One-line description of what this skill does.

## Usage

\`\`\`
/my-skill [optional-arg]
\`\`\`

## What this command does

1. Step one
2. Step two
3. Step three

## Output format

Description of what Claude will output.

## Notes

- Any edge cases or prerequisites
- What happens if something goes wrong
```

### Skill vs. CLAUDE.md rule — when to use which

| Use a skill when... | Use a CLAUDE.md rule when... |
|---------------------|------------------------------|
| It's a multi-step procedure | It's a standing rule that applies all the time |
| It should only load on demand | It's a fact Claude needs in every session |
| It has reference material or examples | It's short and concrete (under 3 lines) |
| It's invoked explicitly by name | It should be applied automatically |

### Skill vs. agent — when to use which

| Use a skill when... | Use an agent when... |
|---------------------|----------------------|
| The task is sequential steps Claude performs | The task involves heavy read/write in its own context |
| You want to invoke it explicitly | Claude should decide autonomously when to delegate |
| The procedure is short enough to inline | The context would flood the main conversation |

---

## Related resources

- [Claude Code skills docs](https://code.claude.com/docs/en/skills)
- Skill files: `.claude/commands/`
- Agent definitions: [AGENTS.md](./AGENTS.md)
- Project instructions: [CLAUDE.md](./CLAUDE.md)
