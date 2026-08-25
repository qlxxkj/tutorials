# 第 10 课：角色设定与参考图

> 📌 **学习目标**：理解角色一致性的核心难点，掌握参考图生成和复用的完整方法
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：一致性难题 → 参考图策略 → Prompt 设计 → 代码实现

---

## 一、最大的技术挑战：角色一致性

AI 漫剧有个"阿喀琉斯之踵"：**让同一个角色在 20 张图里长得一样。**

你生成了 20 个绝美的分镜画面，播放时发现——
- 第 1 集的男主是黑发，第 3 集突然变金发了
- 女主的眼镜在第 5 张图里有，第 8 张图里没了
- 连衣服颜色都不一样

这不是你的 Prompt 写得不够好，而是**图像生成模型本质上每次都是"重新画一张"**，它没有记忆。

---

## 二、角色一致性的三种策略

### 策略 A：固定 Seed（最简单，效果有限）

```python
response = client.images.generate(
    model="gpt-image-1",
    prompt="一个黑发戴眼镜的年轻男性程序员...",
    seed=42,  # 固定随机种子
    n=1
)
```

**效果**：相同 Prompt + 相同 Seed → 构图相似，但面部细节会有变化。
**适用**：角色特征简单、对一致性要求不高的场景。

---

### 策略 B：角色参考图（推荐）⭐

**核心思路**：先生成一张高质量的"角色身份证"，后续所有画面都参考这张图。

```
角色参考图 ──→ 每次生成分镜时作为 image reference 传入
     ↑
  GPT-Image-1 生成（精心设计 Prompt）
```

**关键操作**：在每次生成分镜画面的 Prompt 中，都带上角色的核心特征描述，并且传入参考图。

```python
def build_shot_prompt(shot, character_ref_image):
    return f"""
    Anime comic panel style,
    Scene: {shot['scene']},
    Character: {character_ref_image},
    {shot['description']},
    {shot['angle']},
    Emotion: {shot['emotion']},
    Cinematic lighting,
    High quality detailed illustration,
    No text, no watermark
    """.strip()
```

**效果**：角色脸型、发型、服装保持 80-90% 一致，细节允许自然变化。
**适用**：绝大多数 AI 漫剧项目。

---

### 策略 C：ComfyUI + IP-Adapter（最强，本地部署）⭐⭐

如果你有本地 GPU，这是角色一致性的终极方案。

```
角色参考图
     │
     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│  IP-Adapter   │───→│   Flux / Z-image   │───→│  分镜画面     │
│  FaceID Plus  │    │   + ControlNet     │    │  (高一致性)   │
└──────────────┘    └──────────────────┘    └──────────────┘
      ↑                      ↑
  保证脸部一致           保证构图/姿势可控
```

**效果**：角色一致性可达 95% 以上。
**缺点**：需要 RTX 3060 8GB+，部署耗时 1-2 小时。

---

## 三、角色参考图的 Prompt 设计

参考图的质量直接决定后续一致性效果。一个优秀的角色参考图应该：

### 3.1 必备要素

| 要素 | 说明 | 示例 |
|------|------|------|
| **正面全身** | 展示完整形象 | 正面站立，双脚可见 |
| **中性表情** | 不要夸张情绪 | 自然微笑或中性脸 |
| **干净背景** | 避免干扰 | 白色或纯色背景 |
| **多视角**（可选） | 正面+侧面 | 方便后续多角度复用 |
| **服装细节清晰** | 每件衣服都要看得清 | 颜色、款式、配饰 |

### 3.2 Prompt 模板

```
Character design reference sheet,
{外貌描述},
{风格} style,
Clean white background,
Full body front view,
Professional illustration,
Consistent character design,
High quality, detailed,
No text, no watermark
```

**外貌描述模板**：
```
25-year-old Asian male, short messy black hair,
wearing black rectangular glasses,
grey hooded sweatshirt with a small logo on chest,
slim build, average height,
tired eyes with slight dark circles,
neutral expression facing forward
```

### 3.3 完整生成代码

