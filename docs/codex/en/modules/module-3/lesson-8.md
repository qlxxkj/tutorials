# Lesson 8: File Operations — Codex's Most Basic Capability

> 📌 **Learning Objectives**: Master the basic methods for reading, editing, and organizing files with Codex
> ⏱️ **Estimated Time**: 25 minutes
> 🎯 **Teaching Rhythm**: Demo first → Explain → Practice

---

## I. Codex Can Read Files on Your Computer

This is one of Codex's most basic and core capabilities.

### 1.1 Drag and Drop Files into the Chat

Open Codex and directly drag files into the chat box or workspace:
- **Text files** (.txt, .md, .csv) → Codex can read the content directly
- **Code files** (.py, .js, .html) → Codex can analyze and modify them
- **Image files** (.jpg, .png) → Codex can recognize the content in the image
- **PDF files** → Codex can extract text and summarize

### 1.2 Let Codex Read a Folder

Besides individual files, you can also have Codex read an entire folder:

```
Help me see what files are in this folder.
```

Codex will list all file names, sizes, modification dates, and other information.

---

## II. Practice 1: Let Codex Help You Organize Documents

### Scenario
You have a "messy documents" folder containing:
- Word documents (.docx)
- PDF files
- Excel spreadsheets (.xlsx)
- Text files (.txt)

### Steps

1. Open the folder as the workspace in Codex
2. Type this command:
   ```
   Help me organize this folder. Create subfolders by file type and move similar files into them.
   ```
3. Codex will:
   - Scan all files
   - Create subfolders like `documents/`, `pdfs/`, `spreadsheets/`, `text-files/`
   - Move files to the corresponding locations

### Advanced Commands

If you want more fine-grained control:
```
Move all PDF files in this folder into a subfolder named "reports"
```
or
```
Find all files larger than 10MB and move them to a "large-files" folder.
```

---

## III. Practice 2: Batch Rename Files

### Scenario
You have a batch of photos with filenames like `IMG_001.jpg`, `IMG_002.jpg`... and you want to give them more meaningful names.

### Steps

1. Open the photos folder as the workspace
2. Type this command:
   ```
   Rename these photos to the format "Trip-Sequence.jpg", e.g., "Trip-001.jpg"
   ```
3. Codex will execute the batch rename.

### More Examples

| Your Command | What Codex Does |
|-------------|-----------------|
| "Change all .JPG to .jpg" | Unify extension case to lowercase |
| "Add the date prefix 20260722 to all filenames" | Add a date prefix |
| "Remove all spaces from filenames" | Clean up filenames |

---

## IV. Practice 3: Analyze Folder Disk Usage

### Scenario
Your hard drive is nearly full, and you want to know what's taking up space.

### Steps

1. Open the target folder (e.g., the entire "Downloads" folder)
2. Type this command:
   ```
   Help me analyze the disk space usage of this folder and list the top 10 largest files.
   ```
3. Codex will generate a report like this:

```
📊 Folder Space Analysis Report
Total size: 4.2 GB
Total files: 328

Top 10 Largest Files:
1. video_backup.mp4 — 1.2 GB
2. database_dump.sql — 850 MB
3. project_archive.zip — 620 MB
...
```

---

## V. Can Codex Edit Files?

**Yes!** And this is one of its very powerful capabilities.

### Example: Modifying a Text File

Suppose you have a `notes.txt` file with this content:

```
To-do list:
1. Buy milk
2. Pay rent
3. Book a dentist appointment
```

You can tell Codex:
```
Add one more item to this to-do list: "Book a haircut appointment", at the end.
```

Codex will directly modify the original file and add the new item.

### Example: Formatting Data

Suppose you have a CSV file with messy data. You can say:
```
Help me clean up this CSV file. Make sure every column has a header, remove empty rows, and unify the date format to YYYY-MM-DD.
```

Codex will read the file, modify the content, and save the result.

---

## VI. In-Lesson Practice Checklist

Complete the following tasks in order:
- [ ] Create a test folder and put different types of files in it (.txt, .pdf, .jpg, .xlsx)
- [ ] Have Codex count the files and show the type distribution
- [ ] Have Codex automatically classify files by type into different subfolders
- [ ] Have Codex batch rename a set of files
- [ ] Have Codex analyze the folder's disk space usage

---

## VII. Summary

| Capability | Description |
|------------|-------------|
| Read files | Supports text, code, images, PDF, and more |
| Read folders | List file trees, show statistics |
| Edit files | Modify file content directly |
| Batch operations | Rename, move, classify, format |
| Space analysis | View file sizes and disk usage |

---

## VIII. Next Step

[→ Lesson 9: Natural Language Driven](lesson-9)
