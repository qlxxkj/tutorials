# Appendix: FAQ

## Installation

### Q1: How to install Claude Code?

```bash
npm install -g @anthropic-ai/claude-code
```

After installation, type `claude` in the terminal to start.

### Q2: What are the system requirements?

- **Windows**: Windows 10 or higher
- **macOS**: macOS 11.0 or higher
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher

### Q3: What if installation fails?

1. Check if Node.js is installed: `node --version`
2. Check if npm is available: `npm --version`
3. Try running terminal as administrator
4. Check network connection (need to access npm registry)

---

## Usage

### Q4: Is Claude Code free?

You need an Anthropic API key. There is a free quota, and you pay for usage beyond that. Check [Anthropic's website](https://www.anthropic.com/pricing) for details.

### Q5: How to get an API key?

1. Visit https://console.anthropic.com/
2. Register an account
3. Generate API key in API Keys page
4. Set environment variable `ANTHROPIC_API_KEY`

### Q6: What's the difference between Claude Code and ChatGPT?

| Feature | ChatGPT | Claude Code |
|---------|---------|-------------|
| Where it runs | Web/App | Your computer terminal |
| Can read local files | ❌ | ✅ |
| Can run commands | ❌ | ✅ |
| Can操作 folders | ❌ | ✅ |
| Can create websites | Only gives code | Builds it for you |

### Q7: Is Claude Code safe?

- All code runs locally on your computer
- Your files are not uploaded to the cloud (except for API calls that send code snippets)
- Important operations will ask for confirmation first
- Recommended not to use unreviewed code in sensitive environments

---

## Tips

### Q8: How to write good prompts?

Use the ACTOR formula:
- **A**ction: What you want to do
- **C**ontext: Why you're doing it
- **T**arget: What result you expect
- **O**utput: Output format and location
- **R**estrictions: Any requirements or limitations

### Q9: What if AI gives wrong answers?

1. Redescribe the problem, be more specific
2. Provide more context
3. Describe the task in steps
4. Provide example data
5. Tell AI directly what's wrong

### Q10: Can I use it offline?

Currently Claude Code requires internet connection as it needs to call cloud AI models. You can install it locally, but you need network connectivity.

---

## Advanced

### Q11: Can I customize skills?

Yes! Use the `/skills` command to view and create custom skills.

### Q12: Can I process files in batches?

Yes! Use wildcards:
```
Process E:/data/*.csv
```

### Q13: Can I set up scheduled tasks?

Yes! Combine with system scheduled task tools (like Windows Task Scheduler).

---

## Other

### Q14: What programming languages are supported?

Claude Code supports all major programming languages, including:
- Python
- JavaScript/TypeScript
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- And more

### Q15: How to learn more?

- Official documentation: https://docs.anthropic.com/
- Community forums
- Other tutorials and courses
