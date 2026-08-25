# 第 11 课：Prompt 工程技巧

> 📌 **学习目标**：掌握图像生成 Prompt 的构建公式和迭代优化方法
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：Prompt 公式 → 关键词库 → 实战演练 → 迭代方法

---

## 一、Prompt 构建公式

一张好的分镜画面 Prompt = **7 个组成部分**的有机组合：

```
[画风] + [场景环境] + [角色描述] + [镜头角度] + [情绪表情] + [光影氛围] + [质量词]
```

### 1.1 画风（Style）

决定整体视觉风格，放在最前面。

| 风格 | Prompt 关键词 |
|------|--------------|
| 日本动漫 | `anime style, cel shaded, vibrant colors, manga art` |
| 欧美漫画 | `western comic book style, bold ink lines, halftone dots` |
| 水彩 | `watercolor painting, soft edges, dreamy wash, artistic` |
| 写实 | `realistic illustration, photographic quality, detailed rendering` |
| 赛博朋克 | `cyberpunk aesthetic, neon lights, rainy night, futuristic` |
| 黑色电影 | `film noir, high contrast black and white, dramatic shadows` |

### 1.2 场景环境（Setting）

描述画面中的环境和背景元素。

```
a dimly lit apartment at night, rain against the window,
empty instant noodle cups on the desk,
blue glow from computer monitor illuminating the room
```

### 1.3 角色描述（Character）

**关键**：每次都要带上角色的核心特征，不能省略。

```
28-year-old Asian male programmer named Chen Mo,
short messy black hair, black rectangular glasses,
grey hooded sweatshirt, slim build,
tired eyes with dark circles under them
```

### 1.4 镜头角度（Camera Angle）

| 角度 | 英文表达 |
|------|---------|
| 特写 | `extreme close-up, focusing on face details` |
| 近景 | `medium close-up, shoulder and above` |
| 中景 | `medium shot, waist up` |
| 全景 | `wide shot, full body and surroundings` |
| 俯拍 | `overhead shot, bird's eye view` |
| 仰拍 | `low angle shot, looking up` |
| 过肩 | `over-the-shoulder shot` |

### 1.5 情绪表情（Emotion）

```
exhausted expression, rubbing eyes, slumped posture
shocked expression, wide eyes, jaw dropped
terrified, trembling hands, pale face
calm and collected, gentle smile, relaxed shoulders
```

### 1.6 光影氛围（Lighting）

| 氛围 | 英文表达 |
|------|---------|
| 悬疑紧张 | `dramatic chiaroscuro lighting, deep shadows` |
| 温暖回忆 | `warm golden hour light, soft glow` |
| 科技感 | `neon reflections, cool blue tones, digital glow` |
| 恐怖压抑 | `ominous low-key lighting, single light source` |
| 梦幻 | `ethereal backlighting, lens flare, soft focus` |

### 1.7 质量词（Quality）

统一放在末尾：

```
high quality, detailed illustration, cinematic composition,
professional concept art, 4k resolution
No text, no watermark, no subtitles, no logos
```

---

## 二、完整 Prompt 示例

### 示例 1：疲惫的程序员

```
anime comic panel,
A dimly lit apartment at night, rain streaking against the window,
empty instant noodle cups scattered on the cluttered desk,
28-year-old Asian male programmer Chen Mo sitting at the desk,
wearing grey hoodie and black glasses, messy black hair,
medium shot, exhausted expression with dark circles under eyes,
Blue monitor glow illuminating his tired face, warm lamp in background,
high quality, detailed anime illustration, cinematic composition,
No text, no watermark, no subtitles
```

### 示例 2：震惊反应

```
anime comic panel,
Dark room illuminated only by a flickering computer screen,
Extreme close-up of Chen Mo's face,
eyes wide with shock, mouth slightly open, reflection of text on glasses,
Chen Mo's hand trembling near the keyboard,
Dramatic blue backlighting from screen, deep shadows around,
high quality anime art, emotional intensity,
No text, no watermark
```

### 示例 3：悬念结尾

```
anime comic panel,
Interior of a dark apartment, door slowly creaking open,
Wide shot from inside the room looking toward the doorway,
Silhouette of a tall figure standing in the threshold,
moonlight from hallway creating a dramatic rim light around the figure,
High contrast noir lighting, mysterious atmosphere,
high quality, suspenseful mood, cinematic framing,
No text, no watermark
```

---

## 三、Prompt 自动构建器

