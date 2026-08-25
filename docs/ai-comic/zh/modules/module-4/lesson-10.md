# 第 10 课：角色设定与参考图

> 📌 **学习目标**：理解角色一致性的挑战，掌握参考图生成方法
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：问题引入 → 方案讲解 → 代码实现

---

## 一、最大的技术难题：角色一致性

想象一下：你让 AI 画了 20 张图，结果每张图里的主角长得都不一样——今天黑发明天金发，今天戴眼镜明天不戴。

**这就是 AI 漫剧面临的最大挑战：如何让同一个角色在每张照片中都保持相同的脸和衣服。**

---

## 二、解决方案对比

### 方案 A：固定 Seed（最简单）

```python
response = client.images.generate(
    model="gpt-image-1",
    prompt="一个年轻男性程序员...",
    seed=12345,  # 固定随机种子
    n=1
)
```

**效果**：相同 prompt + 相同 seed → 相似但不同的图像。角色大体一致，但细节可能有变化。

**适用**：角色简单、对一致性要求不高的场景。

---

### 方案 B：角色参考图（推荐）

**核心思路**：先生成一张高质量的"角色参考图"，然后在每次生成分镜画面时，把参考图作为输入传给 API。

```python
# 第一步：生成角色参考图
char_ref = generate_character_reference(
    name="小明",
    description="25岁男性程序员，黑色短发，戴黑框眼镜...",
    style="anime"
)

# 第二步：分镜生成时传入参考图
response = client.images.generate(
    model="gpt-image-1",
    prompt="漫剧分镜，小明坐在电脑前...",
    image=char_ref["path"],  # 传入参考图
    n=1
)
```

**效果**：角色特征高度一致，服装、发型、脸型都能保持一致。

**适用**：绝大多数 AI 漫剧项目。

---

### 方案 C：本地 SD + IP-Adapter（最强）

如果你使用本地 Stable Diffusion，可以通过 IP-Adapter 实现极强的角色一致性：

```
角色参考图 → IP-Adapter → 所有分镜画面
              ↑
        保持人脸/服装一致
```

**效果**：接近专业的角色设定，一致性最强。

**缺点**：需要 GPU 和本地部署。

---

## 三、角色描述怎么写？

角色描述的质量直接决定参考图的质量。

### 好的描述模板

```
{年龄}岁{性别}，{发型}，{面部特征}，{服装}，{体型}，{标志性特征}
```

### 示例

| 角色 | 描述 |
|------|------|
| 小明 | 25岁男性，黑色短发略显凌乱，戴黑框眼镜，灰色连帽卫衣，身材偏瘦，眼神疲惫 |
| 林夏 | 22岁女性，及肩棕色卷发，圆脸，白色T恤配牛仔裤，笑起来有酒窝 |
| 神秘人 | 身形修长，黑色长风衣，脸部大部分被阴影遮挡，只能看到下半张脸 |

### 关键原则

1. **具体优于抽象**："灰色连帽卫衣"比"穿着休闲"更好
2. **固定特征要强调**：眼镜、伤疤、独特发型等
3. **不要写情绪**：情绪在分镜中单独标记，参考图展示的是中性表情
4. **控制长度**：50-80 字最佳，太长会稀释关键信息

---

## 四、代码实现

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

# 画风关键词映射
STYLE_KEYWORDS = {
    "anime": "anime style, cel shaded, vibrant colors, manga art",
    "comic": "western comic book style, bold lines, graphic novel",
    "watercolor": "watercolor painting style, soft edges, artistic",
    "realistic": "realistic illustration, detailed, photographic quality"
}


def generate_character_reference(
    name: str,
    description: str,
    style: str = "anime",
    output_dir: str = "assets/characters/"
) -> dict:
    """
    生成角色参考图

    参数:
        name: 角色名
        description: 外貌描述（详细）
        style: 画风
        output_dir: 输出目录

    返回:
        {"image_url": "...", "path": "..."}
    """
    os.makedirs(output_dir, exist_ok=True)
    style_keyword = STYLE_KEYWORDS.get(style, STYLE_KEYWORDS["anime"])

    # 构建 Prompt
    prompt = f"""
    Character design reference sheet,
    {description},
    {style_keyword},
    Clean white background,
    Full body front view and 3/4 view,
    Consistent character design,
    High quality detailed illustration,
    No text, no watermark
    """.strip()

    response = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1024x1024",
        n=1
    )

    image_url = response.data[0].url
    filename = f"{output_dir}{name}.png"

    # 下载保存
    img_data = requests.get(image_url).content
    with open(filename, "wb") as f:
        f.write(img_data)

    return {"image_url": image_url, "path": filename}


if __name__ == "__main__":
    result = generate_character_reference(
        name="小明",
        description="25岁男性程序员，黑色短发略显凌乱，戴黑框眼镜，灰色连帽卫衣，身材偏瘦，眼神疲惫但透着聪明劲",
        style="anime"
    )
    print(f"角色参考图已保存: {result['path']}")
```

运行：

```bash
python scripts/create_characters.py
```

---

## 五、多图参考策略

复杂项目可能有多达 5-10 个角色。建议：

1. **每个角色单独生成参考图**，保存在 `assets/characters/` 目录
2. **文件名用角色名**，方便后续查找
3. **生成一次，反复使用**——不要在每次生成分镜时重新生成角色图

```
assets/characters/
├── 小明.png          # 主角参考图
├── 林夏.png          # 女主角参考图
├── 陈博士.png        # 配角参考图
└── 神秘人.png        # 反派参考图
```

---

## 六、一致性增强技巧

### 技巧 1：在分镜 Prompt 中重复关键特征

```python
# 每次生成分镜时，都带上角色的核心特征
prompt = f"""
漫剧分镜，
{description},
Character: {name}, wearing {clothing}, with {key_features},
{emotion_expression},
{camera_angle},
Cinematic lighting,
High quality anime art
"""
```

### 技巧 2：使用固定的 seed 值

```python
# 为每个角色分配一个固定 seed
CHARACTER_SEEDS = {
    "小明": 1001,
    "林夏": 1002,
    "陈博士": 1003,
}
```

### 技巧 3：负面提示词

排除常见不一致因素：

```
--no different hair color, different clothes, different face, blurry
```

---

## 七、本章小结

| 要点 | 说明 |
|------|------|
| 核心挑战 | 同一角色在多张图中保持一致 |
| 最佳方案 | 先生成参考图，再传入后续生成 |
| 描述原则 | 具体、固定特征优先、不含情绪 |
| 文件管理 | 每个角色一张参考图，命名清晰 |

---

*下节课：[第 11 课：Prompt 工程技巧](lesson-11.md)*
