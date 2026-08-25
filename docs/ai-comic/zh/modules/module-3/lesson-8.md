# 第 8 课：用 AI 辅助写剧本

> 📌 **学习目标**：掌握用 LLM 生成高质量漫剧剧本的 Prompt 技巧，学会迭代优化
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：Prompt 设计 → 实战生成 → 人工精修 → 迭代技巧

---

## 一、让 AI 写剧本的核心思路

AI 写剧本最大的问题不是"写不出来"，而是**格式失控**和**缺乏结构感**。

解决方案：**用 Prompt 把规则说死，把创意留给 AI。**

---

## 二、结构化 Prompt 模板

### 基础版（快速出稿）

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

def write_script(topic: str, episodes: int = 1, style: str = "悬疑") -> str:
    prompt = f"""你是一位专业的AI漫剧编剧，擅长创作短小精悍的悬疑故事。

【任务】
为主题"{topic}"创作{episodes}集漫剧剧本，风格：{style}

【输出格式——必须严格遵守】

【第{{N}}集：{{集标题}}】

【场景 {{序号}} - {{地点·时间·光线}}】
镜头角度：{{特写/近景/中景/全景/俯拍/仰拍/过肩}}
画面描述：{{具体的视觉描述，包含环境、人物动作、光线细节}}
角色：{{角色名}}
情绪：{{疲惫/震惊/恐惧/平静/愤怒/兴奋/悲伤/神秘}}
对话/旁白："[台词内容]"
动作：{{角色动作描述，可选}}

【剧本要求】
1. 每集 15-25 个镜头
2. 开场 3 个镜头内必须有钩子（悬念/冲突/意外）
3. 每个镜头的画面描述必须具体可绘制（不要写抽象情绪）
4. 对话简短有力，每句不超过 20 字
5. 每集结尾留悬念
6. 不使用任何格式标记，严格按上面的格式输出
7. 使用中文

现在开始创作："""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.85,
        max_tokens=4000
    )
    return response.choices[0].message.content
```

### 进阶版（先大纲再细写）

质量更高的做法是**分两步**：先生成大纲，再展开详细剧本。

```python
def write_script_in_two_steps(topic: str, style: str = "悬疑") -> str:
    # 第一步：生成故事大纲
    outline_prompt = f"""为主题"{topic}"生成漫剧故事大纲，风格：{style}。
要求：
1. 3 个主要角色（主角、配角、反派/对手）
2. 每集的核心冲突和转折
3. 每集结尾的悬念钩子
4. 控制在 3 集以内

只输出大纲，不要写具体剧本。"""

    outline = call_llm(outline_prompt, temperature=0.7)

    # 第二步：基于大纲生成详细剧本
    script_prompt = f"""基于以下大纲生成完整剧本，严格按照格式输出：

【大纲】
{outline}

【格式要求】（同上，省略重复部分）

开始生成："""

    return call_llm(script_prompt, temperature=0.85)
```

**分步的优势：**
- 大纲阶段可以人工介入调整故事走向
- 细写阶段 LLM 有明确的框架约束，不会跑偏
- 如果大纲不满意，只需重生成大纲，不用重跑全部剧本

---

## 三、Prompt Engineering 核心技巧

### 技巧 1：负面约束比正面指令更有效

```python
# ❌ 差：模糊的正面指令
"写一个好剧本"

# ✅ 好：明确的负面约束
"不要写超过20字的长对话，不要写抽象的情绪描述，不要用"画面显示"这样的元描述"
```

### 技巧 2：Few-shot 示例引导格式

在 Prompt 中提供一个简短的示例，LLM 会严格模仿格式：

```python
prompt = f"""示例格式：
【场景 1 - 室内·办公室·深夜·灯光】
镜头角度：中景
画面描述：日光灯管闪了两下才亮起来，办公室只剩下小李一个人
角色：小李（女，26岁）
情绪：疲惫
旁白："加班到这么晚，只有我和咖啡机作伴。"

---
现在请为主题"{topic}"创作剧本："""
```

### 技巧 3：温度参数控制创意程度

| temperature | 效果 | 适用阶段 |
|-------------|------|---------|
| 0.3 - 0.5 | 稳定、保守、格式规范 | 剧本精修 |
| 0.7 - 0.85 | 有创意但不偏离框架 | 初稿生成 |
| 0.9 - 1.0 | 大胆创新，可能跑偏 | 创意发散 |

### 技巧 4：追问迭代优于重来

第一次生成的剧本通常只有 60 分水平，通过追问可以提升到 85 分：

```python
# 第一轮：生成初稿
script = write_script("程序员深夜加班")

# 第二轮：针对性改进
refine_prompt = f"""以下是生成的剧本：
{script}

请根据以下要求进行修改：
1. 第 3 个镜头的情绪太平淡，改为"震惊"
2. 第 7 个场景的对话太直白，改为更隐晦的表达
3. 在第 12 个镜头加入一个视觉隐喻（比如镜子、倒影等）
4. 结尾悬念不够强，重新设计最后两个镜头

只输出修改后的完整剧本，保持原有格式不变。"""
```

---

## 四、剧本分析：从文本到镜头

LLM 生成的剧本可能格式不完美，需要一个**解析和校验**环节。

### 4.1 解析器

```python
# scripts/extract_shots.py
import re