```python
# scripts/prompt_builder.py

SHOT_ANGLES = {
    "特写": "extreme close-up, focusing on face details",
    "近景": "medium close-up, shoulder and above",
    "中景": "medium shot, waist up",
    "全景": "wide shot, full body and surroundings",
    "俯拍": "overhead shot, bird's eye view",
    "仰拍": "low angle shot, looking up",
    "过肩": "over-the-shoulder shot",
}

EMOTION_EXPRESSIONS = {
    "疲惫": "exhausted expression, dark circles under eyes, slouched posture",
    "震惊": "shocked expression, wide eyes, jaw slightly dropped",
    "恐惧": "terrified expression, fearful eyes, tense trembling posture",
    "平静": "calm expression, relaxed features, neutral face",
    "愤怒": "angry expression, furrowed brows, intense piercing gaze",
    "兴奋": "excited expression, bright eyes, energetic posture",
    "悲伤": "sad expression, downcast eyes, slumped shoulders",
    "神秘": "mysterious expression, slight enigmatic smile, half in shadow",
}

LIGHTING_MOODS = {
    "深夜": "night scene, moonlight, deep shadows, cool blue tones",
    "月光": "moonlight streaming through window, silver glow",
    "霓虹": "neon lights, colorful reflections, urban night atmosphere",
    "昏暗": "dimly lit, single light source, heavy shadows",
    "明亮": "bright natural lighting, soft and even",
    "紧张": "dramatic high-contrast lighting, ominous atmosphere",
}

QUALITY_SUFFIX = "high quality, detailed illustration, cinematic composition, professional concept art, No text, no watermark, no subtitles"


def build_prompt(shot: dict, character_desc: str, style: str = "anime") -> str:
    """
    根据分镜数据自动构建完整的图像生成 Prompt

    参数:
        shot: 解析后的分镜字典
        character_desc: 角色详细描述
        style: 画风

    返回:
        可直接提交给 API 的完整 Prompt 字符串
    """
    parts = [f"{style} comic panel"]

    # 场景环境
    scene = shot.get('scene', '')
    lighting_key = scene.split('·')[-1] if '·' in scene else '昏暗'
    lighting = LIGHTING_MOODS.get(lighting_key, LIGHTING_MOODS["昏暗"])
    parts.append(lighting)

    # 画面描述
    parts.append(shot.get('description', ''))

    # 角色
    parts.append(character_desc)

    # 镜头角度
    angle_cn = shot.get('angle', '中景')
    angle_en = SHOT_ANGLES.get(angle_cn, SHOT_ANGLES["中景"])
    parts.append(angle_en)

    # 情绪
    emotion_cn = shot.get('emotion', '平静')
    emotion_en = EMOTION_EXPRESSIONS.get(emotion_cn, EMOTION_EXPRESSIONS["平静"])
    parts.append(emotion_en)

    # 质量词
    parts.append(QUALITY_SUFFIX)

    return ", ".join(parts)
```

---

## 四、Prompt 迭代优化

### 4.1 从失败案例中学习

生成结果不理想时，分析问题所在：

| 问题 | 原因 | 修正 |
|------|------|------|
| 画面太暗看不清人物 | 光影描述过于强调阴影 | 在光影部分加入 `character clearly visible` |
| 角色和参考图不像 | 缺少关键特征描述 | 在角色部分补充更多细节 |
| 构图太满/太空 | 缺少镜头角度关键词 | 明确指定 `medium shot` 或 `wide shot` |
| 出现文字/水印 | 模型幻觉 | 加强负面提示词 `No text, no watermark` |
| 人物变形/多余肢体 | Prompt 过于复杂 | 简化描述，一次只说清楚一件事 |

### 4.2 A/B 测试

对关键镜头，生成多个版本对比：

```python
def generate_multiple_variants(prompt: str, n: int = 4) -> list[str]:
    """生成多个变体，选择最好的"""
    response = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1080x1920",
        n=n
    )
    return [item.url for item in response.data]
```

### 4.3 建立个人 Prompt 库

随着生成次数增加，积累一套经过验证的 Prompt 模板：

```python
# prompts/templates.py

ROMANTIC_SCENE = """
soft warm lighting, golden hour glow,
{description},
{character_desc},
medium close-up, {emotion},
romantic atmosphere, dreamy bokeh background,
{quality}
"""

HORROR_SCENE = """
ominous low-key lighting, single flickering light source,
{description},
{character_desc},
{camera_angle},
{emotion},
deep shadows, high contrast, unsettling mood,
{quality}
"""
```

---

## 五、本章小结

Prompt 工程的核心心法：

1. **公式化**：用固定的 7 段结构保证完整性
2. **一致性**：角色描述和风格词每次不变
3. **具体化**：用可视化的细节代替抽象概念
4. **迭代化**：不满意就改 Prompt，不要将就

记住：**好的 Prompt 不是一次写出来的，是一步步调出来的。**

---

*下节课：[第 12 课：批量生成分镜画面](lesson-12.md)*
