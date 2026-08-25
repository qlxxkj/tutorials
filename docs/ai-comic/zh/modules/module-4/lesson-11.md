# 第 11 课：Prompt 工程技巧

> 📌 **学习目标**：掌握图像生成 Prompt 的构建方法和优化技巧
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：Prompt 公式 → 实战演练 → 优化迭代

---

## 一、Prompt 构建公式

生成分镜画面的 Prompt 有一个通用公式：

```
[画风] + [场景描述] + [角色描述] + [镜头角度] + [情绪/表情] + [光影] + [质量词]
```

### 各部分详解

| 部分 | 作用 | 示例 |
|------|------|------|
| **画风** | 决定整体视觉风格 | `anime style`, `comic panel`, `watercolor` |
| **场景描述** | 画面环境和背景 | `dimly lit office at night`, `rainy street` |
| **角色描述** | 角色状态和动作 | `xiaoming sitting at desk`, `looking at screen` |
| **镜头角度** | 构图方式 | `medium shot`, `close-up`, `over the shoulder` |
| **情绪/表情** | 角色面部表情 | `tired expression`, `shocked face` |
| **光影** | 光线氛围 | `dramatic lighting`, `neon glow`, `soft morning light` |
| **质量词** | 提升出图质量 | `high quality`, `detailed`, `cinematic` |

---

## 二、完整 Prompt 示例

### 示例 1：疲惫的程序员

```
anime comic panel,
A dimly lit apartment at night, rain against the window,
25-year-old Asian male programmer sitting at a desk,
wearing grey hoodie, black glasses, messy black hair,
medium shot, tired expression, rubbing eyes,
Blue glow from computer monitor, warm lamp light,
high quality, detailed illustration, cinematic composition
```

### 示例 2：震惊的反应

```
anime comic panel,
Dark room illuminated only by a glowing computer screen,
Close-up of a young man's face,
wide eyes, mouth slightly open in shock,
extreme close-up,
Dramatic blue backlighting from screen,
high quality anime art, emotional expression
```

### 示例 3：悬念结尾

```
anime comic panel,
Door slowly opening in darkness,
Silhouette of a figure standing in the doorway,
mysterious atmosphere,
Wide shot from inside the room,
Chiaroscuro lighting, deep shadows,
high quality, suspenseful mood, film noir aesthetic
```

---

## 三、Prompt 模板库

### 镜头角度模板

```python
SHOT_ANGLES = {
    "close-up": "extreme close-up, focusing on face details",
    "medium": "medium shot, waist up, upper body visible",
    "wide": "wide shot, full body and surroundings",
    "detail": "extreme detail shot, close-up on specific object",
    "over-shoulder": "over-the-shoulder shot, seeing over one person's shoulder",
    "aerial": "aerial view, bird's eye perspective",
    "low-angle": "low angle shot, looking up at subject",
    "two-shot": "two people in frame, medium distance",
}
```

### 情绪关键词模板

```python
EMOTION_EXPRESSIONS = {
    "疲惫": "tired expression, dark circles under eyes, slouched posture",
    "震惊": "shocked expression, wide eyes, jaw dropped",
    "恐惧": "terrified expression, fearful eyes, tense posture",
    "平静": "calm expression, relaxed features, neutral face",
    "愤怒": "angry expression, furrowed brows, intense gaze",
    "兴奋": "excited expression, bright eyes, energetic posture",
    "悲伤": "sad expression, downcast eyes, tears welling up",
    "神秘": "mysterious expression, slight enigmatic smile",
    "困惑": "confused expression, tilted head, squinting eyes",
}
```

### 光影氛围模板

```python
LIGHTING_MOODS = {
    "夜景": "night scene, moonlight, deep shadows",
    "霓虹": "neon lights, colorful reflections, urban night",
    "温馨": "warm lighting, soft glow, cozy atmosphere",
    "恐怖": "ominous lighting, high contrast, flickering",
    "梦幻": "dreamy lighting, soft focus, ethereal glow",
    "紧张": "tense lighting, harsh shadows, dramatic contrast",
}
```

---

## 四、自动构建 Prompt 的代码

```python
# scripts/generate_shots.py 中的核心逻辑

def build_shot_prompt(
    shot: dict,
    character_name: str,
    character_description: str,
    style: str = "anime"
) -> str:
    """
    根据分镜数据自动构建图像生成 Prompt

    参数:
        shot: 分镜字典（含 description, angle, emotion 等）
        character_name: 角色名
        character_description: 角色详细描述

    返回:
        完整的英文 Prompt 字符串
    """
    # 提取字段
    scene = shot.get("scene", "")
    angle = shot.get("angle", "medium")
    description = shot.get("description", "")
    emotion = shot.get("emotion", "平静")
    dialogue = shot.get("dialogue", "")

    # 查找关键词映射
    angle_kw = SHOT_ANGLES.get(angle, SHOT_ANGLES["medium"])
    emotion_kw = EMOTION_EXPRESSIONS.get(emotion, EMOTION_EXPRESSIONS["平静"])
    lighting_kw = LIGHTING_MOODS.get(scene.split("·")[2] if "·" in scene else "", LIGHTING_MOODS["夜景"])

    # 组装 Prompt
    parts = [
        f"{style} comic panel,",
        f"{description},",
        f"{character_description},",
        f"{angle_kw},",
        f"{emotion_kw},",
        f"{lighting_kw},",
        "high quality, detailed illustration, cinematic composition",
        "No text, no watermark, no subtitles"
    ]

    return ", ".join(parts)
```

---

## 五、Prompt 优化迭代

### 迭代 1：基础版本

```
anime style, a man sitting at a desk, medium shot
```

**结果**：人物位置不对，缺少氛围。

### 迭代 2：增加细节

```
anime comic panel, a man sitting at a desk in a dimly lit room at night,
wearing a grey hoodie, medium shot, tired expression,
blue monitor light, high quality
```

**结果**：好多了，但人物不够突出。

### 迭代 3：优化构图

```
anime comic panel,
A dimly lit apartment at night, rain against the window,
25-year-old Asian male programmer in grey hoodie,
sitting at desk looking at glowing computer screen,
medium close-up shot, exhausted expression with dark circles,
Blue monitor glow illuminating his face, warm desk lamp in background,
high quality anime art, detailed illustration, cinematic lighting
```

**结果**：质量显著提升，适合直接使用。

---

## 六、负面提示词

虽然 GPT-Image-1 不直接支持负面提示词，但可以在 Prompt 末尾添加排除项：

```
..., No text, no watermark, no subtitles, no logos, no extra limbs, good anatomy
```

---

## 七、批量生成时的 Prompt 变化

同一角色在不同分镜中，Prompt 的变化应该只涉及：
- 场景描述（场景变化）
- 镜头角度（构图变化）
- 情绪表达（表情变化）
- 动作描述（姿态变化）

**保持不变的部分**：
- 画风
- 角色核心特征描述
- 质量词

---

## 八、本章小结

| 技巧 | 说明 |
|------|------|
| 固定公式 | 画风 + 场景 + 角色 + 镜头 + 情绪 + 光影 + 质量 |
| 模板复用 | 建立自己的 Prompt 模板库 |
| 迭代优化 | 先生成 → 观察 → 调整 → 再���成 |
| 关键不变 | 角色描述和质量词保持固定 |

---

*下节课：[第 12 课：批量生成分镜画面](lesson-12.md)*
