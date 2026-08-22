# 附录：常见问题 FAQ

## 一、安装问题

### Q1：Claude Code 怎么安装？

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，在终端输入 `claude` 即可启动。

### Q2：需要什么系统要求？

- **Windows**：Windows 10 及以上
- **macOS**：macOS 11.0 及以上
- **Node.js**：18.0 及以上版本
- **npm**：8.0 及以上版本

### Q3：安装失败怎么办？

1. 检查 Node.js 是否安装：`node --version`
2. 检查 npm 是否可用：`npm --version`
3. 尝试使用管理员权限运行终端
4. 检查网络连接（需要访问 npm  registry）

---

## 二、使用问题

### Q4：Claude Code 收费吗？

需要 Anthropic API 密钥。有免费额度，超出后按使用量收费。具体价格请查看 [Anthropic 官网](https://www.anthropic.com/pricing)。

### Q5：如何获取 API 密钥？

1. 访问 https://console.anthropic.com/
2. 注册账号
3. 在 API Keys 页面生成密钥
4. 设置环境变量 `ANTHROPIC_API_KEY`

### Q6：Claude Code 和 ChatGPT 有什么区别？

| 对比项 | ChatGPT | Claude Code |
|--------|---------|-------------|
| 工作位置 | 网页/App | 你的电脑终端 |
| 能读本地文件 | ❌ | ✅ |
| 能运行命令 | ❌ | ✅ |
| 能操作文件夹 | ❌ | ✅ |
| 能创建网站 | 只能给代码 | 直接帮你建好 |

### Q7：Claude Code 安全吗？

- 所有代码在你本地运行
- 不会上传你的文件到云端（除了 API 调用需要发送代码片段）
- 重要操作会先询问确认
- 建议不要在敏感环境中使用未审核的代码

---

## 三、使用技巧

### Q8：怎么写出好的提示词？

使用 ACTOR 公式：
- **A**ction（动作）：你要做什么
- **C**ontext（背景）：为什么做
- **T**arget（目标）：期望什么结果
- **O**utput（输出）：输出格式和位置
- **R**estrictions（限制）：有什么要求

### Q9：AI 回答不对怎么办？

1. 重新描述问题，更具体
2. 给出更多上下文
3. 分步骤描述任务
4. 提供示例数据
5. 直接告诉 AI 哪里不对

### Q10：可以离线使用吗？

目前 Claude Code 需要联网使用，因为它需要调用云端 AI 模型。本地可以安装，但必须有网络连接。

---

## 四、进阶问题

### Q11：可以自定义技能吗？

可以！使用 `/skills` 命令查看和创建自定义技能。

### Q12：可以批量处理文件吗？

可以！使用通配符：
```
处理 E:/data/*.csv
```

### Q13：可以设置定时任务吗？

可以！结合系统的定时任务工具（如 Windows 任务计划程序）实现。

---

## 五、其他问题

### Q14：支持哪些编程语言？

Claude Code 支持所有主流编程语言，包括：
- Python
- JavaScript/TypeScript
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- 等等

### Q15：如何学习更多？

- 官方文档：https://docs.anthropic.com/
- 社区论坛
- 其他教程和课程
