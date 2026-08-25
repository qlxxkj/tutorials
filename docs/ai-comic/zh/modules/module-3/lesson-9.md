# 第 9 课：分镜脚本解析

> 📌 **学习目标**：将 Markdown 剧本自动解析为结构化分镜数据，理解解析中的难点和容错策略
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：解析原理 → 容错策略 → 镜头拆分算法 → 完整实现

---

## 一、为什么需要自动解析？

剧本生成后，我们需要把它转换成程序可读的结构化数据：

```
Markdown 剧本 ──解析──→ [镜头1, 镜头2, ..., 镜头N]
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                 图像生成    TTS 配音    视频生成
              (GPT-Image)  (OpenAI TTS) (Seedance)
```

解析的质量直接影响后续所有环节。一个字段解析错误，可能导致画面生成失败或配音错乱。

---

## 二、解析难点

### 难点 1：LLM 输出格式不完全一致

即使 Prompt 里给了严格格式，LLM 偶尔会：
- 漏掉某个字段
- 用不同的冒号（英文 `:` 和中文 `：`）
- 在对话前后多加空格或引号
- 把两个镜头合并成一个

### 难点 2：镜头边界判断

剧本中可能用 `【场景 N】` 分隔镜头，但也可能：
- 序号跳号（1, 2, 4 漏了 3）
- 没有序号只有场景名
- 有些段落没有明确的分隔符

### 难点 3：对话中的特殊字符

台词里可能包含引号、冒号、括号，容易干扰正则匹配。

---

## 三、解析策略：正则 + 启发式规则

### 3.1 镜头分隔识别

```python
def split_into_scenes(text: str) -> list[str]:
    """按场景标题拆分剧本为多个场景块"""
    # 匹配 【场景数字 - 内容】 或 【场景 - 内容】
    pattern = r'【场景\s*\d*\s*[-—:：]\s*[^\n】]+】'
    matches = list(re.finditer(pattern, text))

    scenes = []
    for i, match in enumerate(matches):
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        scenes.append(text[start:end].strip())

    # 处理开头没有场景标题的情况
    if matches and matches[0].start() > 0:
        scenes.insert(0, text[:matches[0].start()].strip())

    return [s for s in scenes if s]
```

### 3.2 字段解析（容错版）

```python
def parse_scene_fields(scene_text: str) -> dict:
    """
    从一个场景块中解析各字段，支持多种格式变体

    容错策略：
    - 冒号兼容中英文
    - 字段名前后允许空格
    - 缺失字段使用默认值
    - 对话文本支持引号包裹
    """
    result = {
        'scene': '',
        'angle': '中景',       # 默认
        'description': '',
        'character': '无',     # 默认
        'emotion': '平静',     # 默认
        'dialogue': '',
        'type': 'narration',   # narration / dialogue
        'action': ''
    }

    lines = scene_text.split('\n')

    for line in lines:
        line = line.strip()
        if not line or '】' in line:
            continue

        # 场景标题（已拆分，跳过）
        if line.startswith('【场景'):
            # 提取场景信息
            m = re.match(r'【场景\s*\d*\s*[-—:：]\s*(.+?)】', line)
            if m:
                result['scene'] = m.group(1).strip()
            continue

        # 镜头角度
        m = re.match(r'镜头角度\s*[：:]\s*(.+)', line)
        if m:
            result['angle'] = m.group(1).strip()
            continue

        # 画面描述
        m = re.match(r'画面描述\s*[：:]\s*(.+)', line)
        if m:
            result['description'] = m.group(1).strip()
            continue

        # 角色
        m = re.match(r'角色\s*[：:]\s*(.+)', line)
        if m:
            result['character'] = m.group(1).strip()
            continue

        # 情绪
        m = re.match(r'情绪\s*[：:]\s*(.+)', line)
        if m:
            result['emotion'] = m.group(1).strip()
            continue

        # 对话
        m = re.match(r'对话\s*[：:""\s]*(.+?)(?:[""\s]*)$', line)
        if m:
            result['dialogue'] = m.group(1).strip().strip('"').strip("'")
            result['type'] = 'dialogue'
            continue

        # 旁白
        m = re.match(r'旁白\s*[：:""\s]*(.+?)(?:[""\s]*)$', line)
        if m:
            result['dialogue'] = m.group(1).strip().strip('"').strip("'")
            result['type'] = 'narration'
            continue

        # 动作
        m = re.match(r'动作\s*[：:]\s*(.+)', line)
        if m:
            result['action'] = m.group(1).strip()
            continue

    # 如果画面描述为空，从场景标题中推断
    if not result['description'] and result['scene']:
        result['description'] = f"【{result['scene']}】"

    return result
```

