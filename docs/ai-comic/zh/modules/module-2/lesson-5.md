# 第 5 课：API 配置与认证

> 📌 **学习目标**：配置 OpenAI API Key，理解认证机制，掌握多平台兼容方案
> ⏱️ **预计时长**：15 分钟
> 🎯 **本节节奏**：获取 Key → 配置环境变量 → 测试连通

---

## 一、你需要什么 API Key？

AI 漫剧的核心 API 需求：

| 功能 | 所需 API | 推荐服务 | 预估费用/集 |
|------|---------|---------|------------|
| 剧本生成 | LLM Chat | OpenAI GPT-4o | ¥0.5 |
| 图像生成 | Image Generation | OpenAI GPT-Image-1 | ¥6～8 |
| 语音合成 | TTS | OpenAI TTS | ¥1～2 |

**只需要一个 OpenAI API Key 即可覆盖所有功能。**

---

## 二、获取 API Key

### 方式 A：OpenAI 官方

1. 注册账号：[platform.openai.com](https://platform.openai.com)
2. 充值（最低 $5 起）
3. 进入 [API Keys 页面](https://platform.openai.com/api-keys)
4. 点击 "Create secret key"
5. **立即复制保存**（Key 只显示一次）

### 方式 B：Agnes AI（国内访问）

1. 访问 [agnes-ai.com](https://agnes-ai.com) 注册
2. 充值后在控制台创建 API Key
3. 获取 Base URL（如 `https://api.agnes-ai.com/v1`）

### 方式 C：One API / New-API（自建代理）

如果你已部署了 One API（`E:/claude/new-api/`），可以直接使用：

1. 登录 One API 管理面板
2. 创建用户并分配配额
3. 生成 API Key
4. Base URL 填 `http://localhost:3000/v1`（或你的部署地址）

---

## 三、配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 复制模板
cp .env.example .env

# 编辑 .env，填入你的 Key
```

`.env` 文件内容：

```bash
# OpenAI API 配置
OPENAI_API_KEY=sk-your-key-here
OPENAI_BASE_URL=https://api.openai.com/v1

# 如果使用国内代理，改为：
# OPENAI_BASE_URL=https://api.agnes-ai.com/v1

# 如果使用本地 One API，改为：
# OPENAI_BASE_URL=http://localhost:3000/v1
```

> ⚠️ **重要**：`.env` 文件绝对不要提交到 Git！已在 `.gitignore` 中排除。

---

## 四、代码中读取 API Key

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

# 加载 .env 文件中的环境变量
load_dotenv()

# 初始化 OpenAI 客户端
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)
```

这种写法的好处：**同一个代码可以在不同环境运行**——本地用本地 Key，服务器用服务器 Key，无需修改代码。

---

## 五、测试 API 连通性

创建一个测试脚本 `test_api.py`：

```python
"""API 连通性测试"""
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

print("🧪 测试 LLM 连接...")
try:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "说一句简短的中文：你好"}],
        max_tokens=20
    )
    print(f"✅ LLM 正常: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ LLM 错误: {e}")

print("\n🧪 测试 TTS 连接...")
try:
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input="你好世界",
        speed=1.0,
    )
    print(f"✅ TTS 正常（响应长度: {len(response.content)} bytes）")
except Exception as e:
    print(f"❌ TTS 错误: {e}")

print("\n🧪 测试图像生成连接...")
try:
    response = client.images.generate(
        model="gpt-image-1",
        prompt="一只可爱的猫咪，动漫风格",
        size="256x256",
        n=1,
    )
    url = response.data[0].url
    print(f"✅ 图像生成正常（URL 长度: {len(url)} 字符）")
except Exception as e:
    print(f"❌ 图像生成错误: {e}")
```

运行：

```bash
python test_api.py
```

期望输出：

```
🧪 测试 LLM 连接...
✅ LLM 正常: 你好！

🧪 测试 TTS 连接...
✅ TTS 正常（响应长度: XXXXX bytes）

🧪 测试图像生成连接...
✅ 图像生成正常（URL 长度: XXX 字符）
```

---

## 六、常见错误排查

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `InvalidAuthentication` | Key 错误或过期 | 重新生成 Key |
| `InsufficientQuota` | 账户余额不足 | 充值 |
| `RateLimitExceeded` | 请求太快 | 添加延迟或升级套餐 |
| `Model not found` | 模型名写错 | 检查 API 文档中的可用模型 |
| `ConnectionError` | 网络问题 | 检查代理/VPN 设置 |

---

*下节课：[第 6 课：项目结构规划](lesson-6.md)*
