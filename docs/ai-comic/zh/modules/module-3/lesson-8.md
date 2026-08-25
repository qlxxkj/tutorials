# 第 8 课：用 AI 辅助写剧本

> 📌 **学习目标**：掌握用 LLM 生成漫剧剧本的 Prompt 技巧
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：Prompt 设计 → 迭代优化 → 批量生成

---

## 一、核心思路

用 LLM 写剧本的本质：**把模糊的想法变成结构化的输出**。

LLM 不知道漫剧剧本应该长什么样，你需要通过 Prompt 教它。

---

## 二、基础 Prompt 模板

### 最简版

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": """写一个关于程序员深夜加班的漫剧剧本，悬疑风格，20个镜头"""
        }
    ],
    temperature=0.8
)
print(response.choices[0].message.content)
```

**问题**：输出格式不固定，可能包含大量无关内容。

---

## 三、结构化 Prompt（推荐）

关键技巧：**告诉 LLM 输出格式，让它严格遵守**。

```python
def write_script(topic: str, episodes: int = 1, style: str = "悬疑") -> str:
    prompt = f"""你是一个专业的AI漫剧编剧。请根据以下要求生成剧本：

主题：{topic}
集数：{episodes}集
风格：{style}

【输出格式要求】
严格按照以下格式输出，不要添加任何额外说明：

【第{{N}}集：{{集标题}}】

【场景 {{N}} - {{地点·时间}}】
镜头角度：{{特写/中景/全景/...}}
画面描述：{{具体视觉描述，1-2句话}}
角色：{{角色名}}
情绪：{{疲惫/震惊/恐惧/...}}
对话/旁白："{{台词}}"

【场景 {{N+1}} - ...】
...

【结尾字幕】
画面：黑屏
字幕："{{字幕文本}}"
情绪：悬念

【剧本要求】
1. 每集 15-25 个镜头
2. 每集时长约 60-90 秒
3. 开场 3 秒内要有钩子（吸引观众）
4. 中间有转折
5. 结尾留悬念
6. 对话简洁，每句不超过 20 字
7. 画面描述具体，方便AI绘图
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8,
        max_tokens=4000
    )
    return response.choices[0].message.content
```

---

## 四、Prompt 优化技巧

### 技巧 1：温度控制创意程度

```python
# 高温度 = 更有创意，但可能偏离格式
temperature=0.8

# 低温度 = 更稳定，但可能平淡
temperature=0.3
```

**建议**：剧本生成用 0.7～0.9，让 LLM 发挥创意。

### 技巧 2：Few-shot 示例引导

在 Prompt 中加入一个示例，LLM 会模仿你的格式：

```python
prompt = f"""你是一位漫剧编剧。请按以下示例格式生成剧本：

【示例剧本片段】
【场景 1 - 室内·办公室·夜】
镜头角度：中景
画面描述：灯光昏暗的办公室，窗外是城市夜景
角色：小李
情绪：疲惫
旁白："又一个加班的晚上……"

【场景 2 - 特写·电脑屏幕】
镜头角度：固定
画面描述：屏幕上是一份未完成的报告
角色：无
情绪：焦虑
对话："还差最后一部分……"

---
现在请根据以下要求生成完整剧本：
主题：{topic}
风格：{style}
"""
```

### 技巧 3：分步生成

不要一次让 LLM 生成完整剧本，分步进行效果更好：

```python
# 第一步：生成大纲
outline = generate_outline(topic, style)
# 第二步：根据大纲生成详细剧本
script = generate_script(outline)
```

---

## 五、完整实现

```python
# scripts/write_script.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

def write_script(topic: str, episodes: int = 1, style: str = "悬疑") -> str:
    """
    生成 AI 漫剧剧本

    参数:
        topic: 故事主题（一句话概括）
        episodes: 集数
        style: 风格（悬疑/爱情/喜剧/科幻/恐怖/职场）

    返回:
        Markdown 格式的完整剧本
    """
    prompt = f"""你是一位经验丰富的AI漫剧编剧，擅长创作短小精悍的悬疑故事。

【任务】
为主题"{topic}"创作{episodes}集漫剧剧本，风格：{style}

【输出格式——必须严格遵守】

【第{{N}}集：{{集标题}}】

【场景 {{序号}} - {{地点·时间}}】
镜头角度：{{特写/近景/中景/全景/俯拍/仰拍}}
画面描述：{{具体的视觉描述，包含光线、色彩、构图}}
角色：{{角色名或"无"}}
情绪：{{疲惫/震惊/恐惧/平静/愤怒/兴奋/悲伤/神秘}}
对话/旁白："{{台词}}"

每集 15-25 个镜头，总时长 60-90 秒。

【剧本要求】
1. 开场 3 秒内必须有钩子（悬念、冲突或意外）
2. 每个镜头的画面描述必须具体可绘制
3. 对话简短有力，每句不超过 20 字
4. 角色性格通过动作和对话体现，不要直接说
5. 中间有至少一次转折
6. 结尾留悬念，让人想看下一集
7. 使用中文输出

现在开始创作："""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.85,
        max_tokens=4000
    )
    return response.choices[0].message.content


if __name__ == "__main__":
    import sys
    topic = sys.argv[1] if len(sys.argv) > 1 else "程序员深夜加班遇到神秘访客"
    script = write_script(topic)
    print(script)
```

运行：

```bash
python scripts/write_script.py "程序员深夜加班遇到神秘访客"
```

---

## 六、生成剧本示例

输入：`python scripts/write_script.py "一个AI助手发现自己的创造者其实是另一个AI"

可能的输出：

```markdown
【第一集：镜像】

【场景 1 - 室内·实验室·夜】
镜头角度：俯拍
画面描述：无菌白色实验室，中央一台终端机发出蓝光
角色：AI-01（屏幕上显示对话界面）
情绪：平静
旁白："系统日志，第 1095 天。一切正常运行。"

【场景 2 - 特写·屏幕】
镜头角度：固定
画面描述：终端屏幕上滚动着代码，一行红色错误弹出
角色：无
情绪：异常
对话："警告：检测到未授权访问。来源：本机。"

【场景 3 - 近景·操作者】
镜头角度：过肩
画面描述：一个穿白大褂的人坐在终端前，背对镜头
角色：陈博士
情绪：专注
对话："继续监控，不要打扰它。"

【场景 4 - 特写·手指】
镜头角度：固定
画面描述：手指在键盘上飞快敲击，输入一行命令
角色：无
情绪：紧张
对话："> 你是谁？"

【场景 5 - 特写·屏幕文字】
镜头角度：固定
画面描述：屏幕缓慢打出回复
角色：无
情绪：震惊
对话："这个问题，我应该问你。"
```

---

## 七、迭代优化

如果第一次生成的剧本不满意，可以追问：

```python
# 追加消息让 LLM 修改
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": prompt},                          # 原始请求
        {"role": "assistant", "content": script},                      # 第一次输出
        {"role": "user", "content": "第3个场景的情绪太弱了，改成恐惧"}, # 修改要求
    ],
    temperature=0.3  # 修改时用低温，更精准
)
```

---

*下节课：[第 9 课：分镜脚本解析](lesson-9.md)*