```python
# scripts/create_characters.py
import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

STYLE_KEYWORDS = {
    "anime": "anime style, cel shaded, vibrant colors, manga art",
    "comic": "western comic book style, bold lines, graphic novel",
    "realistic": "realistic illustration, photographic quality, detailed"
}


def create_character_reference(
    name: str,
    appearance: str,
    style: str = "anime",
    output_dir: str = "assets/characters/"
) -> dict:
    """
    生成角色参考图

    参数:
        name: 角色名
        appearance: 详细外貌描述（英文效果更佳）
        style: 画风
        output_dir: 输出目录

    返回:
        {"path": "assets/characters/hero.png", "prompt": "..."}
    """
    os.makedirs(output_dir, exist_ok=True)
    style_kw = STYLE_KEYWORDS.get(style, STYLE_KEYWORDS["anime"])

    prompt = f"""
    Character design reference sheet,
    {appearance},
    {style_kw},
    Clean white background,
    Full body front view,
    Professional illustration,
    Consistent character design,
    High quality detailed,
    No text, no watermark
    """.strip()

    response = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1024x1024",
        n=1
    )

    filename = f"{output_dir}{name}.png"
    img_data = requests.get(response.data[0].url).content
    with open(filename, "wb") as f:
        f.write(img_data)

    return {"path": filename, "prompt": prompt}
```

---

## 四、多角色管理

一部漫剧通常有 2-5 个主要角色。建议建立角色档案：

```python
# config/characters.py
CHARACTERS = {
    "陈默": {
        "appearance": "28-year-old Asian male programmer, short messy black hair, "
                     "black rectangular glasses, grey hoodie, slim build, "
                     "tired eyes with dark circles, sharp features",
        "voice": "alloy",          # TTS 音色
        "personality": "quiet, observant, slightly anxious"
    },
    "林夏": {
        "appearance": "22-year-old Asian female, shoulder-length brown wavy hair, "
                     "round face with dimples when smiling, wearing oversized sweater "
                     "and denim skirt, carrying a canvas bag",
        "voice": "nova",
        "personality": "cheerful, curious, empathetic"
    },
    "神秘人": {
        "appearance": "tall slender figure, long black coat, face mostly in shadow, "
                     "only the lower face visible, indeterminate age and gender",
        "voice": "onyx",
        "personality": "enigmatic, calm, unsettling"
    }
}
```

使用时：
```python
from config.characters import CHARACTERS

for char_name, char_config in CHARACTERS.items():
    ref = create_character_reference(char_name, char_config["appearance"], "anime")
    print(f"✓ {char_name}: {ref['path']}")
```

---

## 五、一致性增强技巧

### 5.1 在分镜 Prompt 中重复关键特征

```python
def build_shot_prompt(shot, character_name, characters):
    char_info = characters.get(character_name, {})
    key_features = char_info.get("appearance", "")

    prompt = f"""
    Anime comic panel,
    {shot['description']},
    Character: {key_features},
    {shot['angle']},
    Emotion: {shot['emotion']},
    Cinematic lighting, dramatic composition,
    High quality anime art,
    No text, no watermark
    """.strip()
    return prompt
```

**原理**：每次生成都重复角色的核心特征，相当于不断提醒模型"这是同一个人"。

### 5.2 使用固定 Seed

```python
import hashlib

def get_character_seed(name: str) -> int:
    """为每个角色分配一个固定 seed"""
    return int(hashlib.md5(name.encode()).hexdigest()[:8], 16) % (2**31)

# 使用
seed = get_character_seed("陈默")  # 固定值，每次相同
```

### 5.3 负面提示词

在 Prompt 末尾排除常见不一致因素：

```
..., No text, no watermark, no subtitles,
different hair color, different clothes, different face, blurry
```

---

## 六、本章小结

| 策略 | 一致性 | 成本 | 难度 | 推荐度 |
|------|--------|------|------|--------|
| 固定 Seed | ★★★ | 低 | 极低 | ⭐⭐ |
| 角色参考图 | ★★★★ | 中 | 低 | ⭐⭐⭐⭐⭐ |
| IP-Adapter | ★★★★★ | 免费（本地） | 高 | ⭐⭐⭐⭐ |

**最佳实践**：先用参考图策略跑通全流程，确认效果满意后，再考虑升级到本地方案。

---

*下节课：[第 11 课：Prompt 工程技巧](lesson-11.md)*
