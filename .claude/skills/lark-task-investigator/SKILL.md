---
name: lark-task-investigator
description: Investigates Lark project tasks by opening them in a browser, reading descriptions/comments, finding related tasks, and then analyzing the codebase to produce user stories, acceptance criteria, scope, and a todo list. Use this skill whenever the user shares a Lark task URL and wants to understand what needs to be done, or asks to investigate/analyze/break down a Lark task. Also trigger when the user pastes a larksuite.com or feishu.cn project link and asks about scope, requirements, or planning.
---

# Lark Task Investigator

Investigate a Lark project task end-to-end: read it from the browser, understand the context, explore the codebase, and produce a structured breakdown of what needs to be done.

## Prerequisites

This skill depends on the **playwright-cli** skill for browser automation. The user has a persisted Chrome profile with an active Lark session, so there's no need to log in.

## Workflow

### Phase 1: Open and read the Lark task

1. Open the task URL using playwright-cli with the persisted Chrome profile:

```bash
playwright-cli open <task-url> --browser=chrome --profile="D:/playwirght-cli/chrome-profile" --headed
```

2. Wait for the page to load, then take a snapshot to read the task content:

```bash
playwright-cli snapshot
```

3. Extract the following from the task page:
   - **Task title**
   - **Task description** — the full body text. Lark tasks often have rich text, images, and embedded links. Capture all text content. If the description is long or truncated, scroll down and take additional snapshots.
   - **Status, priority, assignee, due date** — any metadata visible on the task
   - **Comments** — scroll to the comments section and read all of them. Comments often contain important context, decisions, and clarifications that aren't in the description. If there are many comments, keep scrolling and snapshotting until you've captured them all.

4. **Find related tasks** — look for:
   - Links to other tasks within the description or comments
   - A "Related tasks" or "Sub-tasks" section in the Lark UI
   - Any task IDs or URLs mentioned in the text

   If you find related task links, open each one in a new tab and read their titles and descriptions too — they provide important context for understanding scope.

```bash
playwright-cli tab-new <related-task-url>
playwright-cli snapshot
```

5. When done reading, close the browser:

```bash
playwright-cli close
```

### Phase 2: Investigate the codebase

Now that you understand what the task is asking for, search the current project's codebase for relevant context:

- Use **Grep** and **Glob** to find files, functions, components, or modules related to the task
- Look at recent git history (`git log`) for related changes
- Read the relevant source files to understand the current implementation
- Identify what exists today vs. what needs to change

The goal is to bridge the gap between "what the task says" and "what the code looks like right now." This makes the output actionable instead of abstract.

### Phase 3: Synthesize the output

Combine everything you learned from Lark and the codebase into a structured report. Write it in the same language as the task content (usually Vietnamese).

Use this structure:

---

## [Task title]

**Source:** [link to the Lark task]
**Status:** [current status] | **Priority:** [priority] | **Assignee:** [assignee]

### Context
A brief summary of what this task is about, synthesized from the description, comments, and related tasks. Include any important decisions or clarifications from the comments.

### User Stories
- As a [role], I want [feature] so that [benefit]
- ...

Keep these grounded in what the task actually describes — don't invent user stories for things not mentioned.

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- ...

Derive these from the task description, comments, and your understanding of the codebase. Be specific — reference actual components, endpoints, or behaviors where possible.

### Scope

**In scope:**
- Item 1
- Item 2

**Out of scope:**
- Item 1 (reason)

If the task or comments mention what's explicitly out of scope, include it. Otherwise, note boundaries based on your codebase analysis.

### Technical Analysis
What you found in the codebase — relevant files, current implementation, dependencies, and potential impact areas. This helps the developer know where to start.

### Todo List
A concrete, ordered list of implementation steps:
1. Step 1 — what to do and where
2. Step 2
3. ...

Each step should be small enough to be a single unit of work. Reference specific files or modules when possible.

---

## Tips

- Lark pages can be slow to load. After `goto`, take a snapshot and check if the content is actually there. If the page shows a loading state, wait a moment and snapshot again.
- Comments are often the most valuable part — stakeholders discuss edge cases, change requirements, and add context there. Read them carefully.
- If the task references designs (Figma links, screenshots), note them in the output even though you can't open them — the developer will need to check them.
- When investigating the codebase, focus on understanding the current state rather than trying to implement anything. The output should help the developer plan their work, not do it for them.
