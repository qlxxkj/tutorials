# 第 12 课：批量生成分镜画面

> 📌 **学习目标**：实现高效的批量图像生成，处理 API 限流和错误
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：批量逻辑 → 限流处理 → 错误恢复 → 完整代码

---

## 一、批量生成的核心挑战

生成分镜画面看起来简单，但实际运行时会遇到：

1. **API 限流**：短时间内请求太多会被限速
2. **生成失败**：某些 Prompt 可能触发安全过滤
3. **一致性漂移**：后续画面与参考图偏差变大
4. **成本控制**：20 个镜头 = 20 次 API 调用

---

## 二、基础批量生成

```python
# scripts/generate_shots.py
import os
import time
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)


def generate_shot_image(
    shot: dict,
    character_desc: str,
    style: str = "anime",
    output_dir: str = "assets/shots/"
) -> str:
    """生成单个分镜画面"""
    os.makedirs(output_dir, exist_ok=True)

    prompt = build_shot_prompt(shot, character_desc, style)

    response = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1080x1920",  # 竖屏短视频比例
        n=1
    )

    image_url = response.data[0].url
    shot_id = shot.get("shot_id", 1)
    filename = f"{output_dir}shot_{shot_id:03d}.png"

    img_data = requests.get(image_url).content
    with open(filename, "wb") as f:
        f.write(img_data)

    return filename


def batch_generate_shots(
    shots: list[dict],
    character_desc: str,
    style: str = "anime",
    delay: float = 1.0
) -> list[str]:
    """
    批量生成所有分镜画面

    参数:
        shots: 分镜列表（已由 extract_shots.py 解析）
        character_desc: 角色详细描述
        style: 画风
        delay: 每张图片生成后的延迟（秒），避免限流
    """
    image_paths = []

    for i, shot in enumerate(shots):
        shot["shot_id"] = i + 1
        print(f"[{i+1}/{len(shots)}] 生成: {shot.get('description', '')[:25]}...")

        try:
            path = generate_shot_image(shot, character_desc, style)
            image_paths.append(path)
            print(f"  ✓ {os.path.basename(path)}")
        except Exception as e:
            print(f"  ✗ 失败: {e}")
            # 创建占位继续（生产环境应重试）
            continue

        # 避免 API 限流
        time.sleep(delay)

    print(f"\n完成！共生成 {len(image_paths)}/{len(shots)} 张画面")
    return image_paths
```

---

## 三、添加重试机制

```python
import random

def generate_with_retry(
    shot: dict,
    character_desc: str,
    style: str = "anime",
    max_retries: int = 3,
    output_dir: str = "assets/shots/"
) -> str:
    """带重试的图片生成"""
    for attempt in range(max_retries):
        try:
            return generate_shot_image(shot, character_desc, style, output_dir)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            # 指数退避：1s, 2s, 4s
            wait = 2 ** attempt + random.random()
            print(f"  重试 {attempt+1}/{max_retries}，{wait:.1f}s 后...")
            time.sleep(wait)
```

---

## 四、成本预估与节流

### 单集成本计算

假设一部漫剧 20 个镜头，使用 GPT-Image-1：

```
每次调用：~$0.04（标准质量）
20 张图片：~$0.80 ≈ ¥5.8
加上剧本和 TTS：总成本约 ¥10～15/集
```

### 节流策略

```python
# 1. 批量预生成（非逐镜头）
# 如果 API 支持，一次性请求多张
response = client.images.generate(
    model="gpt-image-1",
    prompt=prompt,
    size="1080x1920",
    n=4  # 一次生成4张，选最好的
)

# 2. 先低分辨率预览
# 生成 512x512 预览，满意后再高清
# 节省 75% 成本

# 3. 队列化请求
# 使用 asyncio 并发 + 限速
import asyncio

async def batch_generate_concurrent(
    shots: list[dict],
    character_desc: str,
    max_concurrent: int = 3,
    delay: float = 0.5
):
    """并发生成，但限制同时请求数"""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def generate_one(shot, idx):
        async with semaphore:
            shot["shot_id"] = idx + 1
            print(f"[{idx+1}/{len(shots)}] 生成中...")
            path = await asyncio.to_thread(
                generate_shot_image, shot, character_desc
            )
            print(f"  ✓ {os.path.basename(path)}")
            await asyncio.sleep(delay)
            return path

    tasks = [generate_one(shot, i) for i, shot in enumerate(shots)]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, str)]
```

