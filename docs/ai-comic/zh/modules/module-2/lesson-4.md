# 第 4 课：开发环境准备

> 📌 **学习目标**：完成 Python、FFmpeg 和必要的开发工具安装
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：环境检查 → 分步安装 → 验证测试

---

## 一、必要软件清单

| 软件 | 版本要求 | 用途 | 必须 |
|------|---------|------|------|
| Python | 3.10+ | 运行脚本 | ✅ |
| FFmpeg | 任何稳定版 | 视频合成 | ✅ |
| Git | 任何版本 | 版本管理 | 推荐 |
| VS Code | 任何版本 | 代码编辑 | 推荐 |

---

## 二、安装 Python

### Windows

1. 访问 [python.org](https://www.python.org/downloads/)
2. 下载 Python 3.10+ 安装程序
3. **重要**：安装时勾选 ✅ "Add Python to PATH"
4. 验证安装：

```bash
python --version
# 输出示例：Python 3.12.8
```

### macOS

```bash
# 使用 Homebrew
brew install python@3.12

# 验证
python3 --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
```

---

## 三、安装 FFmpeg

FFmpeg 是视频合成的核心工具，几乎所有场景都需要。

### Windows

1. 访问 [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
2. 下载 **ffmpeg-release-essentials.zip**
3. 解压到 `C:\ffmpeg`
4. 将 `C:\ffmpeg\bin` 添加到系统 PATH：
   - 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
   - 在"系统变量"中找到 Path，点击"编辑"
   - 新增 `C:\ffmpeg\bin`
5. 重启终端，验证：

```bash
ffmpeg -version
# 输出类似：ffmpeg version 7.1-essentials_build...
```

### macOS

```bash
brew install ffmpeg
ffmpeg -version
```

### Linux

```bash
sudo apt install ffmpeg
ffmpeg -version
```

---

## 四、创建项目并安装依赖

```bash
# 创建项目目录
mkdir ai-comic-maker
cd ai-comic-maker

# 创建虚拟环境（推荐）
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install openai pillow requests python-dotenv moviepy
```

---

## 五、验证环境

创建一个测试脚本 `test_env.py`：

```python
"""环境验证脚本"""
import sys
import subprocess

print("=" * 40)
print("🔧 AI 漫剧制作器 - 环境检查")
print("=" * 40)

# 1. Python 版本
print(f"\n✅ Python: {sys.version}")

# 2. FFmpeg
try:
    result = subprocess.run(
        ["ffmpeg", "-version"],
        capture_output=True, text=True, timeout=5
    )
    if result.returncode == 0:
        version_line = result.stdout.split("\n")[0]
        print(f"✅ FFmpeg: {version_line}")
    else:
        print("❌ FFmpeg 未安装或未加入 PATH")
except FileNotFoundError:
    print("❌ FFmpeg 未安装，请前往 https://www.gyan.dev/ffmpeg/builds/ 下载")

# 3. Python 包
import importlib.util
packages = {
    "openai": "OpenAI SDK",
    "PIL": "Pillow (图像处理)",
    "requests": "Requests (HTTP)",
    "dotenv": "python-dotenv (环境变量)",
}

for module, name in packages.items():
    spec = importlib.util.find_spec(module)
    if spec:
        print(f"✅ {name}")
    else:
        print(f"❌ {name} - 请运行: pip install {module}")

# 4. API Key 检查
import os
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    masked = api_key[:8] + "..." + api_key[-4:]
    print(f"✅ OPENAI_API_KEY: {masked}")
else:
    print("⚠️  OPENAI_API_KEY 未设置，请复制 .env.example 为 .env 并填入 Key")

print("\n" + "=" * 40)
print("检查完成！")
```

运行验证：

```bash
python test_env.py
```

期望输出：

```
========================================
🔧 AI 漫剧制作器 - 环境检查
========================================

✅ Python: 3.12.8 (main, ...)
✅ FFmpeg: ffmpeg version 7.1-essentials_build...
✅ OpenAI SDK
✅ Pillow (图像处理)
✅ Requests (HTTP)
✅ python-dotenv (环境变量)
⚠️  OPENAI_API_KEY 未设置...

========================================
检查完成！
```

---

## 六、常见问题

### Q: FFmpeg 命令找不到？

确保安装后**重启终端**，让 PATH 生效。也可以在脚本中用 FFmpeg 的完整路径。

### Q: pip 安装很慢？

使用国内镜像：

```bash
pip install openai pillow requests python-dotenv moviepy -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Q: Python 版本低于 3.10？

部分新特性（如类型注解改进）需要 3.10+。建议直接安装最新稳定版。

---

*下节课：[第 5 课：API 配置与认证](lesson-5.md)*
