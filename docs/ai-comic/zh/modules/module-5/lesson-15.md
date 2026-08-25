# 第 15 课：视频合成与后期

> 📌 **学习目标**：掌握 FFmpeg 视频合成技术，完成从素材到成品的最后一步
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：FFmpeg 基础 → 拼接合成 → 字幕添加 → 完整流程

---

## 一、FFmpeg 核心命令

### 图片转视频

```bash
# 将图片序列转换为视频
ffmpeg -framerate 1/5 -i assets/shots/shot_%03d.png -c:v libx264 -pix_fmt yuv420p output.mp4
```

参数说明：
- `-framerate 1/5`：每张图片显示 5 秒（倒数表示时长）
- `%03d`：匹配 `shot_001.png`, `shot_002.png` 等命名
- `-pix_fmt yuv420p`：兼容所有播放器

### 图片缩放适配

```bash
# 保持宽高比缩放到 1080 宽度，不足部分用黑色填充
ffmpeg -i input.png -vf "scale=1080:-1:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" output.png
```

---

## 二、完整视频合成脚本

```python
# scripts/compose_video.py
import os
import subprocess
import re


def compose_final_video(
    image_paths: list[str],
    audio_files: list[str],
    output_path: str,
    resolution: tuple = (1080, 1920),
    fps: int = 30
):
    """
    合成最终视频

    参数:
        image_paths: 分镜图片路径列表
        audio_files: 配音音频路径列表
        output_path: 输出视频路径
        resolution: 分辨率 (宽, 高)
        fps: 帧率
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 构建 FFmpeg 命令
    # 思路：每张图片 + 对应音频 → 拼接

    # 1. 准备每个镜头的视频片段
    temp_dir = "assets/temp/"
    os.makedirs(temp_dir, exist_ok=True)

    # 2. 使用 concat demuxer 拼接
    concat_list = f"{temp_dir}concat.txt"
    with open(concat_list, "w") as f:
        for img_path in image_paths:
            f.write(f"file '{os.path.abspath(img_path)}'\n")
            f.write(f"duration 5\n")  # 每镜头默认 5 秒
        f.write(f"file '{os.path.abspath(image_paths[-1])}'\n")

    # 3. 主合成命令
    cmd = [
        "ffmpeg",
        # 图片序列输入
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        # 音频输入
        "-f", "concat", "-safe", "0",
        "-i", create_audio_concat_list(audio_files, temp_dir),
        # 视频滤镜
        "-vf", f"scale={resolution[0]}:{resolution[1]}",
        # 输出
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",       # 高质量编码
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-y",
        output_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg 错误: {result.stderr}")

    print(f"✓ 视频已生成: {output_path}")
    return output_path


def create_audio_concat_list(audio_files: list[str], temp_dir: str) -> str:
    """创建音频 concat 列表文件"""
    list_file = f"{temp_dir}audio_concat.txt"
    with open(list_file, "w") as f:
        for audio in audio_files:
            f.write(f"file '{os.path.abspath(audio)}'\n")
    return list_file
```

---

## 三、添加字幕

### SRT 字幕文件格式

```
1
00:00:01,000 --> 00:00:04,000
又一个深夜，代码还没写完……

2
00:00:05,000 --> 00:00:07,500
还有三行……就三行……

3
00:00:12,000 --> 00:00:15,000
你想不想看看另一个自己？
```

### 自动生成 SRT

```python
def generate_srt(shots: list[dict], output_path: str = "assets/subtitles.srt"):
    """根据分镜数据自动生成 SRT 字幕文件"""
    with open(output_path, "w", encoding="utf-8") as f:
        for i, shot in enumerate(shots, 1):
            dialogue = shot.get("dialogue", "")
            if not dialogue:
                continue

            # 简化时间计算（实际应用中需要根据音频精确计算）
            start_sec = (i - 1) * 5
            end_sec = start_sec + 4

            start_ts = format_time(start_sec)
            end_ts = format_time(end_sec)

            f.write(f"{i}\n")
            f.write(f"{start_ts} --> {end_ts}\n")
            f.write(f"{dialogue}\n\n")

    print(f"✓ 字幕已生成: {output_path}")


def format_time(seconds: float) -> str:
    """秒数转为 SRT 时间格式"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
```

### FFmpeg 烧录字幕

```python
def burn_subtitles(video_path: str, srt_path: str, output_path: str):
    """将 SRT 字幕烧录到视频中"""
    cmd = [
        "ffmpeg",
        "-i", video_path,
        "-vf", f"subtitles='{os.path.abspath(srt_path)}':force_style='Fontsize=24'",
        "-c:a", "copy",
        "-y",
        output_path
    ]
    subprocess.run(cmd, check=True)
```

