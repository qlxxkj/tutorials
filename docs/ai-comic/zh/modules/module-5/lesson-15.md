# 第 15 课：视频合成与后期

> 📌 **学习目标**：掌握 FFmpeg 视频合成技术，将素材合成为可直接发布的成品视频
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：FFmpeg 基础 → 多轨合成 → 字幕烧录 → 一键成品

---

## 一、合成的核心挑战

我们手头有三种素材：
- **视频片段**（Seedance 生成的动态镜头）
- **静态图片**（未生成视频的镜头）
- **音频轨道**（TTS 生成的配音）

目标是把它们按时间轴对齐，合成一个连贯的视频。

---

## 二、FFmpeg 核心概念

### 2.1 常用滤镜

| 滤镜 | 作用 | 示例 |
|------|------|------|
| `scale` | 缩放 | `scale=1080:1920` |
| `pad` | 填充黑边 | `pad=1080:1920:(ow-iw)/2:(oh-ih)/2` |
| `trim` | 裁剪时长 | `trim=0:5`（前5秒） |
| `setpts` | 调整时间戳 | `setpts=0.5*PTS`（2倍速） |
| `zoompan` | 缩放动画 | `zoompan=z='min(1.5,1+0.005*t)':d=250` |
| `subtitles` | 烧录字幕 | `subtitles='file.srt'` |
| `loudnorm` | 响度标准化 | `loudnorm=I=-14` |

### 2.2 常用编码器参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `-c:v` | `libx264` | H.264 视频编码 |
| `-preset` | `fast` / `medium` / `slow` | 编码速度（越快质量越低） |
| `-crf` | `18-23` | 质量（越低越好，18 为高质量） |
| `-c:a` | `aac` | AAC 音频编码 |
| `-b:a` | `192k` | 音频码率 |
| `-pix_fmt` | `yuv420p` | 兼容性格式 |

---

## 三、完整合成脚本

```python
# scripts/compose_video.py
import os
import subprocess
import json


def get_video_duration(path: str) -> float:
    """获取视频/音频文件时长"""
    cmd = [
        'ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
        '-of', 'json', path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(json.loads(result.stdout)['format']['duration'])


def image_to_video(
    image_path: str,
    audio_path: str,
    output_path: str,
    resolution: tuple = (1080, 1920)
):
    """
    将静态图片+音频合成为视频片段
    使用 Ken Burns 效果（缓慢缩放）增加动态感
    """
    duration = get_video_duration(audio_path)

    cmd = [
        'ffmpeg',
        '-loop', '1',
        '-i', image_path,
        '-i', audio_path,
        '-vf', (
            f'scale={resolution[0]}:{resolution[1]}:'
            f'force_original_aspect_ratio=decrease,'
            f'pad={resolution[0]}:{resolution[1]}:'
            f'(ow-iw)/2:(oh-ih)/2,'
            f'zoompan=z=\'min(1.1,1+0.002*t)\':d={int(duration*30)}:'
            f's={resolution[0]}x{resolution[1]}:fps=30'
        ),
        '-c:v', 'libx264',
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-t', str(duration),
        '-shortest',
        '-y', output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path


def concat_videos(video_paths: list[str], output_path: str):
    """使用 concat demuxer 拼接多个视频片段"""
    list_file = "assets/temp/concat_list.txt"
    with open(list_file, 'w') as f:
        for path in video_paths:
            f.write(f"file '{os.path.abspath(path)}'\n")

    cmd = [
        'ffmpeg', '-f', 'concat', '-safe', '0',
        '-i', list_file,
        '-c', 'copy', '-y', output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✓ 视频已拼接: {output_path}")


def add_subtitles(video_path: str, srt_path: str, output_path: str):
    """烧录 SRT 字幕到视频"""
    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-vf', f"subtitles='{os.path.abspath(srt_path)}':force_style='Fontsize=28,PrimaryColour=&H00FFFFFF,OutlineColour=&H80000000,Outline=1'",
        '-c:a', 'copy',
        '-y', output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✓ 已添加字幕: {output_path}")


def add_bgm(video_path: str, bgm_path: str, bgm_volume: float = 0.12, output_path: str = None):
    """添加背景音乐，音量压低不盖过配音"""
    if output_path is None:
        output_path = video_path.replace('.mp4', '_bgm.mp4')

    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-i', bgm_path,
        '-filter_complex',
        f'[1:a]volume={bgm_volume},aloop=loop=-1:size=2e+09[bgm];'
        f'[0:a][bgm]amix=inputs=2:duration=first[a]',
        '-map', '0:v', '-map', '[a]',
        '-c:v', 'copy', '-c:a', 'aac',
        '-y', output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✓ 已添加 BGM: {output_path}")


def normalize_audio(video_path: str, output_path: str = None) -> str:
    """统一音频响度到 -14 LUFS"""
    if output_path is None:
        output_path = video_path.replace('.mp4', '_final.mp4')

    cmd = [
        'ffmpeg', '-i', video_path,
        '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11',
        '-c:v', 'copy', '-y', output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✓ 已标准化音频: {output_path}")
    return output_path


def generate_srt(shots: list[dict], output_path: str = "assets/subtitles.srt"):
    """根据分镜自动生成 SRT 字幕"""
    import re

    # 计算每个镜头的起始时间（假设每个镜头约 5 秒）
    current_time = 0.0
    line_num = 1

    with open(output_path, 'w', encoding='utf-8') as f:
        for shot in shots:
            dialogue = shot.get('dialogue', '')
            if not dialogue:
                continue

            # 估算时长（根据字符数，每字符约 0.15 秒）
            duration = max(2.0, len(dialogue) * 0.15)
            start_ts = format_srt_time(current_time)
            end_ts = format_srt_time(current_time + duration)

            f.write(f"{line_num}\n")
            f.write(f"{start_ts} --> {end_ts}\n")
            f.write(f"{dialogue}\n\n")

            current_time += duration
            line_num += 1

    print(f"✓ 字幕已生成: {output_path}")


def format_srt_time(seconds: float) -> str:
    """秒数转为 SRT 时间格式 HH:MM:SS,mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
```

