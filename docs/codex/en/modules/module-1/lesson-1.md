# Lesson 1: What is an AI Programming Assistant?

> 📌 **Learning Objectives**: Understand the basic concept of AI programming assistants, know the difference between Codex and traditional chatbots
> ⏱️ **Estimated Time**: 15 minutes
> 🎯 **Teaching Rhythm**: Demo first → Explain → Practice

---

## I. Demo First: Let AI Do Something for You

Before we start, I want you to experience what "AI doing work for you" feels like.

Open ChatGPT (or any AI chat tool) and type this:

```
Help me write a Python script that reads all .txt files in the current folder, counts the lines in each file, and outputs a summary report.
```

See how the AI responds — it will usually give you runnable code directly. Copy this code, save it as `count_lines.py`, then run it in your terminal:

```bash
python count_lines.py
```

Congratulations, you've just used AI to build a small tool. **You haven't written a single line of code, but you made AI write it for you.**

This is the power of AI programming assistants.

---

## II. From "Chatbot" to "Agent That Gets Things Done"

### 2.1 Chatbot vs Programming Assistant

You've probably used AI tools like ChatGPT, Wenxin Yiyan, or Tongyi Qianwen. They all share one common characteristic: **they can only chat with you**.

You ask a question, it gives you a text response. You can ask it to write code snippets, but whether the code runs, how to run it, and where to run it — it doesn't care.

**AI programming assistants (like Codex) are different.** They can not only "chat" but also "do things":

| Capability | Chatbot | AI Programming Assistant (Codex) |
|------------|---------|----------------------------------|
| Answer questions | ✅ | ✅ |
| Write code snippets | ✅ | ✅ |
| Read your project files | ❌ | ✅ |
| Run code and debug | ❌ | ✅ |
| Operate files on your computer | ❌ | ✅ |
| Call external tools | ❌ | ✅ |
| Complete full tasks | ❌ | ✅ |

### 2.2 What Exactly is Codex?

**Codex is OpenAI's AI programming agent.**

Pay attention to two keywords:

- **Programming**: Its core capabilities revolve around code — writing code, modifying code, debugging code, explaining code
- **Agent**: It's not a passive tool that answers questions, but an "assistant" that can proactively execute tasks

You can think of Codex as a **programming-savvy intern**:

- You tell it what you want (in natural language)
- It goes to read relevant files, write code, run tests, find problems, and fix errors
- Finally, it delivers the results to you

**You don't need to teach it programming knowledge. You just need to tell it what you want.**

---

## III. Real-Life Analogies

If it still feels abstract, let's use some everyday scenarios to understand:

### Analogy 1: Codex = A Programming-Savvy Intern

You're a new manager at a company and you've hired an intern. This intern:

- Can write code
- Can read the files you give them
- Can figure out solutions on their own
- You tell them when they make a mistake, they'll fix it
- They deliver the results to you for review

**Codex is this intern.** You don't need to know how to code. You just need to "make requests" like a manager.

### Analogy 2: Codex = A Multi-Talented Secretary

Your secretary can help you:

- Organize files (by type, date, etc.)
- Search for information (look up materials online and compile reports)
- Write emails (automatically generate based on your key points)
- Make spreadsheets (you tell them the data format, they format it)

**Codex is this secretary, except it can also write code.**

### Analogy 3: Codex = LEGO Bricks + Instructions

Imagine you want to build a LEGO castle:

- **Traditional way**: You piece it together yourself, needing to understand the instructions
- **Codex way**: You tell it "I want a castle with towers and walls," and it builds it for you. You just inspect the result.

---

## IV. Codex Is Not Just a Code Completion Tool

Many people first hear about AI programming tools and think of GitHub Copilot. What is Copilot? It's a **code completion tool** — you type in your editor, and it helps complete the next line of code.

**Codex is much more powerful than Copilot.**

| Comparison | GitHub Copilot | Codex |
|------------|----------------|-------|
| Where it works | Inside editor | Standalone app / command line |
| Capability scope | Complete code | Read projects, write code, run commands, call tools |
| Task granularity | Single line / single function | Complete features / complete projects |
| Need programming background? | Yes (at least read code) | No (converse in natural language) |
| Typical users | Programmers | Anyone (including non-programmers) |

**Simply put: Copilot is "training wheels" for programmers, Codex is "autopilot" for ordinary people.**

---

## V. Summary

| Knowledge Point | Core Content |
|-----------------|--------------|
| AI Programming Assistant vs Chatbot | The former can do things, the latter can only chat |
| Codex's Core Positioning | OpenAI's AI programming agent, can read files, write code, run commands |
| Codex vs Copilot | Copilot completes code, Codex completes tasks |
| Analogy Understanding | Codex = Programming-Savvy Intern / Multi-Talented Secretary |

---

## VI. Post-Lesson Thinking

1. Is there a "repeat, annoying, but must-do" task in your work? Think about it — can Codex help you do it?
2. What do you think is the difference between "knowing how to code" and "using AI to program"?

> 💡 **Hint**: In the next lesson, we'll show what Codex can specifically do for you. You might discover more tasks you can replace with it.

---

## VII. Next Step

[→ Lesson 2: What Can Codex Do for You?](lesson-2)
