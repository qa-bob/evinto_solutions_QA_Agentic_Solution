# Agents

This file documents the Claude Code subagents defined in `.claude/agents/`. Subagents are specialized AI assistants with focused system prompts and scoped tool access. Claude Code automatically delegates to them when a task matches their description.

> **Claude Code note:** Claude Code reads `CLAUDE.md`, not `AGENTS.md`. This file is human documentation for contributors. The actual agent definitions live in `.claude/agents/*.md`.

---

## What is a subagent?

A subagent runs in its own context window with a dedicated system prompt and a specific set of allowed tools. When Claude Code encounters a task that matches an agent's description, it delegates to that subagent, which works independently and returns a summary. This keeps long exploratory work (crawling a site, generating many files) out of your main conversation context.

Each agent is defined by a Markdown file in `.claude/agents/` with YAML frontmatter.

---

## Defined agents

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`

**Description:** Crawls a live website and produces a fully-populated `site.config.json` ready to drop into this repo.

**When Claude invokes it:**
- When asked to inspect the live site structure
- When running `/analyze-site`
- When refreshing `site.config.json` after a site redesign

**What it does:**
1. Resolves the canonical URL (follows redirects)
2. Navigates to the page and dismisses cookie banners
3. Extracts nav link text and hrefs
4. Detects contact forms and their fields
5. Infers industry from heading and body copy
6. Assesses whether visual tests should be skipped (heavy animation / randomized content)
7. Detects auth-gated pages

**Output:** A complete `site.config.json` block + an issues checklist + a confidence rating (High / Medium / Low).

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`

**Description:** Reads a populated `site.config.json` and generates site-specific Playwright test files for unique functionality not covered by the shared suite.

**When Claude invokes it:**
- When asked to generate tests for a specific page or feature
- When running `/generate-full-suite`
- When `expectedNavItems` contains pages that lack dedicated test files

**What it does:**
1. Reads `site.config.json` to understand site structure
2. Identifies gaps in the shared test suites
3. Plans test scenarios before writing any code
4. Generates page object additions or new page objects in `src/pages/`
5. Writes spec files to `tests/custom/<scenario>.spec.ts`
6. Validates TypeScript types mentally before outputting

**Output rules:**
- Files at `tests/custom/<kebab-name>.spec.ts`
- Imports from `@fixtures/site.fixture`
- Tags: `@custom` plus any relevant standard tag
- No fixed timeouts > 500ms
- No form submissions

---

## Adding a new agent

Create a file at `.claude/agents/<name>.md` with this structure:

```markdown
---
name: my-agent
description: One sentence Claude uses to decide when to delegate. Be specific.
tools:
  - Read
  - Glob
  - Grep
  - WebFetch
model: claude-haiku-4-5-20251001   # Optional: use a faster/cheaper model
---

# Agent: my-agent

## Role
What this agent is for.

## When to invoke
Bullet list of triggers.

## Step-by-step instructions
1. First do this
2. Then do that

## Output format
What the caller should expect back.
```

### Guidelines for agent definitions

| Field | Guidance |
|-------|----------|
| `name` | Kebab-case, matches filename |
| `description` | Single sentence — this is what Claude reads when deciding to delegate |
| `tools` | Restrict to what the agent actually needs; fewer tools = safer and cheaper |
| `model` | Omit to inherit the session model; set to Haiku for cheap read-only tasks |
| Instructions | Write concrete steps, not vague guidance |
| Output | Describe the exact format so the caller can parse the result |

---

## Agent tool access

Agents can access all MCP tools available in the session via `ToolSearch`. Restrict tools in the frontmatter to limit scope and cost. Useful subsets:

| Task type | Suggested tools |
|-----------|-----------------|
| Read-only research | `Read`, `Glob`, `Grep`, `WebFetch` |
| File generation | `Read`, `Glob`, `Grep`, `Write`, `Edit` |
| Site crawling | `WebFetch`, `Bash` |
| Full access | Omit `tools` field (inherits all) |

---

## Related resources

- [Claude Code subagents docs](https://code.claude.com/docs/en/sub-agents)
- Agent definitions: `.claude/agents/`
- Skills/commands: [Skills.md](./Skills.md)
- Project instructions: [CLAUDE.md](./CLAUDE.md)
