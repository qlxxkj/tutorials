# Lesson 13: Security & Permissions

> 📌 **Learning Objectives**: Understand the security risks when using Codex, and learn to set permissions correctly
> ⏱️ **Estimated Time**: 15 minutes
> 🎯 **Teaching Rhythm**: Explanation + hands-on demo

---

## I. Why Do We Need Permission Management?

Codex can operate your files — read, modify, and delete. This means it has both great power and potential risks.

**The core purpose of permission management**: Ensure Codex only operates within authorized scopes, protecting your data security.

---

## II. Detailed Explanation of Three Permission Modes

### 1. Default Permission (Recommended for Beginners)

Codex asks for your approval before executing any file modifications.

```
Codex: I plan to create a new subfolder "images" in this folder and move all image files into it. Do you allow this?
You: [Allow / Deny]
```

**Applicable scenarios**:
- Just starting to use Codex
- When handling important files
- When you're unsure what Codex will do

### 2. Auto-Review (Recommended for Advanced Users)

Codex can execute operations automatically, but you can review and audit afterward.

**Applicable scenarios**:
- You already trust Codex's working style
- When handling a large number of repetitive tasks
- ⚠️ It's recommended to back up important files before operations

### 3. Full Access (Not Recommended)

Codex has full read/write permission to files in your workspace.

**Applicable scenarios**:
- Only enable when you fully understand the risks
- Not recommended for beginners

---

## III. Safe Usage Guide

### ✅ What You Should Do

| Behavior | Explanation |
|----------|-------------|
| Back up important files | Back up before letting Codex operate on important files |
| Use default permissions | Keep default permissions when first starting out |
| Review results | After Codex completes a task, check whether the result is correct |
| Limit workspace | Only let Codex access the folders it needs |

### ❌ What You Should Not Do

| Behavior | Risk |
|----------|------|
| Enter passwords, bank card info, etc. | May lead to privacy leaks |
| Give Codex full access | May accidentally delete important files |
| Don't check Codex's output | May accept incorrect results |
| Let Codex operate critical system directories | May affect normal system operation |

---

## IV. Hands-On: Setting Permissions

1. Open Codex's settings interface
2. Find "Permission Management" or "Security Settings"
3. Select "Default Permission" mode
4. Try having Codex perform a File Operation and observe how it asks for your confirmation.

---

## V. Summary

| Knowledge Point | Core Content |
|-----------------|--------------|
| Purpose of permission management | Ensure Codex operates within authorized scopes |
| Three modes | Default (safe), Auto-Review (efficient), Full Access (high risk) |
| Safety principles | Back up important files, limit workspace, review results |
| Sensitive information | Never enter passwords or bank card info into Codex |

---

## VI. Next Step

[→ Lesson 14: Codex Skills](lesson-14)
