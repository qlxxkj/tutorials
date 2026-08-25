# 第 14 课：视频生成（多图参考）

> 📌 **学习目标**：掌握用多图参考的视频生成模型，将静态分镜转化为动态视频片段
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：技术原理 → 方案对比 → 实战代码 → 片段拼接策略

---

## 一、为什么需要视频生成？

传统 AI 漫剧的做法是**静态图片 + 配音 = 幻灯片式播放**。这种方式简单，但视觉效果有限——画面是静止的，只有声音在动。

**视频生成**让画面"活"起来：人物会眨眼、头发会飘动、光影会变化。观众沉浸感大幅提升。

---

## 二、视频生成方案对比

### 方案 A：火山引擎 Seedance 2.0 ⭐ 推荐

```
优点：
✅ 国产，国内访问稳定，延迟低
✅ 多图参考能力极强（可同时传入角色图+场景图）
✅ API 调用简单，无需本地部署
✅ 支持 5-15 秒视频片段生成
✅ 对中文 Prompt 理解好

缺点：
❌ 按量计费，批量成本高
❌ 个人开发者可能有配额限制

工作流程：
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│  角色参考图   │     │  分镜画面     │     │  镜头运动描述    │
│  (正面全身)   │────→│  (当前分镜)   │────→│  "缓慢推进，人物眨眼" │
└──────────────┘     └──────────────┘     └────────┬────────┘
                                                    │
                                             ┌──────▼──────┐
                                             │ Seedance 2.0 │
                                             │ 生成 5-15秒  │
                                             │ 视频片段      │
                                             └──────┬──────┘
                                                    │
                                             ┌──────▼──────┐
                                             │  FFmpeg 拼接  │
                                             │   → 成片     │
                                             └─────────────┘
```

### 方案 B：MiniMax H3（API）

```
优点：
✅ 国产，对中文理解好
✅ 生成速度快
✅ 角色扮演能力强

缺点：
❌ 画面质量参差不齐
❌ 可控性不如 Seedance
```

### 方案 C：ComfyUI + MiniMax H3（本地）⭐⭐

```
优点：
✅ 完全免费，无 API 费用
✅ 结合 ControlNet 可精确控制镜头运动
✅ 多图参考输入保证角色一致性
✅ 每次生成 5-15 秒片段

缺点：
❌ 需要高性能 GPU（推荐 RTX 4090 24GB+）
❌ 单次生成耗时 2-5 分钟
❌ 需要定期更新模型

成本对比：
- Seedance API: ~¥1-2/秒 → 一部 2 分钟约 ¥120-240
- 本地 MiniMax-H3: 电费约 ¥2-5/次 → 一部 2 分钟约 ¥20-50
```

---

## 三、Seedance 2.0 API 实战

```python
# scripts/video_generate.py
import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

class SeedanceGenerator:
    """火山引擎 Seedance 2.0 视频生成器"""

    def __init__(self, api_key: str, secret_key: str):
        self.api_key = api_key
        self.secret_key = secret_key
        self.base_url = "https://volcengine.example.com/api/v2"

    def generate(
        self,
        character_ref: str,    # 角色参考图路径或 URL
        image_ref: str,         # 分镜画面路径或 URL
        prompt: str,            # 运动描述 Prompt
        duration: int = 5,      # 时长（秒）
        output_path: str = "assets/video/clip_001.mp4"
    ) -> str:
        """
        生成视频片段

        参数:
            character_ref: 角色参考图（保证角色一致）
            image_ref: 分镜参考图（保证画面一致）
            prompt: 运动描述（如"人物缓缓转头，眼神看向镜头"）
            duration: 视频时长（5-15秒）
            output_path: 输出路径
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # 上传参考图
        char_url = self._upload_image(character_ref)
        image_url = self._upload_image(image_ref)

        # 创建生成任务
        response = requests.post(
            f"{self.base_url}/video/generate",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "seedance-2.0",
                "character_reference": char_url,
                "image_reference": image_url,
                "prompt": prompt,
                "duration": duration,
                "resolution": "1080x1920"
            }
        )

        task_id = response.json()["data"]["task_id"]

        # 轮询等待结果
        while True:
            status_resp = requests.get(
                f"{self.base_url}/video/task/{task_id}",
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            status = status_resp.json()["data"]["status"]

            if status == "SUCCESS":
                video_url = status_resp.json()["data"]["video_url"]
                video_data = requests.get(video_url, timeout=60).content
                with open(output_path, "wb") as f:
                    f.write(video_data)
                print(f"  ✓ 视频已生成: {output_path}")
                return output_path
            elif status == "FAILED":
                raise RuntimeError(f"视频生成失败: {task_id}")

            time.sleep(3)

    def _upload_image(self, path_or_url: str) -> str:
        """上传图像，返回可访问的 URL"""
        if path_or_url.startswith('http'):
            return path_or_url
        # 本地文件上传逻辑...
        pass
```

---

## 四、Prompt 编写技巧（视频生成）

视频生成的 Prompt 和图像生成不同——它描述的是**运动**，不是**画面**。

### 运动描述关键词

