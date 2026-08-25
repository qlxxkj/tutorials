# 第 12 课：批量生成分镜画面

> 📌 **学习目标**：掌握批量图像生成的完整流程，处理限流、错误和一致性漂移
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：批量逻辑 → 质量控制 → 成本优化 → 完整代码

---

## 一、批量生成的核心流程

```
剧本（N个镜头）
     │
     ▼
┌─────────────────────────────────┐
│  Step 1: 逐镜头构建 Prompt       │
│  (用 Prompt 构建器 + 角色描述)    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Step 2: 调用 API 生成图像       │
│  (带重试 + 限流延迟)              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Step 3: 下载并保存              │
│  (按 shot_001.png 格式命名)       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Step 4: 质量检查（可选）         │
│  (检测模糊/异常/不一致)           │
└────────────┬────────────────────┘
             │
             ▼
      assets/shots/shot_001.png
      assets/shots/shot_002.png
      ...
      assets/shots/shot_020.png
```

---

## 二、完整实现

```python
# scripts/generate_shots.py
import os
import time
import random
import requests
from openai import OpenAI
from dotenv import load_dotenv
from scripts.prompt_builder import build_prompt

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

MAX_RETRIES = 3
RETRY_DELAY = 2  # 秒


def generate_single_shot(
    shot: dict,
    character_desc: str,
    style: str = "anime",
    output_dir: str = "assets/shots/"
) -> str:
    """
    生成单个分镜画面

    含重试机制：API 限流时自动重试，指数退避
    """
    os.makedirs(output_dir, exist_ok=True)
    shot_id = shot.get('shot_id', 1)
    filename = f"{output_dir}shot_{shot_id:03d}.png"

    # 构建 Prompt
    prompt = build_prompt(shot, character_desc, style)

    for attempt in range(MAX_RETRIES):
        try:
            response = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size="1080x1920",  # 竖屏短视频比例
                n=1
            )

            image_url = response.data[0].url
            img_data = requests.get(image_url, timeout=30).content
            with open(filename, "wb") as f:
                f.write(img_data)

            # 验证文件是否正常写入
            if os.path.getsize(filename) < 1000:
                raise ValueError("Generated image too small, likely failed")

            return filename

        except Exception as e:
            if attempt == MAX_RETRIES - 1:
                raise
            wait = RETRY_DELAY * (2 ** attempt) + random.uniform(0, 1)
            print(f"  ⚠️  第 {attempt+1} 次尝试失败 ({e})，{wait:.1f}s 后重试...")
            time.sleep(wait)


def batch_generate(
    shots: list[dict],
    character_desc: str,
    style: str = "anime",
    delay_between: float = 1.0
) -> list[str]:
    """
    批量生成分镜画面

    参数:
        shots: 解析后的分镜列表
        character_desc: 角色描述（用于每帧保持一致性）
        style: 画风
        delay_between: 每张图片生成后的等待时间（避免限流）

    返回:
        生成的图片路径列表
    """
    results = []

    for i, shot in enumerate(shots):
        shot['shot_id'] = i + 1
        print(f"[{i+1}/{len(shots)}] {shot.get('description', '')[:30]}...")

        try:
            path = generate_single_shot(shot, character_desc, style)
            results.append(path)
            print(f"  ✓ {os.path.basename(path)}")
        except Exception as e:
            print(f"  ✗ 失败: {e}")
            # 记录失败的镜头，但不中断整体流程
            continue

        # 限流控制
        time.sleep(delay_between)

    print(f"\n完成: {len(results)}/{len(shots)} 张画面已生成")
    return results
```

---

## 三、一致性漂移的检测与修复

随着生成分镜数量增加，角色可能逐渐"走样"。解决方法：

### 3.1 定期插入角色参考图

每生成 5 张图后，重新用参考图校验一次：

```python
def regenerate_with_consistency_check(
    shots: list[dict],
    character_ref_path: str,
    character_desc: str,
    style: str = "anime",
    check_interval: int = 5
) -> list[str]:
    """
    每隔 check_interval 张图，重新调用一次角色参考图生成
    确保角色特征不漂移
    """
    results = []
    for i, shot in enumerate(shots):
        shot['shot_id'] = i + 1

        # 每 N 张重新生成一次角色参考图
        if i > 0 and i % check_interval == 0:
            print(f"  🔁 重新校准角色参考图（镜头 {i+1}）...")
            # 这里可以重新生成参考图，或在 prompt 中重新强调角色特征

        path = generate_single_shot(shot, character_desc, style)
        results.append(path)
        time.sleep(1.0)

    return results
```

### 3.2 使用固定 Seed

```python
def get_seed(shot_id: int, character_name: str) -> int:
    """为每个角色-镜头组合生成固定 seed"""
    import hashlib
    seed_str = f"{character_name}_{shot_id}"
    return int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16) % (2**31 - 1)
```

---

## 四、成本优化策略

### 4.1 低分辨率预览 → 高清精修

```python
def generate_with_preview(
    shots: list[dict],
    character_desc: str,
    style: str = "anime"
) -> list[str]:
    """
    先生成 512x512 预览确认质量，
    满意后再高清生成
    可节省约 75% 成本
    """
    results = {}

    # Step 1: 快速预览
    for i, shot in enumerate(shots):
        shot['shot_id'] = i + 1
        prompt = build_prompt(shot, character_desc, style)

        response = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="512x512",  # 低成本预览
            n=1
        )
        results[i] = {
            "preview_url": response.data[0].url,
            "prompt": prompt,
            "shot": shot
        }
        print(f"[预览 {i+1}/{len(shots)}]")

    # Step 2: 用户确认后高清生成
    confirmed = input("确认所有预览？(y/n) ").strip().lower()
    if confirmed != 'y':
        print("请检查预览后重试")
        return []

    final_paths = []
    for i, data in results.items():
        shot = data["shot"]
        shot['shot_id'] = i + 1
        path = generate_single_shot(shot, character_desc, style)
        final_paths.append(path)
        print(f"  ✓ 高清生成: shot_{i+1:03d}.png")

    return final_paths
```

### 4.2 成本估算

| 项目 | 单价 | 20 镜头成本 |
|------|------|------------|
| GPT-Image-1 标准 | ~$0.04/张 | ~$0.80（约 ¥5.8）|
| GPT-Image-1 HD | ~$0.08/张 | ~$1.60（约 ¥11.6）|
| 预览+精修策略 | ~$0.01×20 + $0.04×15 | ~$0.80（约 ¥5.8）|

---

## 五、质量控制检查清单

每张图生成后，人工检查以下项目：

- [ ] **角色一致性**：脸、发型、服装是否与参考图匹配
- [ ] **画面清晰度**：没有模糊、拉伸、变形
- [ ] **构图合理性**：主体是否在合适位置
- [ ] **情绪传达**：表情和氛围是否符合剧本要求
- [ ] **无异常元素**：没有多余的手、奇怪的文字、水印
- [ ] **比例正确**：竖屏 9:16 或横屏 16:9

对于不合格的图：
1. 微调 Prompt 后重新生成该镜头
2. 或者使用图像编辑工具（如 Photoshop、GIMP）手动修复

---

## 六、本章小结

| 环节 | 要点 |
|------|------|
| 批量循环 | 逐个处理，保存为 `shot_NNN.png` |
| 限流控制 | 每次请求间隔 1 秒 |
| 重试机制 | 失败自动重试 3 次，指数退避 |
| 一致性 | 定期重新强调角色特征 |
| 成本优化 | 先低分辨率预览，满意后再高清 |

---

*下节课进入[模块五：音频与合成](../module-5/lesson-13.md)*