---

## 四、添加背景音乐

```python
def add_bgm(video_path: str, bgm_path: str, bgm_volume: float = 0.15, output_path: str = None):
    """添加背景音乐，音量自动压低不盖过配音"""
    if output_path is None:
        output_path = video_path.replace(".mp4", "_with_bgm.mp4")

    cmd = [
        "ffmpeg",
        "-i", video_path,
        "-i", bgm_path,
        "-filter_complex",
        f"[1:a]volume={bgm_volume}[bgm];[0:a][bgm]amix=inputs=2:duration=first",
        "-c:v", "copy",
        "-c:a", "aac",
        "-y",
        output_path
    ]
    subprocess.run(cmd, check=True)
    print(f"✓ 已添加 BGM: {output_path}")
```

---

## 五、一键合成脚本

```python
def one_click_compose(
    shots: list[dict],
    image_paths: list[str],
    audio_files: list[str],
    output_path: str = "output/final.mp4",
    add_bgm_path: str = None
):
    """
    一键完成视频合成全流程

    流程:
    1. 图片序列 → 视频片段
    2. 音频对齐 → 合成音画
    3. 添加字幕
    4. 添加 BGM（可选）
    5. 响度标准化
    """
    import shutil

    # 1. 生成字幕
    srt_path = output_path.replace(".mp4", ".srt")
    generate_srt(shots, srt_path)

    # 2. 图片转视频（每张图片对应一段）
    temp_videos = []
    for i, (img, audio) in enumerate(zip(image_paths, audio_files)):
        temp_video = f"assets/temp/shot_{i+1:03d}.mp4"

        # 获取音频时长
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", audio],
            capture_output=True, text=True
        )
        duration = float(probe.stdout.strip())

        # 生成视频片段
        cmd = [
            "ffmpeg",
            "-loop", "1", "-i", img,
            "-i", audio,
            "-vf", f"scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac",
            "-t", str(duration),
            "-shortest",
            "-y", temp_video
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        temp_videos.append(temp_video)

    # 3. 拼接所有片段
    concat_list = "assets/temp/concat.txt"
    with open(concat_list, "w") as f:
        for v in temp_videos:
            f.write(f"file '{os.path.abspath(v)}'\n")

    cmd = [
        "ffmpeg", "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy", "-y",
        output_path
    ]
    subprocess.run(cmd, check=True)

    # 4. 添加 BGM
    if add_bgm_path and os.path.exists(add_bgm_path):
        bgm_output = output_path.replace(".mp4", "_bgm.mp4")
        add_bgm(output_path, add_bgm_path, output_path=bgm_output)
        output_path = bgm_output

    # 5. 响度标准化
    final_path = output_path.replace(".mp4", "_final.mp4")
    cmd = [
        "ffmpeg", "-i", output_path,
        "-af", "loudnorm=I=-14:TP=-1.0:LRA=11",
        "-c:v", "copy", "-y",
        final_path
    ]
    subprocess.run(cmd, check=True)

    # 清理临时文件
    shutil.rmtree("assets/temp/", ignore_errors=True)

    print(f"🎬 最终视频: {final_path}")
    return final_path
```

---

## 六、视频质量检查

```python
def check_video(video_path: str):
    """检查生成的视频信息"""
    import json

    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", video_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data = json.loads(result.stdout)

    fmt = data["format"]
    video_stream = next(s for s in data["streams"] if s["codec_type"] == "video")

    print(f"📹 视频信息：")
    print(f"   分辨率: {video_stream.get('width')}x{video_stream.get('height')}")
    print(f"   时长: {float(fmt['duration']):.1f} 秒")
    print(f"   码率: {int(fmt['bit_rate'])/1000:.0f} kbps")
    print(f"   编码: {video_stream.get('codec_name')}")
    print(f"   帧率: {video_stream.get('r_frame_rate')}")
```

---

## 七、本章小结

| 操作 | FFmpeg 关键参数 |
|------|----------------|
| 图片转视频 | `-loop 1 -i input.png -t duration` |
| 视频拼接 | `-f concat -safe 0 -i list.txt` |
| 缩放适配 | `scale=...,pad=...` |
| 添加字幕 | `-vf "subtitles='file.srt'"` |
| 添加 BGM | `-filter_complex "[1:a]volume=0.15"` |
| 响度标准化 | `-af "loudnorm=I=-14"` |

---

*下节课进入[模块六：实战项目](../module-6/project-1.md)*