def parse_script_to_shots(script_text: str) -> list[dict]:
    """
    将剧本文本解析为结构化分镜列表

    容错处理：支持多种冒号格式、支持缺失字段、跳过空行
    """
    shots = []
    current = {}

    for line in script_text.split('\n'):
        line = line.strip()
        if not line:
            continue

        # 场景标题
        m = re.match(r'【场景\s*(\d*)\s*[-—:：]\s*(.+?)】', line)
        if m:
            if current.get('description'):
                shots.append(current)
            current = {'scene': m.group(2).strip()}
            continue

        # 字段提取
        for key in ['镜头角度', '画面描述', '角色', '情绪']:
            m = re.match(rf'{key}\s*[：:]\s*(.+)', line)
            if m:
                field = {
                    '镜头角度': 'angle',
                    '画面描述': 'description',
                    '角色': 'character',
                    '情绪': 'emotion'
                }[key]
                current[field] = m.group(1).strip()
                break
        else:
            # 对话/旁白
            m = re.match(r'(对话|旁白)\s*[：:""]*\s*(.+?)\s*["""]?\s*$', line)
            if m:
                current['dialogue'] = m.group(2).strip()
                current['type'] = 'narration' if m.group(1) == '旁白' else 'dialogue'

    if current.get('description'):
        shots.append(current)

    return shots
```

### 4.2 剧本质量校验

```python
def validate_script(shots: list[dict]) -> list[str]:
    """检查剧本质量问题"""
    issues = []
    for i, shot in enumerate(shots):
        # 检查必填字段
        for field in ['scene', 'description', 'character', 'emotion']:
            if not shot.get(field):
                issues.append(f"镜头 {i+1}: 缺少【{field}】字段")

        # 检查对话长度
        dialogue = shot.get('dialogue', '')
        if len(dialogue) > 30:
            issues.append(f"镜头 {i+1}: 对话过长（{len(dialogue)}字），建议不超过20字")

        # 检查画面描述是否太抽象
        abstract_words = ['感觉', '似乎', '好像', '可能', '大概']
        desc = shot.get('description', '')
        if any(w in desc for w in abstract_words) and len(desc) < 15:
            issues.append(f"镜头 {i+1}: 画面描述过于抽象，请添加具体视觉元素")

    return issues
```

### 4.3 自动修复建议

```python
def suggest_fixes(issues: list[str], shots: list[dict]) -> str:
    """生成修复建议，供 LLM 迭代时使用"""
    if not issues:
        return None
    return f"剧本存在以下问题需要修复：\n" + "\n".join(f"- {i}" for i in issues[:10])
```

---

## 五、实战：从零到剧本

### Step 1：一句话创意

> 主题：**一个外卖员在暴雨夜送错地址，误入了一栋根本不存在的老楼**

### Step 2：运行生成

```python
script = write_script(
    topic="外卖员暴雨夜送错地址误入不存在的老楼",
    episodes=1,
    style="悬疑"
)
print(script)
```

### Step 3：解析校验

```python
shots = parse_script_to_shots(script)
issues = validate_script(shots)
if issues:
    print("发现以下问题：")
    for issue in issues:
        print(f"  ⚠️  {issue}")
    # 生成修复指令
    fix = suggest_fixes(issues, shots)
    if fix:
        refined = refine_script(script, fix)
        print("\n已自动修复，重新生成剧本...")
```

### Step 4：人工微调

AI 生成的剧本通常 70-80 分，值得人工调整的地方：

- 开头钩子是否足够抓人
- 角色对话是否贴合性格
- 悬念设置是否合理
- 某些镜头的画面描述是否太泛

---

## 六、常见质量问题及修正

| 问题 | 表现 | 修正方法 |
|------|------|---------|
| 对话太长 | 单句超过 30 字 | 拆分短句，添加动作打断 |
| 画面太抽象 | "感觉很害怕" | 改为具体描述"手在发抖，呼吸急促" |
| 缺乏镜头感 | 只有场景没有角度 | 追问："这个场景用什么镜头角度更好？" |
| 转折生硬 | 情节跳跃 | 添加过渡镜头，建立因果链 |
| 角色混淆 | 不同角色说同样的话 | 为每个角色定义独特的说话风格 |

---

## 七、本章小结

写 AI 漫剧剧本的 workflow：

```
创意点子
   │
   ▼
【LLM 生成大纲】──→ 人工审核/调整
   │
   ▼
【LLM 展开详细剧本】──→ 解析校验
   │
   ▼
【发现问题】──→ 追问 LLM 修复
   │
   ▼
【人工精修】──→ 最终剧本
```

记住：**LLM 是强大的草稿撰写者，但你是最终的导演。** 它提供框架和素材，你负责把控叙事节奏和创意方向。

---

*下节课：[第 9 课：分镜脚本解析](lesson-9.md)*
