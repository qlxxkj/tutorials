# 项目二：批量生产系列短剧

> 📌 **学习目标**：建立高效的批量生产流程，实现日更能力
> ⏱️ **预计时长**：45 分钟
> 🎯 **本节节奏**：模板化 → 批量处理 → 效率优化

---

## 一、为什么要批量生产？

单部漫剧耗时约 1 小时。如果你想在抖音/快手日更，需要把时间压缩到 **15-20 分钟**。

关键策略：**复用已有资源，只生成变化的部分**。

---

## 二、模板化策略

### 2.1 建立角色库

同一世界观下的角色只需生成一次参考图：

```
assets/characters/
├── 主角.png      # 固定复用
├── 配角A.png     # 固定复用
└── 反派.png      # 固定复用
```

### 2.2 建立风格模板

```python
# config.py
STYLES = {
    "suspense": {
        "prompt_suffix": "dark atmosphere, dramatic lighting, film noir style",
        "color_palette": ["#1a1a2e", "#16213e", "#0f3460", "#e94560"],
    },
    "romance": {
        "prompt_suffix": "soft lighting, warm colors, dreamy atmosphere",
        "color_palette": ["#ffd3e6", "#ffaaa5", "#ff8c94", "#e8a0bf"],
    },
    "sci-fi": {
        "prompt_suffix": "neon lights, futuristic, cyberpunk aesthetic",
        "color_palette": ["#0f0f23", "#00d4ff", "#ff006e", "#8338ec"],
    }
}
```

### 2.3 建立剧本模板

不同题材有固定的剧本结构模板：

```markdown
【悬疑模板】
开场钩子（3秒）→ 日常铺垫（10秒）→ 异常出现（5秒）→ 调查推进（20秒）→ 真相揭示（10秒）→ 悬念结尾（5秒）

【爱情模板】
相遇（5秒）→ 互动（15秒）→ 转折（10秒）→ 升华（10秒）→ 余韵（5秒）
```

---

## 三、批量生产脚本

```python
# scripts/batch producer.py
import os
import asyncio
from pathlib import Path

async def batch_produce(
    topics: list[str],
    style: str = "anime",
    output_dir: str = "output/"
):
    """批量生产多部漫剧"""
    for i, topic in enumerate(topics):
        print(f"\n{'='*50}")
        print(f"🎬 正在制作第 {i+1}/{len(topics)} 部: {topic}")
        print(f"{'='*50}")

        episode_dir = f"{output_dir}/episode_{i+1:02d}_{topic[:10]}"
        os.makedirs(episode_dir, exist_ok=True)

        # 复用角色（如果已存在）
        chars_dir = f"{episode_dir}/characters"
        if not os.path.exists(chars_dir):
            # 首次生产需要生成角色
            pass

        # 复用分镜解析和画面生成逻辑
        # ...（调用现有脚本）

        print(f"✅ 第 {i+1} 部完成!")


if __name__ == "__main__":
    topics = [
        "程序员发现代码中的秘密",
        "外卖员送错地址",
        "电梯里的陌生人",
        "凌晨便利店的奇遇",
        "遗忘的日记本",
    ]
    asyncio.run(batch_produce(topics))
```

---

## 四、效率优化技巧

### 4.1 并行生成

```python
import asyncio

async def generate_parallel(shots: list[dict], max_concurrent: int = 5):
    """并发生成多张分镜画面"""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def one_shot(shot):
        async with semaphore:
            return await asyncio.to_thread(generate_shot_image, shot)

    results = await asyncio.gather(
        *[generate_shot_image(shot) for shot in shots],
        return_exceptions=True
    )
    return [r for r in results if not isinstance(r, Exception)]
```

### 4.2 增量生成

只重新生成有变化的部分：

```python
def should_regenerate(shot_id: int, last_generated: dict) -> bool:
    """检查是否需要重新生成某个分镜"""
    if shot_id not in last_generated:
        return True
    # 如果分镜描述没有变化，跳过
    return last_generated[shot_id].get("description") != current_description
```

### 4.3 缓存机制

对相同的 Prompt 结果进行缓存，避免重复生成：

```python
import hashlib

def get_cached_image(prompt: str) -> str | None:
    """检查是否已有缓存"""
    hash_key = hashlib.md5(prompt.encode()).hexdigest()
    cache_path = f"cache/{hash_key}.png"
    if os.path.exists(cache_path):
        return cache_path
    return None
```

---

## 五、本章小结

| 策略 | 节省时间 | 实现难度 |
|------|---------|---------|
| 角色复用 | 50%+ | 低 |
| 风格模板 | 30% | 低 |
| 剧本模板 | 40% | 中 |
| 并行生成 | 60% | 中 |
| 缓存机制 | 70%+ | 中 |

---

*下个项目：[项目三：部署自动化流水线](project-3.md)*
