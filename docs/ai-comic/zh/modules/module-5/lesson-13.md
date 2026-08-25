# 第 13 课：TTS 配音生成

> 📌 **学习目标**：掌握多角色 TTS 配音的完整流程，理解音色选择和语速控制
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：TTS 基础 → 多角色配音 → 情绪表达 → 音频后处理

---

## 一、TTS 在漫剧中的角色

配音是 AI 漫剧的"灵魂"。一张再好的画面，配上机械无感情的语音，整体质感会大打折扣。

TTS 环节需要解决三个问题：
1. **谁在说**——不同角色用不同音色
2. **怎么说**——根据情绪调整语速和语调
3. **说到哪**——台词文本的清理和格式化

---

## 二、OpenAI TTS API 基础

### 支持的模型

| 模型 | 特点 | 适用场景 |
|------|------|---------|
| `gpt-4o-mini-tts` | 快速、性价比高 | 日常漫剧配音 |
| `tts-1-hd` | 高质量、更自然 | 对音质要求高的项目 |

### 音色选择

| 音色 | 特点 | 推荐角色 |
|------|------|---------|
| alloy | 中性男声，稳重 | 旁白、年轻男性 |
| onyx | 低沉男声，有磁性 | 反派、神秘角色 |
| echo | 温暖男声 | 叙述者、长辈 |
| fable | 英国女声，优雅 | 知性女性 |
| nova | 明亮女声 | 年轻女性主角 |
| shani | 有力女声 | 强势/干练角色 |

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

# 角色 → 音色映射
VOICE_MAP = {
    "陈默": "alloy",
    "小林": "nova",
    "旁白": "onyx",
    "神秘人": "onyx",
}

# 情绪 → 语速映射
SPEED_MAP = {
    "震惊": 0.8,
    "恐惧": 0.85,
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
    """将文本转换为语音并保存"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice=voice,
        input=text,
        speed=speed,
    )
    response.stream_to_file(output_path)
    return output_path


def generate_voice_for_shot(shot: dict, output_dir: str = "assets/audio/") -> str:
    """为单个分镜生成配音"""
    dialogue = shot.get('dialogue', '')
    if not dialogue:
        return None

    character = shot.get('character', '旁白')
    emotion = shot.get('emotion', '平静')

    # 选择音色和语速
    voice = VOICE_MAP.get(character, 'alloy')
    speed = SPEED_MAP.get(emotion, 1.0)

    # 清理台词（去掉角色名前缀和引号）
    clean_text = re.sub(r'^\w+（[^）]+）\s*[:：]?\s*', '', dialogue)
    clean_text = clean_text.strip('"').strip("'").strip()

    shot_id = shot.get('shot_id', 1)
    filename = f"{output_dir}{shot_id:03d}_{character}.mp3"

    print(f"  [{voice}@{speed}x] {clean_text[:25]}...")
    text_to_speech(clean_text, voice=voice, speed=speed, output_path=filename)
    return filename


def generate_full_audio(shots: list[dict], output_dir: str = "assets/audio/") -> list[str]:
    """为所有分镜批量生成配音"""
    os.makedirs(output_dir, exist_ok=True)
    audio_files = []

    for i, shot in enumerate(shots):
        shot['shot_id'] = i + 1
        dialogue = shot.get('dialogue', '')
        if not dialogue:
            continue

        print(f"[{i+1}/{len(shots)}] 配音: {shot.get('character', '?')}")
        try:
            path = generate_voice_for_shot(shot, output_dir)
            if path:
                audio_files.append(path)
        except Exception as e:
            print(f"  ✗ 失败: {e}")

        time.sleep(0.3)

    return audio_files
```

---

## 四、用标点符号控制情感表达

TTS 模型会自然响应文本中的标点符号和语气词：

| 文本 | 效果 |
|------|------|
| `"什么？"` | 短暂停顿，表示疑问 |
| `"你到底是谁……"` | 拖长尾音，表示不确定/恐惧 |
| `"不——！"` | 破折号产生拉伸效果 |
| `"快跑！！!"` | 多个感叹号增强紧迫感 |
| `"……我知道了。"` | 省略号产生沉默感 |

---

## 五、音频后处理

### 5.1 统一响度

```python
def normalize_audio(audio_path: str, output_path: str = None) -> str:
    """使用 FFmpeg 统一音频响度到 -14 LUFS（视频平台标准）"""
    if output_path is None:
        output_path = audio_path.replace('.mp3', '_norm.mp3')

    import subprocess
    cmd = [
        'ffmpeg', '-i', audio_path,
        '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11',
        '-y', output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path
```

### 5.2 合并同角色连续对话

```python
def merge_character_dialogues(
    shots: list[dict],
    output_dir: str = "assets/audio/"
) -> dict[str, str]:
    """
    将同一角色的连续对话合并为单段音频
    减少文件数量，方便后续对齐
    """
    import subprocess

    character_audios = {}

    for shot in shots:
        char = shot.get('character', '旁白')
        if not char or char == '无':
            continue

        dialogue = shot.get('dialogue', '')
        if not dialogue:
            continue

        if char not in character_audios:
            character_audios[char] = []

        shot_id = shot.get('shot_id', len(character_audios[char]) + 1)
        temp_path = f"{output_dir}temp_{char}_{shot_id}.mp3"
        generate_voice_for_shot(shot, output_dir)
        character_audios[char].append(temp_path)

    # 合并每个角色的音频
    merged = {}
    for char, paths in character_audios.items():
        if len(paths) == 1:
            merged[char] = paths[0]
            continue

        list_file = f"{output_dir}{char}_list.txt"
        with open(list_file, 'w') as f:
            for p in paths:
                f.write(f"file '{p}'\n")

        output = f"{output_dir}{char}_combined.mp3"
        cmd = [
            'ffmpeg', '-f', 'concat', '-safe', '0',
            '-i', list_file, '-c', 'copy', '-y', output
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        merged[char] = output

    return merged
```

---

## 六、本章小结

| 要点 | 说明 |
|------|------|
| 音色映射 | 每个角色固定一个音色 |
| 语速调整 | 根据情绪微调（0.8-1.15x） |
| 标点控制 | 用省略号和破折号引导 TTS 情感 |
| 响度统一 | 标准化到 -14 LUFS |

---

*下节课：[第 14 课：视频生成（多图参考）](lesson-14.md)*
