# 项目三：部署自动化流水线

> 📌 **学习目标**：将手动流程升级为可自动触发的生产管线
> ⏱️ **预计时长**：45 分钟
> 🎯 **本节节奏**：CI/CD → 定时任务 → 监控告警

---

## 一、为什么需要自动化？

当你要批量生产或定时发布时，手动运行脚本不够用：

- 每天手动运行太麻烦
- 需要记录每次生成的状态
- 出错了需要知道哪里出了问题
- 多人协作需要统一的入口

---

## 二、GitHub Actions 自动构建

### 2.1 创建 workflow 文件

在 `.github/workflows/build.yml` 中：

```yaml
name: AI Comic Build

on:
  push:
    branches: [main]
  workflow_dispatch:  # 支持手动触发

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Generate comic
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          TOPIC: "程序员深夜加班"
          STYLE: "anime"
        run: python scripts/main.py --topic "$TOPIC" --style "$STYLE"

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: comic-output
          path: output/
```

### 2.2 配置 Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

```
OPENAI_API_KEY=sk-xxxxxxxx
```

---

## 三、定时生成

使用 cron 表达式设置定时任务：

```yaml
# 每天早上 9 点自动生成一部新漫剧
schedule:
  - cron: '0 9 * * *'
```

---

## 四、监控与日志

### 4.1 生成日志

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/comic_build.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# 使用时
logger.info(f"开始生成第 {i+1}/{total} 个镜头")
logger.warning(f"API 限流，等待 5 秒后重试")
logger.error(f"生成失败: {e}")
```

### 4.2 失败告警

```python
import smtplib
from email.mime.text import MIMEText

def send_alert(subject: str, message: str, to: str):
    """发送失败告警邮件"""
    msg = MIMEText(message)
    msg["Subject"] = f"[AI漫剧] {subject}"
    msg["To"] = to
    msg["From"] = "your@email.com"

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login("your@email.com", "your_password")
    server.send_message(msg)
    server.quit()
```

---

## 五、本章小结

| 组件 | 用途 | 实现方式 |
|------|------|---------|
| CI/CD | 代码变更自动构建 | GitHub Actions |
| 定时任务 | 每天自动生成 | cron + workflow_dispatch |
| 日志记录 | 追踪生成过程 | Python logging |
| 失败告警 | 及时通知问题 | SMTP 邮件 |

---

*至此，本课程全部内容完成！回到 [课程回顾](../summary.md)*
