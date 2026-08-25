# 第 9 课：分镜脚本解析

> 📌 **学习目标**：将 Markdown 剧本自动解析为结构化数据，供后续环节使用
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：解析原理 → 正则实现 → 代码落地

---

## 一、为什么需要解析？

LLM 生成的剧本是自由格式的 Markdown 文本。

但我们的后续流程（生成图片、生成配音）需要的是**结构化数据**：

```
剧本文本 ──解析──→ [
  {镜头1数据},
  {镜头2数据},
  ...
]
```

---

## 二、解析策略

### 策略对比

| 策略 | 优点 | 缺点 | 适用 |
|------|------|------|------|
| **正则表达式** | 快速、无依赖 | 格式必须固定 | 格式规范的剧本 |
| **LLM 二次解析** | 容错性强 | 多一次 API 调用 | 格式不统一的剧本 |
| **混合方案** | 又快又准 | 代码稍复杂 | 生产环境 |

**本课采用混合方案：正则为主，LLM 兜底。**

---

## 三、正则解析实现

```python
# scripts/extract_shots.py
import re
from typing import list, dict


def parse_script_to_shots(script_text: str) -> list[dict]:
    """
    将 Markdown 剧本文本解析为分镜列表

    支持的剧本格式：
    【场景 N - 地点·时间】
    镜头角度：xxx
    画面描述：xxx
    角色：xxx
    情绪：xxx
    对话/旁白："xxx"

    返回:
    [
        {
            "shot_id": 1,
            "scene": "室内·办公室·夜",
            "angle": "中景",
            "description": "灯光昏暗的办公室...",
            "character": "小明",
            "emotion": "疲惫",
            "dialogue": "又一个深夜...",
            "type": "dialogue"  # 或 "narration"
        }
    ]
    """
    shots = []
    lines = script_text.split("\n")
    current_shot: dict = {}
    shot_counter = 0

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # 检测场景标题
        scene_match = re.match(r'【场景\s*(\d*)\s*[-—:：]\s*(.+?)】', line)
        if scene_match:
            # 保存上一个镜头
            if current_shot.get("description"):
                current_shot["shot_id"] = shot_counter + 1
                shots.append(current_shot)
                shot_counter += 1
            current_shot = {"scene": scene_match.group(2).strip()}
            i += 1
            continue

        # 检测镜头角度
        angle_match = re.match(r'镜头角度[：:]\s*(.+)', line)
        if angle_match and current_shot:
            current_shot["angle"] = angle_match.group(1).strip()
            i += 1
            continue

        # 检测画面描述
        desc_match = re.match(r'画面描述[：:]\s*(.+)', line)
        if desc_match and current_shot:
            current_shot["description"] = desc_match.group(1).strip()
            i += 1
            continue

        # 检测角色
        char_match = re.match(r'角色[：:]\s*(.+)', line)
        if char_match and current_shot:
            current_shot["character"] = char_match.group(1).strip()
            i += 1
            continue

        # 检测情绪
        emotion_match = re.match(r'情绪[：:]\s*(.+)', line)
        if emotion_match and current_shot:
            current_shot["emotion"] = emotion_match.group(1).strip()
            i += 1
            continue

        # 检测对话/旁白
        dialogue_match = re.match(r'(对话|旁白)[：:"\s]*(.+?)["\s]*$', line)
        if dialogue_match and current_shot:
            dtype = dialogue_match.group(1)
            text = dialogue_match.group(2).strip().strip('"').strip("'")
            current_shot["dialogue"] = text
            current_shot["type"] = "dialogue" if dtype == "对话" else "narration"
            i += 1
            continue

        # 检测结尾字幕
        if "结尾" in line or "黑屏" in line:
            current_shot["is_ending"] = True

        i += 1

    # 保存最后一个镜头
    if current_shot.get("description"):
        current_shot["shot_id"] = shot_counter + 1
        shots.append(current_shot)

    return shots


def extract_characters(script_text: str) -> list[str]:
    """从剧本中提取所有角色名"""
    characters = set()
    for match in re.finditer(r'角色[：:]\s*([^,\n]+)', script_text):
        name = match.group(1).strip().split("（")[0].split("(")[0]
        if name and name != "无":
            characters.add(name)
    return list(characters)


if __name__ == "__main__":
    test_script = """【场景 1 - 室内·客厅·夜】
    镜头角度：中景
    画面描述：灯光昏暗的客厅，窗外下雨
    角色：小明
    情绪：疲惫
    旁白："又一个深夜……"

    【场景 2 - 特写·电脑屏幕】
    镜头角度：固定
    画面描述：屏幕上的光标闪烁
    角色：无
    情绪：焦虑
    对话："还有三行……"
    """
    shots = parse_script_to_shots(test_script)
    for shot in shots:
        print(f"镜头{shot['shot_id']}: {shot.get('description', '')[:30]}")
        print(f"  角色={shot.get('character')}, 情绪={shot.get('emotion')}")
        print(f"  对话={shot.get('dialogue')}")
        print()
```

---

## 四、测试与验证

```bash
python scripts/extract_shots.py
```

期望输出：

```
镜头1: 灯光昏暗的客厅，窗外下雨
  角色=小明, 情绪=疲惫
  对话=又一个深夜……

镜头2: 屏幕上的光标闪烁
  角色=无, 情绪=焦虑
  对话=还有三行……
```

---

## 五、容错处理

LLM 生成的剧本格式可能不完全规范。增加容错逻辑：

```python
def parse_script_to_shots_robust(script_text: str) -> list[dict]:
    """增强版：容错解析"""
    shots = []
    lines = script_text.split("\n")
    current_shot = {}

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 容错：支持多种分隔符
        if re.match(r'【.*场景.*】', line):
            if current_shot.get("description"):
                shots.append(current_shot)
            current_shot = {}
            continue

        # 容错：忽略字段名前的空格
        for prefix in ["镜头角度", "画面描述", "角色", "情绪"]:
            match = re.match(rf'{prefix}\s*[：:]\s*(.+)', line)
            if match:
                current_shot[prefix.lower().replace("镜头角度", "angle")
                             .replace("画面描述", "description")] = match.group(1).strip()
                break

        # 容错：检测对话或旁白
        match = re.match(r'(?:对话|旁白)\s*[：:"\s]*(.+)', line)
        if match:
            current_shot["dialogue"] = match.group(1).strip().strip('"').strip("'")
            current_shot["type"] = "narration" if "旁白" in line else "dialogue"

    if current_shot.get("description"):
        shots.append(current_shot)

    return shots
```

---

## 六、本章小结

| 步骤 | 操作 | 工具 |
|------|------|------|
| 读取剧本 | 读入 Markdown 文本 | Python `open()` |
| 逐行解析 | 匹配场景/镜头/角色等字段 | 正则表达式 |
| 结构化输出 | 转为 list[dict] | Python dict |
| 容错处理 | 兼容格式偏差 | 增强正则 |

---

*下节课进入[模块四：画面生成](../module-4/lesson-10.md)*