| 运动类型 | Prompt 示例 |
|---------|------------|
| 缓慢推进 | `camera slowly pushes in toward the character's face` |
| 人物转头 | `character slowly turns head to look at camera` |
| 眨眼 | `character blinks naturally, subtle eye movement` |
| 风吹发丝 | `hair gently blowing in the wind, subtle motion` |
| 呼吸起伏 | `gentle breathing motion, chest rising and falling` |
| 手持晃动 | `slight handheld camera shake, natural movement` |
| 光影变化 | `screen light flickers slightly, shadow moves` |

### 完整的视频 Prompt 模板

```
{镜头运动描述}, {角色动作描述}, {环境动态},
保持画面风格和构图不变,
 cinematic quality, smooth motion,
 no sudden movements, no distortion
```

示例：
```
Camera slowly pushes in toward Chen Mo's face,
he slowly turns his head to look at the screen,
subtle breathing motion, blue monitor light flickers,
maintaining the same anime art style and composition,
cinematic quality, smooth motion, no distortion
```

---

## 五、分镜→视频片段的映射策略

不是每个分镜都需要生成视频。合理的策略：

| 分镜类型 | 是否生成视频 | 原因 |
|---------|------------|------|
| 特写表情 | ✅ 生成 | 微表情增加代入感 |
| 对话场景 | ✅ 生成 | 人物动作为对话增色 |
| 环境空镜 | ❌ 静态图 | 无需动态 |
| 转场镜头 | ⚠️ 简化 | 用 FFmpeg 转场效果即可 |
| 结尾悬念 | ✅ 生成 | 加强冲击力 |

**建议比例**：约 40-60% 的分镜生成视频片段，其余用静态图+Ken Burns 效果。

---

## 六、片段拼接策略

视频生成后，用 FFmpeg 将所有片段拼接成完整视频：

```python
# scripts/compose_video.py

def compose_from_video_clips(
    video_clips: list[str],    # 生成的视频片段列表
    static_shots: list[tuple], # (静态图路径, 对应音频路径) 列表
    output_path: str,
    resolution: tuple = (1080, 1920)
):
    """
    将视频片段和静态图混合拼接为最终视频

    策略：
    - 视频片段直接拼接
    - 静态图通过 FFmpeg 转为视频片段（Ken Burns 缩放效果）
    - 音频轨道按顺序对齐
    """
    import subprocess
    import os

    temp_dir = "assets/temp/"
    os.makedirs(temp_dir, exist_ok=True)

    # 1. 静态图转视频片段（带 Ken Burns 效果）
    static_videos = []
    for i, (img_path, audio_path) in enumerate(static_shots):
        clip_path = f"{temp_dir}static_{i:03d}.mp4"

        # 获取音频时长
        probe = subprocess.run(
            ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
             '-of', 'csv=p=0', audio_path],
            capture_output=True, text=True
        )
        duration = float(probe.stdout.strip())

        cmd = [
            'ffmpeg',
            '-loop', '1', '-i', img_path,
            '-i', audio_path,
            '-vf', f'scale={resolution[0]}:{resolution[1]}:force_original_aspect_ratio=decrease,pad={resolution[0]}:{resolution[1]}:(ow-iw)/2:(oh-ih)/2',
            '-c:v', 'libx264', '-tune', 'stillimage',
            '-c:a', 'aac',
            '-t', str(duration),
            '-shortest', '-y', clip_path
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        static_videos.append(clip_path)

    # 2. 合并所有视频片段（视频+静态）
    concat_list = f"{temp_dir}concat.txt"
    all_clips = video_clips + static_videos

    with open(concat_list, 'w') as f:
        for clip in all_clips:
            f.write(f"file '{os.path.abspath(clip)}'\n")

    cmd = [
        'ffmpeg', '-f', 'concat', '-safe', '0',
        '-i', concat_list,
        '-c', 'copy', '-y',
        output_path
    ]
    subprocess.run(cmd, check=True)
    print(f"✓ 视频已合成: {output_path}")
    return output_path
```

---

## 七、成本与效率权衡

| 方案 | 单片段成本 | 单片段耗时 | 质量 | 推荐度 |
|------|----------|----------|------|--------|
| Seedance API | ~¥1-2 | 30-60秒 | ★★★★★ | ⭐⭐⭐⭐ |
| MiniMax API | ~¥0.5-1 | 15-30秒 | ★★★ | ⭐⭐⭐ |
| ComfyUI 本地 | ¥0（电费） | 2-5分钟 | ★★★★ | ⭐⭐⭐⭐⭐ |

**建议**：先用 API 方案验证全流程，确认满意后切换到本地方案降本。

---

## 八、本章小结

| 步骤 | 操作 | 工具 |
|------|------|------|
| 1. 选择分镜 | 确定哪些镜头需要动态效果 | 人工判断 |
| 2. 构建 Prompt | 描述镜头运动和角色动作 | 英文 Prompt |
| 3. 生成视频 | 传入角色参考图+分镜图 | Seedance/MiniMax |
| 4. 拼接合成 | 视频片段+静态图+音频 | FFmpeg |

---

*下节课：[第 15 课：视频合成与后期](lesson-15.md)*
