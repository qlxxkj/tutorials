# Lesson 12: Writing Better Prompts

> 📌 **Learning Objectives**: Master the techniques for writing effective prompts, so Codex can more accurately understand your needs
> ⏱️ **Estimated Time**: 20 minutes
> 🎯 **Teaching Rhythm**: Explanation + contrast examples

---

## I. Prompt Quality Determines Result Quality

Codex is very capable, but its performance largely depends on the prompts you give it.

**A good prompt = Clear goal + Specific requirements + Explicit acceptance criteria**

---

## II. Break Big Tasks Into Small Steps

### ❌ Bad prompt: "Help me build a website"

This prompt is too vague. Codex doesn't know what kind of website you want, what style, or what content to include.

### ✅ Better prompt: "Help me build a personal profile webpage"

Better, but still not specific enough.

### ✅✅ Even better prompt:
```
Help me build a personal profile webpage with the following requirements:
1. Include these sections: avatar, name, one-sentence bio, skills list, and contact info
2. Use a clean, modern design style
3. Primary color should be blue
4. Save the code as index.html
```

**Key technique**: Break a big task into several small steps and do them one at a time.

---

## III. Tell Codex to "Plan First, Then Execute"

Sometimes, directly asking Codex to execute may cause details to be missed. A better approach is:

```
Before you start, tell me your execution plan first. Wait for my confirmation before you begin.
```

This way you can:
- Confirm that Codex understood your requirements
- Adjust any deviations in the plan
- Avoid Codex doing a lot of useless work

---

## IV. Provide Background Information

Codex doesn't know about your life and work context. You need to proactively provide it.

### Examples

| Scenario | Background to Provide |
|----------|----------------------|
| Organizing photos | "These are photos from my trip to Japan last year. Organize them by city." |
| Writing an email | "This is an email to a client. The tone should be formal. The topic is about a project delay." |
| Data analysis | "This is our sales data, containing four columns: date, product, quantity, and amount." |

> 💡 **Tip**: More background info is not always better. Relevance is what matters.

---

## V. Use "Acceptance Criteria" to Tell Codex What "Done" Looks Like

### Example

```
Help me clean up this document. Requirements:
1. Remove all empty lines
2. Unify heading format (level 1 headings use #, level 2 headings use ##)
3. Check and fix typos
4. Finally, tell me what changes you made
```

Notice the last item — **asking Codex to tell you what it did**. This way you can quickly verify whether the result meets your expectations.

---

## VI. Prompt Templates

### File Operations
```
Please help me [action] [object], [specific requirements], [acceptance criteria]
```

### Content Generation
```
Please help me [action] a [type] about [topic], with [format/style], [acceptance criteria]
```

### Data Analysis
```
Please help me analyze [data source], find [focus point], output as [format], [acceptance criteria]
```

---

## VII. In-Lesson Practice

1. Choose a task you want Codex to complete.
2. Try it once with a vague prompt.
3. Try it again with a clear prompt (following the templates above).
4. Compare the difference between the two results.

---

## VIII. Summary

| Technique | Description |
|-----------|-------------|
| Break down tasks | Break big tasks into small steps, complete them gradually |
| Plan before executing | Ask Codex to give a plan first, confirm before executing |
| Provide background | Proactively tell Codex relevant context |
| Acceptance criteria | Clearly tell Codex what "done" looks like |

---

## IX. Next Step

[→ Lesson 13: Security & Permissions](lesson-13)
