# 第 14 课：口型同步（Lip Sync）

> 📌 **学习目标**：了解口型同步技术，掌握 HeyGen API 和本地 SadTalker 两种方案
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：技术原理 → API 方案 → 本地方案 → 选型决策

---

## 一、什么是口型同步？

口型同步（Lip Sync） = 让静态图片中的人物"开口说话"，嘴型和音频对得上。

```
角色参考图 + 配音音频  →  角色开口的短视频
```

---

## 二、方案对比

### 方案 A：HeyGen API（推荐新手）

```python
# 简单调用
import requests

def lipsync_with_heygen(image_path: str, audio_path: str, api_key: str) -> str:
    """使用 HeyGen API 进行口型同步"""

    # 1. 上传图像
    with open(image_path, "rb") as f:
        img_resp = requests.post(
            "https://api.heygen.com/v1/upload",
            headers={"authorization": api_key},
            files={"file": f}
        )
    image_id = img_resp.json()["data"]["video_id"]

    # 2. 上传音频
    with open(audio_path, "rb") as f:
        audio_resp = requests.post(
            "https://api.heygen.com/v1/upload",
            headers={"authorization": api_key},
            files={"file": f}
        )
    audio_id = audio_resp.json()["data"]["video_id"]

    # 3. 创建任务
    task_resp = requests.post(
        "https://api.heygen.com/v1/video/animate",
        headers={
            "authorization": api_key,
            "content-type": "application/json"
        },
        json={
            "source_image": image_id,
            "source_audio": audio_id,
            "result_video_sub_folder": "lip_sync"
        }
    )
    task_id = task_resp.json()["data"]["task_id"]

    # 4. 等待结果
    while True:
        status_resp = requests.get(
            f"https://api.heygen.com/v1/video/task/{task_id}",
            headers={"authorization": api_key}
        )
        status = status_resp.json()["data"]["status"]
        if status == "SUCCESS":
            url = status_resp.json()["data"]["result_video_url"]
            # 下载视频
            video_data = requests.get(url).content
            output_path = audio_path.replace(".mp3", ".mp4")
            with open(output_path, "wb") as f:
                f.write(video_data)
            return output_path
        elif status == "FAILED":
            raise Exception("Lip sync failed")
        time.sleep(2)
```

**优点**：质量高、速度快、接入简单
**缺点**：按秒计费（约 $0.1/秒），长期成本高

---

### 方案 B：SadTalker（本地免费）

SadTalker 是一个开源的 lip sync 项目，可以在本地运行。

#### 安装

```bash
# 1. 克隆项目
git clone https://github.com/OpenTalker/SadTalker.git
cd SadTalker

# 2. 安装依赖
pip install -r requirements.txt

# 3. 下载预训练模型（首次运行自动下载）
# 或者手动下载到 checkpoints/ 目录
```

#### 使用

```bash
# 基础用法
python inference.py \
    --source_image assets/characters/小明.png \
    --driving_audio assets/audio/001_小明.mp3 \
    --result_dir assets/lipsync/ \
    --still   # 减少头部运动，更适合漫剧

# 添加面部增强
python inference.py \
    --source_image assets/characters/小明.png \
    --driving_audio assets/audio/001_小明.mp3 \
    --result_dir assets/lipsync/ \
    --enhancer gfpgan
```

**优点**：完全免费、可离线运行
**缺点**：需要 GPU（推荐 NVIDIA 8GB+）、处理速度较慢

---

### 方案 C：D-ID API

```python
import requests

def lipsync_with_did(image_path: str, audio_path: str, api_key: str) -> str:
    """使用 D-ID API"""
    # D-ID 使用不同的 API 结构
    # 参考 https://docs.d-id.com/
    pass
```

---

## 三、要不要做口型同步？

这取决于你的漫剧风格：

| 风格 | 需要 Lip Sync？ | 原因 |
|------|----------------|------|
| **动态漫画** | ❌ 不需要 | 画面本身是静态图 + 轻微动效 |
| **口播型** | ✅ 需要 | 角色面向镜头"说话" |
| **叙事型** | 可选 | 有对话但画面变化丰富 |
| ** musical/歌舞** | ✅ 需要 | 口型必须与歌词同步 |

**建议：**
- 第一部漫剧：先不做口型同步，用动态漫画风格
- 确认流程跑通后，再考虑加入口型同步

---

## 四、简化方案：无需 Lip Sync 的动态漫画

不使用口型同步，而是用**微动效**让画面"活"起来：

```python
# 使用 FFmpeg 添加简单的缩放/平移效果
def add_ken_burns_effect(input_img: str, audio_path: str, output_video: str):
    """
    对静态图片添加缓慢缩放和平移效果，
    配合音频时长生成视频片段
    """
    import subprocess
    import os

    # 获取音频时长
    probe_cmd = [
        "ffprobe", "-v", "quiet", "-show_entries",
        "format=duration", "-of", "csv=p=0", audio_path
    ]
    result = subprocess.run(probe_cmd, capture_output=True, text=True)
    duration = float(result.stdout.strip())

    # FFmpeg 滤镜：缓慢缩放（Ken Burns 效果）
    cmd = [
        "ffmpeg",
        "-loop", "1",
        "-i", input_img,
        "-i", audio_path,
        "-vf", (
            f"scale=1080:1920:force_original_aspect_ratio=decrease,"
            f"pad=1080:1920:(ow-iw)/2:(oh-ih)/2,"
            f"zoom=zoomin:x=1080/2:y=1920/2:d=100:t=min({duration}/4,10),"
            f"zoom=zout:d={duration}"
        ),
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "copy",
        "-shortest",
        "-y",
        output_video
    ]
    subprocess.run(cmd, check=True)
    return output_video
```

这种方式比 lip sync 简单得多，但视觉效果已经足够好。

---

## 五、本章小结

| 方案 | 质量 | 成本 | 难度 | 推荐 |
|------|------|------|------|------|
| HeyGen API | ★★★★★ | 高 | 低 | 商业项目 |
| SadTalker | ★★★ | 免费 | 中 | 本地部署 |
| 动态漫画（无口型） | ★★★★ | 免费 | 低 | 入门首选 |

---

*下节课：[第 15 课：视频合成与后期](lesson-15.md)*