---

## 五、生成结果预览

批量生成完成后，可以快速预览所有分镜：

```python
from PIL import Image
import matplotlib.pyplot as plt

def preview_shots(image_paths: list[str], cols: int = 4):
    """网格预览所有分镜画面"""
    n = len(image_paths)
    rows = (n + cols - 1) // cols

    fig, axes = plt.subplots(rows, cols, figsize=(cols*3, rows*3))
    axes = axes.flatten() if n > 1 else [axes]

    for i, path in enumerate(image_paths):
        if i < len(axes):
            img = Image.open(path)
            axes[i].imshow(img)
            axes[i].set_title(f"Shot {i+1}", fontsize=8)
            axes[i].axis('off')

    for i in range(len(image_paths), len(axes)):
        axes[i].axis('off')

    plt.tight_layout()
    plt.savefig("assets/shots/preview.png", dpi=150)
    plt.show()
```

---

## 六、完整主程序入口

```python
# scripts/main.py
"""
AI 漫剧一键生成器
用法: python main.py --topic "程序员深夜加班" --style anime
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from scripts.write_script import write_script
from scripts.create_characters import generate_character_reference
from scripts.extract_shots import parse_script_to_shots
from scripts.generate_shots import batch_generate_shots
from scripts.generate_voice import generate_full_audio_shots
from scripts.compose_video import compose_final_video


def main():
    parser = argparse.ArgumentParser(description="AI 漫剧制作器")
    parser.add_argument("--topic", required=True, help="故事主题")
    parser.add_argument("--episodes", type=int, default=1)
    parser.add_argument("--style", default="anime")
    parser.add_argument("--output", default="output/")
    args = parser.parse_args()

    # 创建目录
    for d in [args.output, "assets/characters", "assets/shots", "assets/audio"]:
        os.makedirs(d, exist_ok=True)

    print("=" * 50)
    print("🎬 AI 漫剧制作器")
    print("=" * 50)

    # Step 1: 剧本
    print("\n[1/5] 生成剧本...")
    script = write_script(args.topic, args.episodes, args.style)
    with open(f"{args.output}/script.md", "w", encoding="utf-8") as f:
        f.write(script)
    print(f"  ✓ 剧本已保存")

    # Step 2: 角色
    print("\n[2/5] 生成角色参考图...")
    # 从剧本提取角色名（简化处理）
    shots_temp = parse_script_to_shots(script)
    chars = extract_characters(script)
    char_desc = ""
    char_paths = {}
    for char in chars[:2]:  # 最多2个主要角色
        ref = generate_character_reference(char, f"漫剧角色设计，{char}", args.style)
        char_paths[char] = ref["path"]
        print(f"  ✓ {char}: {ref['path']}")

    # Step 3: 画面
    print("\n[3/5] 生成分镜画面...")
    shots = parse_script_to_shots(script)
    image_paths = batch_generate_shots(shots, char_desc, args.style)
    print(f"  ✓ 生成了 {len(image_paths)} 张画面")

    # Step 4: 配音
    print("\n[4/5] 生成配音...")
    audio_files = generate_full_audio_shots(shots)
    print(f"  ✓ 生成了 {len(audio_files)} 段音频")

    # Step 5: 合成
    print("\n[5/5] 合成视频...")
    output_video = f"{args.output}/final.mp4"
    compose_final_video(image_paths, audio_files, output_video)
    print(f"  ✓ 视频已生成: {output_video}")

    print("\n" + "=" * 50)
    print("🎉 完成！输出目录: " + os.path.abspath(args.output))
    print("=" * 50)


if __name__ == "__main__":
    main()
```

---

## 七、本章小结

| 要点 | 说明 |
|------|------|
| 批量循环 | 逐个处理分镜，保存为 PNG |
| 限流延迟 | 每次请求间隔 0.5-1 秒 |
| 重试机制 | 失败自动重试，指数退避 |
| 成本控制 | 考虑低分辨率预览策略 |
| 并发优化 | 高配额账户可用 asyncio 加速 |

---

*下节课进入[模块五：音频与合成](../module-5/lesson-13.md)*
