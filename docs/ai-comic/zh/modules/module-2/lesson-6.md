# 第 6 课：项目结构规划

> 📌 **学习目标**：建立清晰的项目目录结构，理解各模块职责
> ⏱️ **预计时长**：15 分钟
> 🎯 **本节节奏**：结构设计 → 模块划分 → 数据流梳理

---

## 一、推荐项目结构

```
ai-comic-maker/
│
├── .env                      # API Key（不提交 Git）
├── .gitignore                # 排除敏感文件
├── requirements.txt          # Python 依赖
├── README.md                 # 项目说明
│
├── scripts/                  # 核心脚本
│   ├── __init__.py
│   ├── main.py               # 主入口（一键生成）
│   ├── write_script.py       # 剧本生成
│   ├── create_characters.py  # 角色设定
│   ├── extract_shots.py      # 分镜解析
│   ├── generate_shots.py     # 画面生成
│   ├── generate_voice.py     # 配音生成
│   ├── lip_sync.py           # 口型同步
│   └── compose_video.py      # 视频合成
│
├── assets/                   # 中间产物（可提交 Git）
│   ├── characters/           # 角色参考图
│   │   └── hero.png
│   ├── shots/                # 分镜画面
│   │   ├── shot_001.png
│   │   ├── shot_002.png
│   │   └── ...
│   └── audio/                # 音频文件
│       ├── 01_hero.mp3
│       ├── 02_narrator.mp3
│       └── ...
│
├── output/                   # 最终产物
│   ├── script.md             # 生成的剧本
│   └── final.mp4             # 最终视频
│
└── tests/                    # 测试文件
    └── test_api.py
```

---

## 二、各模块职责说明

### scripts/write_script.py
**职责**：接收故事主题，输出 Markdown 格式的分镜剧本

**输入**：
- `topic: str` — 故事主题
- `episodes: int` — 集数
- `style: str` — 风格（悬疑/爱情/喜剧等）

**输出**：
- 返回字符串：Markdown 格式的剧本

**核心逻辑**：
```python
def write_script(topic: str, episodes: int = 1, style: str = "悬疑") -> str:
    # 构造 Prompt → 调用 GPT-4o → 返回剧本文本
    ...
```

---

### scripts/create_characters.py
**职责**：为剧本中的角色生成参考图

**输入**：
- `name: str` — 角色名
- `description: str` — 外貌描述
- `style: str` — 画风

**输出**：
- 返回字典：`{"image_url": "...", "path": "assets/characters/hero.png"}`

**核心逻辑**：
```python
def generate_character_art(name, description, style) -> dict:
    # 构建 Prompt → 调用 GPT-Image-1 → 下载保存图片
    ...
```

---

### scripts/extract_shots.py
**职责**：将剧本文本解析为结构化分镜列表

**输入**：
- `script_text: str` — Markdown 剧本

**输出**：
- 返回列表：每个元素是一个分镜字典

**核心逻辑**：
```python
def parse_script_to_shots(script_text: str) -> list[dict]:
    # 正则解析 → 提取场景/镜头/角色/对话/情绪
    ...
```

---

### scripts/generate_shots.py
**职责**：为每个分镜生成画面图片

**输入**：
- `shots: list[dict]` — 分镜列表
- `character_ref: str` — 角色参考图路径

**输出**：
- 返回列表：图片文件路径

**核心逻辑**：
```python
def batch_generate_shots(shots, character_ref) -> list[str]:
    # 循环每个分镜 → 构建 Prompt → 调用 API → 保存图片
    ...
```

---

### scripts/generate_voice.py
**职责**：为每段对话生成 TTS 音频

**输入**：
- `shots: list[dict]` — 分镜列表

**输出**：
- 返回列表：音频文件路径

**核心逻辑**：
```python
def generate_full_audio_shots(shots) -> list[str]:
    # 提取对话 → 按角色选择音色 → 调用 TTS API → 保存音频
    ...
```

---

### scripts/compose_video.py
**职责**：将所有素材合成为最终视频

**输入**：
- `image_paths: list[str]` — 图片路径列表
- `audio_files: list[str]` — 音频路径列表
- `output_path: str` — 输出视频路径

**输出**：
- 生成的视频文件路径

**核心逻辑**：
```python
def compose_final_video(images, audios, output_path):
    # 图片序列 → 拼接 → 叠加音频 → 添加字幕 → 输出 MP4
    ...
```

---

## 三、数据流总图

```
                    ┌──────────────────┐
                    │  topic: str      │
                    └────────┬─────────┘
                             │
              ┌──────────────▼──────────────┐
              │      write_script.py        │
              │   (GPT-4o → Markdown)       │
              └──────────────┬──────────────┘
                             │ script.md
              ┌──────────────▼──────────────┐
              │     extract_shots.py        │
              │   (正则解析 → list[dict])    │
              └──────────────┬──────────────┘
                    ┌────────┴────────┐
                    │                 │
        ┌───────────▼───┐    ┌────────▼──────────┐
        │create_chars.py│    │generate_voice.py  │
        │(GPT-Image-1)  │    │(OpenAI TTS)       │
        └───────┬───────┘    └────────┬──────────┘
                │                     │
        ┌───────▼─────────────────────▼───────┐
        │       generate_shots.py              │
        │   (GPT-Image-1 × N shots)            │
        └───────────────┬─────────────────────┘
                        │
              ┌─────────▼─────────┐
              │   compose_video.py │
              │  (FFmpeg 合成)      │
              └─────────┬─────────┘
                        │
                 ┌──────▼──────┐
                 │  final.mp4  │
                 └─────────────┘
```

---

## 四、本章小结

| 模块 | 输入 | 输出 | 核心 API |
|------|------|------|---------|
| write_script | 主题 | 剧本文本 | GPT-4o Chat |
| create_characters | 角色描述 | 参考图 | GPT-Image-1 |
| extract_shots | 剧本 | 分镜列表 | 正则解析 |
| generate_shots | 分镜 + 角色图 | 分镜图 | GPT-Image-1 |
| generate_voice | 分镜 | 音频 | OpenAI TTS |
| compose_video | 图片 + 音频 | MP4 | FFmpeg |

---

*下节课进入[模块三：剧本创作](../module-3/lesson-7.md)*
