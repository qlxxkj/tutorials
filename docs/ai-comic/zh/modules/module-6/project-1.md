# 项目一：制作第一部 AI 漫剧

> 📌 **学习目标**：综合运用前面所有技能，独立完成一部完整的 AI 漫剧
> ⏱️ **预计时长**：60 分钟
> 🎯 **本节节奏**：需求分析 → 分步实现 → 运行验证

---

## 一、项目目标

制作一部 **1-2 分钟**的悬疑风格 AI 漫剧，包含：
- 15-20 个分镜画面
- 3-5 个角色的配音
- 字幕和背景音乐
- 最终输出 MP4 视频

---

## 二、项目计划

```
Step 1: 确定故事 → 10 分钟
Step 2: 生成剧本 → 5 分钟
Step 3: 生成角色参考图 → 10 分钟
Step 4: 生成分镜画面 → 15 分钟
Step 5: 生成配音 → 10 分钟
Step 6: 合成视频 → 10 分钟
```

---

## 三、分步实现

### Step 1：确定故事

选择你的故事主题。以下是一些灵感：

| 主题 | 风格 | 亮点 |
|------|------|------|
| 程序员深夜加班发现异常代码 | 悬疑/科幻 | 技术背景容易共鸣 |
| 外卖员送错地址进入神秘房间 | 悬疑/奇幻 | 日常场景中的意外 |
| 两个陌生人在电梯里相遇 | 爱情/悬疑 | 空间封闭，张力强 |
| 一只猫视角的都市冒险 | 喜剧/治愈 | 轻松可爱，传播性强 |

**推荐选择**：先从简单的单场景故事开始，比如"程序员深夜加班"。

---

### Step 2：运行完整流程

创建 `.env` 文件（参考 `.env.example`），然后运行：

```bash
# 一键生成
python scripts/main.py --topic "程序员深夜加班发现神秘代码" --style anime
```

脚本会自动执行以下步骤：

1. **剧本生成** → 调用 GPT-4o
2. **角色设定** → 调用 GPT-Image-1
3. **分镜解析** → Python 正则解析
4. **画面生成** → 批量调用 GPT-Image-1
5. **配音生成** → 调用 OpenAI TTS
6. **视频合成** → FFmpeg 拼接

---

### Step 3：检查结果

生成完成后，查看输出目录：

```bash
ls output/
# script.md        # 生成的剧本
# final.mp4        # 最终视频
```

打开 `final.mp4` 预览效果。

---

### Step 4：调整优化

如果效果不满意，可以针对性调整：

| 问题 | 调整方法 |
|------|---------|
| 画面质量差 | 优化 Prompt，增加细节描述 |
| 角色不一致 | 重新生成角色参考图，检查 seed |
| 配音不自然 | 调整语速、添加标点表达情绪 |
| 画面时长不对 | 检查音频时长，调整图片显示时间 |
| 视频闪烁 | 确保帧率一致，使用 `-tune stillimage` |

---

## 四、完整代码速查

如果你不想用 `main.py`，也可以分步执行：

```python
# 1. 生成剧本
from scripts.write_script import write_script
script = write_script("程序员深夜加班发现神秘代码")

# 2. 解析分镜
from scripts.extract_shots import parse_script_to_shots
shots = parse_script_to_shots(script)

# 3. 生成角色
from scripts.create_characters import generate_character_reference
char_ref = generate_character_reference("主角", "25岁男性程序员", "anime")

# 4. 生成画面
from scripts.generate_shots import batch_generate_shots
images = batch_generate_shots(shots, char_ref["path"])

# 5. 生成配音
from scripts.generate_voice import generate_full_audio
audios = generate_full_audio(shots)

# 6. 合成视频
from scripts.compose_video import compose_final_video
compose_final_video(images, audios, "output/final.mp4")
```

---

## 五、本章小结

| 阶段 | 工具 | 时间 |
|------|------|------|
| 构思 | 你的创意 | 10min |
| 剧本 | GPT-4o | 5min |
| 角色 | GPT-Image-1 | 10min |
| 画面 | GPT-Image-1 × 20 | 15min |
| 配音 | OpenAI TTS | 10min |
| 合成 | FFmpeg | 10min |
| **总计** | | **~60min** |

---

*下个项目：[项目二：批量生产系列短剧](project-2.md)*