---

## 四、一键合成全流程

```python
def one_click_final_compose(
    shots: list[dict],
    image_paths: list[str],
    audio_files: list[str],
    video_clips: list[str] = None,
    output_path: str = "output/final.mp4",
    bgm_path: str = None
):
    """
    一键完成视频合成全流程

    流程:
    1. 生成 SRT 字幕
    2. 静态图转视频（Ken Burns 效果）
    3. 拼接所有视频片段
    4. 烧录字幕
    5. 添加 BGM
    6. 响度标准化
    """
    import shutil

    video_clips = video_clips or []
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Step 1: 生成字幕
    srt_path = output_path.replace('.mp4', '.srt')
    generate_srt(shots, srt_path)

    # Step 2: 静态图转视频片段
    temp_dir = "assets/temp/"
    os.makedirs(temp_dir, exist_ok=True)

    static_video_paths = []
    shot_idx = 0
    audio_idx = 0

    for i, (img_path, aud_path) in enumerate(zip(image_paths, audio_files)):
        clip_path = f"{temp_dir}clip_{i:03d}.mp4"
        image_to_video(img_path, aud_path, clip_path)
        static_video_paths.append(clip_path)
        shot_idx += 1
        audio_idx += 1

    # Step 3: 拼接视频片段（视频生成 + 静态图转换）
    all_clips = video_clips + static_video_paths
    concat_list = f"{temp_dir}concat.txt"
    with open(concat_list, 'w') as f:
        for clip in all_clips:
            f.write(f"file '{os.path.abspath(clip)}'\n")

    composed = output_path.replace('.mp4', '_composed.mp4')
    concat_videos(all_clips, composed)

    # Step 4: 烧录字幕
    with_subs = output_path.replace('.mp4', '_subs.mp4')
    add_subtitles(composed, srt_path, with_subs)

    # Step 5: 添加 BGM
    final = with_subs
    if bgm_path and os.path.exists(bgm_path):
        final = output_path.replace('.mp4', '_bgm.mp4')
        add_bgm(with_subs, bgm_path, output_path=final)

    # Step 6: 响度标准化
    result = final.replace('.mp4', '_final.mp4')
    normalize_audio(final, result)

    # 清理临时文件
    shutil.rmtree(temp_dir, ignore_errors=True)

    # 重命名为最终文件名
    if result != output_path:
        os.replace(result, output_path)

    print(f"\n🎬 最终视频: {output_path}")
    return output_path
```

---

## 五、常用 FFmpeg 命令速查

```bash
# 查看视频信息
ffprobe -v quiet -show_format -show_streams video.mp4

# 图片转视频（每秒 1 帧 = 每张图片 1 秒）
ffmpeg -framerate 1 -i shot_%03d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# 视频慢放 2 倍
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=2.0*PTS[v]" -map "[v]" -c:a copy output.mp4

# 视频加速 2 倍
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v]" -map "[v]" -c:a copy output.mp4

# 裁剪视频前 30 秒
ffmpeg -i input.mp4 -t 30 -c copy output.mp4

# 提取音频
ffmpeg -i video.mp4 -vn -acodec copy audio.aac

# 视频转 GIF（用于预览）
ffmpeg -i input.mp4 -vf "scale=480:-1:flags=lanczos" -ss 0 -t 3 output.gif
```

---

## 六、本章小结

| 步骤 | 操作 | 关键参数 |
|------|------|---------|
| 字幕生成 | SRT 自动格式化 | 按台词长度估算时长 |
| 图片→视频 | Ken Burns 缩放 | `zoompan` 滤镜 |
| 拼接 | concat demuxer | `-f concat -safe 0` |
| 烧字幕 | subtitles 滤镜 | `force_style` 控制样式 |
| 加 BGM | amix 混音 | `volume=0.12` 压低音量 |
| 标准化 | loudnorm 滤镜 | `I=-14` 响度统一 |

---

*下节课进入[模块六：实战项目](../module-6/project-1.md)*
