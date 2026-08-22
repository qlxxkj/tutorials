# Lesson 11: Automation Tasks — Let Codex Run Errands for You

> 📌 **Learning Objectives**: Learn to use Codex to execute repetitive tasks, understand the difference between "one-time tasks" and "reusable workflows"
> ⏱️ **Estimated Time**: 25 minutes
> 🎯 **Teaching Rhythm**: Demo first → Explain → Practice

---

## I. What Are "Automation Tasks"?

Automation Tasks mean: **You tell Codex what to do, and it completes the entire process step by step, without you needing to repeatedly operate.**

### Real-Life Analogy

Imagine you're moving house:
- **Manual way**: You pack everything yourself, label each box, and carry it to the truck
- **Automation way**: You tell an assistant "I'm moving, take these things to the new place," and the assistant handles packing, labeling, and transporting on its own

Codex is that "assistant."

---

## II. Practice 1: Batch Rename a Set of Files

### Scenario
You downloaded 50 photos, and the filenames are all `download_001.jpg`, `download_002.jpg`... You want to give them more meaningful names.

### Steps

1. Open the photos folder as the workspace
2. Type this command:
   ```
   Help me rename these photos by date, in the format "ShootingDate_Sequence.jpg".
   Example: 2026-07-20_001.jpg
   ```
3. Codex will read each photo's EXIF data (if available) and batch-rename them.

### More Batch Operation Examples

| Your Need | Command Example |
|-----------|----------------|
| Unify extension case | "Change all .JPG to .jpg" |
| Add a prefix/suffix | "Add 'ProjectA-' to the front of all filenames" |
| Remove specific characters | "Remove all spaces and underscores from filenames" |
| Rename by rule | "Change 'IMG_*.jpg' to 'Trip_*.jpg'" |

---

## III. Practice 2: Automatically Download and Organize Materials

### Scenario
You need to collect online materials on a certain topic, but you don't want to click each link and copy-paste manually.

### Steps

1. In Codex, type:
   ```
   Help me search for the latest articles on "remote work best practices", find the top 5 results, and organize each result's title, summary, and link into a document.
   ```
2. Codex will:
   - Search the web for relevant information
   - Extract the top 5 results
   - Create a Markdown file with the organized content
3. You can then ask:
   ```
   Translate this document into Chinese.
   ```
   or
   ```
   Based on these materials, write a recommendation list about remote work.
   ```

---

## IV. Understand "One-Time Task" vs "Reusable Automation Workflow"

### One-Time Task
For example: "Help me merge the PDF files in this folder into one."
- Do it once and it's done
- If you need to do the same thing again, you have to tell Codex again

### Reusable Workflow
For example: "Every time a new email arrives, automatically extract the table data from the attachment and save it to Excel."
- Can be set to run periodically
- Or made into a script/template for随时调用

> 💡 **Tip**: Codex can not only do one-time tasks but also help you write reusable scripts. When you find a task that you do often, ask Codex to turn it into an automation script.

---

## V. Practice 3: Create Your First Automation Script

### Task
Ask Codex to write an auto-generation script for your "daily work report."

### Steps

1. Prepare a folder containing daily work records.
2. Type this command:
   ```
   Help me write a Python script that reads all log files in this folder,
   counts the number of work entries per day, and generates a summary report.
   ```
3. Codex will generate a reusable script.
4. Every morning, run the script once, and you'll automatically get the previous day's work summary.

---

## VI. In-Lesson Practice Checklist

Complete the following tasks in order:
- [ ] Have Codex batch-rename a set of files
- [ ] Have Codex search the web for materials and organize them into a document
- [ ] Try having Codex write a simple automation script
- [ ] Reflect: What repetitive tasks in your work could you hand over to Codex for automation?

---

## VII. Summary

| Knowledge Point | Core Content |
|-----------------|--------------|
| Automation Tasks | Let Codex handle repetitive work for you |
| Batch operations | Rename, move, classify, format, etc. |
| Web Search | Search + organize + summarize |
| One-time vs reusable | Simple tasks: just ask. Complex tasks: write a script |

---

## VIII. Next Step

[→ Enter Module 4: Practical Tips](../module-4/lesson-12)
