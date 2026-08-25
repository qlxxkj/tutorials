# 第 13 课：TTS 配音生成

> 📌 **学习目标**：掌握 OpenAI TTS API，为多角色生成自然配音
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：API 基础 → 多角色配音 → 音频后处理

---

## 一、OpenAI TTS API 基础

### 支持的模型

| 模型 | 特点 | 推荐场景 |
|------|------|---------|
| `gpt-4o-mini-tts` | 快速、性价比高 | 日常漫剧配音 |
| `tts-1-hd` | 高质量、稍慢 | 商业级输出 |

### 支持的音色

| 音色 | 性别/特点 | 推荐角色 |
|------|----------|---------|
| alloy | 中性男声 | 旁白、年轻男性 |
| echo | 温暖男声 | 叙述者、年长男性 |
| fable | 英国女声 | 女性角色 |
| onyx | 深沉男声 | 反派、神秘角色 |
| nova | 明亮女声 | 年轻女性 |
| shani | 有力女声 | 强势女性 |
| coral | 温暖女声 | 温柔女性 |
| sage | 冷静女声 | 理性角色 |

---

## 二、基础用法

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

# 最简单的 TTS
response = client.audio.speech.create(
    model="gpt-4o-mini-tts",
    voice="alloy",
    input="你好，欢迎来到这个世界",
    speed=1.0,
)

# 流式保存到文件
response.stream_to_file("output.mp3")
```

---

## 三、多角色配音实现

```python
# scripts/generate_voice.py
import os
import re
import time
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

# 角色到音色的映射
VOICE_MAP = {
    "小明": "alloy",
    "主角": "alloy",
    "旁白": "onyx",
    "神秘人": "onyx",
    "林夏": "nova",
    "女性角色": "nova",
    "陈博士": "echo",
    "老人": "echo",
}

# 情绪到语速的映射
SPEED_MAP = {
    "震惊": 0.85,
    "恐惧": 0.8,
    "愤怒": 1.15,
    "兴奋": 1.1,
    "悲伤": 0.9,
    "疲惫": 0.95,
    "平静": 1.0,
    "神秘": 0.9,
}


def text_to_speech(
    text: str,
    voice: str = "alloy",
    speed: float = 1.0,
    output_path: str = "assets/audio/output.mp3"
) -> str:
    """将文本转换为语音"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice=voice,
        input=text,
        speed=speed,
    )

    response.stream_to_file(output_path)
    return output_path


def generate_voice_for_shot(
    shot: dict,
    output_dir: str = "assets/audio/"
) -> str:
    """
    为单个分镜生成配音

    参数:
        shot: 分镜字典（含 character, dialogue, emotion）

    返回:
        音频文件路径
    """
    dialogue = shot.get("dialogue", "")
    if not dialogue:
        return None

    character = shot.get("character", "旁白")
    emotion = shot.get("emotion", "平静")

    # 选择音色和语速
    voice = VOICE_MAP.get(character, "alloy")
    speed = SPEED_MAP.get(emotion, 1.0)

    # 清理对话文本（去掉角色名前缀）
    clean_text = re.sub(r'^\w+（[^）]+）\s*[:：]?\s*', '', dialogue)
    clean_text = clean_text.strip('"').strip("'")

    # 生成文件名
    shot_id = shot.get("shot_id", 1)
    filename = f"{output_dir}{shot_id:03d}_{character}.mp3"

    print(f"  [{voice}] {clean_text[:25]}... @ {speed}x")
    text_to_speech(clean_text, voice=voice, speed=speed, output_path=filename)
    return filename


def generate_full_audio(shots: list[dict], output_dir: str = "assets/audio/") -> list[str]:
    """为所有分镜生成配音"""
    os.makedirs(output_dir, exist_ok=True)
    audio_files = []

    for i, shot in enumerate(shots):
        shot["shot_id"] = i + 1
        dialogue = shot.get("dialogue", "")
        if not dialogue:
            continue

        print(f"[{i+1}/{len(shots)}] 配音: {shot.get('character', '?')}")
        try:
            path = generate_voice_for_shot(shot, output_dir)
            if path:
                audio_files.append(path)
        except Exception as e:
            print(f"  ✗ 失败: {e}")

        time.sleep(0.3)  # 避免限流

    return audio_files


if __name__ == "__main__":
    # 测试
    test_shots = [
        {"character": "小明", "dialogue": "又一个深夜，代码还没写完……", "emotion": "疲惫"},
        {"character": "小明", "dialogue": "什么？这是什么意思？", "emotion": "震惊"},
        {"character": "旁白", "dialogue": "门缓缓打开了。", "emotion": "神秘"},
    ]
    files = generate_full_audio(test_shots)
    print(f"\n共生成 {len(files)} 段音频")
```

---

## 四、音频后处理

### 统一响度

不同音频的音量可能不一致，使用 FFmpeg 标准化：

```python
def normalize_audio(audio_path: str, output_path: str = None) -> str:
    """统一音频响度到 -14 LUFS（视频平台标准）"""
    if output_path is None:
        output_path = audio_path.replace(".mp3", "_norm.mp3")

    import subprocess
    cmd = [
        "ffmpeg", "-i", audio_path,
        "-af", "loudnorm=I=-14:TP=-1.0:LRA=11",
        "-y", output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path
```

### 合并同角色音频

同一角色的连续对话可以合并为一段音频，减少文件数量：

```python
def merge_character_audio(
    shots: list[dict],
    output_dir: str = "assets/audio/"
) -> dict[str, str]:
    """
    将同角色的对话合并为单段音频

    返回: {角色名: 合并后的音频路径}
    """
    import subprocess

    character_audios = {}

    for shot in shots:
        char = shot.get("character", "旁白")
        if not char or char == "无":
            continue

        if char not in character_audios:
            character_audios[char] = []

        dialogue = shot.get("dialogue", "")
        if dialogue:
            # 生成并加入列表
            shot_id = shot.get("shot_id", len(character_audios[char]) + 1)
            temp_path = f"{output_dir}temp_{char}_{shot_id}.mp3"
            generate_voice_for_shot(shot, output_dir)
            character_audios[char].append(temp_path)

    # 合并每个角色的音频
    merged = {}
    for char, paths in character_audios.items():
        if len(paths) == 1:
            merged[char] = paths[0]
            continue

        # 创建文件列表
        list_file = f"{output_dir}{char}_list.txt"
        with open(list_file, "w") as f:
            for p in paths:
                f.write(f"file '{p}'\n")

        # 合并
        output = f"{output_dir}{char}_combined.mp3"
        cmd = [
            "ffmpeg", "-f", "concat", "-safe", "0",
            "-i", list_file, "-c", "copy", "-y", output
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        merged[char] = output

    return merged
```

---

## 五、本章小结

| 要点 | 说明 |
|------|------|
| 音色映射 | 为每个角色固定一个音色 |
| 语速调整 | 根据情绪调整语速（0.8-1.2x）|
| 文本清理 | 去掉角色名前缀，只保留台词 |
| 响度统一 | 标准化音量，符合视频平台标准 |

---

*下节课：[第 14 课：口型同步](lesson-14.md)*