### 3.3 完整解析入口

```python
def parse_script_to_shots(script_text: str) -> list[dict]:
    """
    完整解析流程：
    1. 按场景拆分
    2. 逐场景解析字段
    3. 分配镜头编号
    4. 返回结构化列表
    """
    scenes = split_into_scenes(script_text)
    shots = []

    for scene_text in scenes:
        fields = parse_scene_fields(scene_text)
        if fields['description']:  # 只保留有描述的镜头
            shots.append(fields)

    # 分配编号
    for i, shot in enumerate(shots):
        shot['shot_id'] = i + 1

    return shots
```

---

## 四、高级：一个场景拆成多个镜头

有些复杂的场景描述实际上包含了多个镜头动作。用 LLM 做二次拆分：

```python
def split_complex_shot(shot: dict) -> list[dict]:
    """
    将一个复杂镜头拆分为多个子镜头

    例如："他走进房间，关上门，打开灯，看到桌上放着一封信"
    拆分为：
    1. 走进房间
    2. 关上门
    3. 打开灯
    4. 看到信
    """
    if not shot.get('action'):
        return [shot]

    # 用 LLM 拆分动作序列
    prompt = f"""将以下动作拆分为独立的镜头，每个镜头一句话：

原动作：{shot['action']}
场景：{shot['scene']}
角色：{shot['character']}

请输出 JSON 数组，每个元素包含 action 字段。
只输出 JSON，不要其他内容。"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    actions = json.loads(response.choices[0].message.content)

    # 生成子镜头
    sub_shots = []
    for i, action_item in enumerate(actions):
        sub_shot = shot.copy()
        sub_shot['action'] = action_item.get('action', action_item)
        sub_shot['shot_id'] = shot['shot_id'] + i  # 延续编号
        sub_shots.append(sub_shot)

    return sub_shots
```

---

## 五、解析结果预览

解析完成后，建议做一个快速预览，确认数据正确：

```python
def preview_shots(shots: list[dict]):
    """控制台预览所有分镜"""
    print(f"\n共解析出 {len(shots)} 个镜头\n")
    for shot in shots:
        print(f"─" * 50)
        print(f"【镜头 {shot['shot_id']}】{shot.get('scene', '未知场景')}")
        print(f"  镜头角度: {shot.get('angle', '未指定')}")
        print(f"  画面描述: {shot.get('description', '无')[:50]}...")
        print(f"  角色: {shot.get('character', '无')}")
        print(f"  情绪: {shot.get('emotion', '未指定')}")
        if shot.get('dialogue'):
            dtype = "旁白" if shot['type'] == 'narration' else "对话"
            print(f"  {dtype}: {shot['dialogue'][:40]}...")
        if shot.get('action'):
            print(f"  动作: {shot['action'][:40]}...")
        print()
```

---

## 六、本章小结

| 步骤 | 方法 | 目的 |
|------|------|------|
| 场景拆分 | 正则匹配 `【场景...】` | 定位镜头边界 |
| 字段解析 | 正则提取各字段 | 结构化数据 |
| 容错处理 | 默认值 + 宽松匹配 | 兼容格式偏差 |
| 复杂拆分 | LLM 二次拆分 | 一段动作→多个镜头 |
| 预览校验 | 控制台打印 | 人工确认数据正确 |

---

*下节课进入[模块四：画面生成](../module-4/lesson-10.md)*
