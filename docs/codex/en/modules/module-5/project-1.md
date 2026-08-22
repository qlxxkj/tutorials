# Project 1: Organize Your Computer (Beginner Level)

> 📌 **Learning Objectives**: Master Codex's File Operations and natural language command abilities by organizing a computer folder
> ⏱️ **Estimated Time**: 20 minutes
> 🎯 **Skills learned**: File Operations, natural language commands, permission management

---

## I. Task Description

Use Codex to analyze and organize a messy downloads folder on your computer.

---

## II. Preparation

1. Create a test folder on your computer named "Folder to Organize"
2. Put some different types of files inside it (if you don't have real files, just create a few manually):
   - A few text files (.txt)
   - A few image files (.jpg, .png)
   - A few PDF files
   - A few Excel files (.xlsx)
   - A few archive files (.zip)
3. You can also use your computer's actual "Downloads" folder (recommended: copy it to the desktop first as a test).

---

## III. Operation Steps

### Step 1: Set the Folder as Codex's Workspace

1. Open the Codex desktop app
2. Click "Open Folder" or "Select Workspace"
3. Find your "Folder to Organize" and confirm.

### Step 2: Have Codex Analyze the Folder

Type this into the chat box:
```
Please help me analyze this folder. Tell me:
1. How many files are there in total?
2. How many of each file type?
3. What are the three largest files?
```
Observe Codex's output to understand the folder's current state.

### Step 3: Have Codex Organize the Folder

Type this command:
```
Please organize this folder by file type:
- Image files (.jpg, .png, .gif) → move to images folder
- Document files (.pdf, .docx, .doc) → move to documents folder
- Spreadsheet files (.xlsx, .xls, .csv) → move to spreadsheets folder
- Text files (.txt, .md) → move to text-files folder
- Archive files (.zip, .rar, .7z) → move to archives folder
- Other files → move to other folder
Please tell me your plan first, and wait for my confirmation before executing.
```

### Step 4: Review Codex's Plan

Codex will list its organization plan, for example:
```
My organization plan:
1. Create the following subfolders: images/, documents/, spreadsheets/, text-files/, archives/, other/
2. Scan all files and classify by extension
3. Move each file to the corresponding subfolder
Please confirm whether to start execution?
```
Click "Allow" or type "Start."

### Step 5: Verify the Results

After organizing, check whether the folder structure is correct:
```
Folder to Organize/
├── images/
│   ├── photo1.jpg
│   └── screenshot.png
├── documents/
│   └── report.pdf
├── spreadsheets/
│   └── data.xlsx
├── text-files/
│   └── notes.txt
├── archives/
│   └── backup.zip
└── other/
    └── unknown.file
```

---

## IV. Advanced Challenges

If the above task is too easy, try these advanced commands:
```
Find all files larger than 10MB and put them in a separate "large-files" folder.
```
```
Count how many files have duplicate names (ignoring extensions) in this folder.
```
```
Help me generate a folder organization report and save it to reports.md.
```

---

## V. Summary

| Skill Learned | How It Shows |
|---------------|-------------|
| File Operations | Read, classify, move files |
| Natural language commands | Describe organization rules in natural language |
| Permission management | Observe how Codex asks for your approval |
| Result verification | Check whether the organization results meet expectations |

---

## VI. Next Step

[→ Project 2: Create a PPT Report](project-2)
