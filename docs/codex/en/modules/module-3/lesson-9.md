# Lesson 9: Natural Language Driven — Commanding AI by "Talking"

> 📌 **Learning Objectives**: Master the method of writing effective prompts, learn to describe needs in natural language
> ⏱️ **Estimated Time**: 25 minutes
> 🎯 **Teaching Rhythm**: Explanation + contrast examples + hands-on practice

---

## I. What is "Vibe Coding"?

**Vibe Coding** is a new term that means: **describe what you want in natural language, and let AI handle the implementation.**

You don't need to write code. You don't need to understand technical details. You only need to:
1. Clearly know what you want
2. Describe it concisely in language
3. Let AI implement it

### Analogy

Imagine ordering food at a restaurant:
- **Traditional programming**: You need to buy ingredients, wash them, chop them, cook them, and season them — every step by hand
- **Vibe Coding**: You tell the chef (Codex) "I want Kung Pao chicken, less spicy," and the chef handles everything

**You don't need to know how to cook. You just need to know how to order.**

---

## II. How to Write Good "Prompts"

### 2.1 Bad Prompt vs Good Prompt

| Bad Prompt ❌ | Good Prompt ✅ | Why |
|-------------|---------------|-----|
| "Help me make something" | "Help me build a personal profile webpage with a photo, name, bio, and contact info" | Specific about what to do |
| "Organize the files" | "Group the documents on my desktop into folders by date" | Explain the sorting rule |
| "Write a program" | "Write a Python script that reads a CSV file and calculates the average of each column" | Specify input, processing, and output |
| "Change the colors" | "Change the page's primary color from red to blue, and make the button background dark blue" | Specify exactly what to change |

### 2.2 Four Elements of a Good Prompt

A complete prompt should include these elements:

```
[Action] + [Object] + [Rules/Requirements] + [Expected Result]
```

Examples:
- **Action**: Help me organize / Help me create / Help me analyze
- **Object**: This folder / This dataset / This webpage
- **Rule**: Classify by file type / Remove empty rows / Use blue theme
- **Expected result**: Generate a report / Output a summary table / Save to specified location

### 2.3 Prompt Templates

You can directly use these templates:

**File Operations:**
```
Help me [action] [object], [rule]
Example: Help me classify the images in this folder by shooting date.
```

**Content Generation:**
```
Help me [action] a [type] about [topic], with [specific requirements]
Example: Help me write a weekly report on healthy eating, divided into three sections.
```

**Data Analysis:**
```
Help me analyze [data source], find [focus point], output as [format]
Example: Help me analyze this sales data, find the fastest-growing products, output as a table.
```

---

## III. Learn to "Follow Up" and "Correct"

Codex doesn't always give perfect results on the first try. The key is **learning to follow up**.

### Scenario Demo

Suppose you want Codex to build you a webpage:

**Round 1:**
```
You: Help me build a personal profile webpage.
Codex: Generates a basic webpage.
```

**Round 2 (you notice an issue):**
```
You: The page is too simple. Add a project showcase section.
Codex: Adds the project showcase section.
```

**Round 3 (further optimization):**
```
You: Change the primary color to blue and use a larger font.
Codex: Modifies the color and font.
```

**Round 4 (final review):**
```
You: Great. Now save the code as index.html.
Codex: Save complete.
```

### Key Tips
- **Don't be afraid to say "that's not right"**: If the result isn't what you want, tell Codex directly what's wrong.
- **Give specific feedback**: Don't say "it doesn't look good." Say "make the title font bigger" or "add some spacing."
- **Progress step by step**: Break big tasks into small steps and do them one at a time.

---

## IV. Hands-On: Let Codex Create a Webpage from Your Description

### Task
Use Codex to create a simple personal profile webpage.

### Steps

1. Open Codex and create a new workspace (e.g., a "My Webpage" folder on your desktop).
2. Type this prompt:
   ```
   Help me build a personal profile webpage that includes:
   - Top: a circular avatar placeholder + name + a one-sentence bio
   - Middle: a skills list (displayed as tags)
   - Bottom: contact info (email and social media links)
   The overall style should be clean and modern, using blue as the primary color.
   ```
3. Observe the HTML code Codex generates.
4. Save the code as `index.html` and open it in a browser to see the result.
5. Based on what you see, continue to request modifications.

### Possible Follow-Up Prompts
- "Change the avatar from a circle to a rounded square."
- "Add a project showcase section below the skills list."
- "Change the color scheme to dark mode."

---

## V. In-Lesson Practice Checklist

Complete the following tasks in order:
- [ ] Try using a "bad prompt" to get Codex to do something, and feel the problem with vague prompts.
- [ ] Rephrase the same task with a "good prompt" and compare the results.
- [ ] Complete the webpage creation hands-on above, with at least 3 rounds of follow-up.
- [ ] Summarize: What do you think is the hardest part of writing prompts?

---

## VI. Summary

| Knowledge Point | Core Content |
|-----------------|--------------|
| Vibe Coding | Describe the goal in natural language, let AI handle the rest |
| Four elements of a good prompt | Action + Object + Rules + Expected result |
| Follow-up and correction | Don't追求 a perfect result on the first try, learn to iteratively optimize |
| Prompt templates | File Operations / Content Generation / Data Analysis three categories |

---

## VII. Next Step

[→ Lesson 10: Web Search & Research](lesson-10)
