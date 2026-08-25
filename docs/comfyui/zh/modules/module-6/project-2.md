# 项目二：建立风格模板库

> 📌 **学习目标**：建立可复用的风格模板，大幅提升生产效率
> ⏱️ **预计时长**：30 分钟
> 🎯 **本节节奏**：模板分类 → 模板制作 → 模板管理 → 使用规范

---

## 一、为什么要建立模板库？

每次从零搭建工作流很浪费时间。建立模板库后：

```
第一次：花 30 分钟搭建工作流
之后：每次只需 30 秒加载模板，改改提示词就能出图
```

---

## 二、模板分类

### 按用途分类

| 模板类型 | 用途 | 关键组件 |
|---------|------|---------|
| **角色设定模板** | 生成角色参考图 | IP-Adapter + 中性表情 |
| **动漫风格模板** | 通用动漫画风 | RevAnimated + 动漫提示词 |
| **写实风格模板** | 真实感画面 | RealisticVision + 写实提示词 |
| **特写模板** | 面部特写镜头 | 小尺寸 + 高 CFG |
| **全景模板** | 环境展示镜头 | 大尺寸 + 宽视角 |

### 按系列分类

```
模板库结构：
workflows/
├── character-sheet/      ← 角色设定模板
│   ├── anime_char.json
│   └── realistic_char.json
├── comic-pannel/         ← 漫画分镜模板
│   ├── suspense.json     ← 悬疑风格
│   ├── romance.json      ← 爱情风格
│   └── comedy.json       ← 喜剧风格
├── close-up/             ← 特写镜头模板
├── wide-shot/            ← 远景镜头模板
└── upscaled/             ← 放大后处理模板
```

---

## 三、制作动漫风格模板

### 基础动漫模板

```json
{
  "checkpoint": "RevAnimated_v3.safetensors",
  "size": {"width": 768, "height": 1024},
  "sampler": "euler_ancestral",
  "scheduler": "normal",
  "steps": 28,
  "cfg": 7.5,
  "ip_adapter": {
    "model": "ip-adapter-faceid-plusv2",
    "weight": 0.85
  },
  "negative_prompt": "low quality, blurry, bad anatomy, watermark, text, bad hands, extra fingers"
}
```

### 悬疑风格模板

在基础模板上增加：
```
lighting: dramatic shadows, high contrast
mood: mysterious, tense
colors: dark blues, blacks, reds
additional_negative: bright, cheerful, colorful
```

### 爱情风格模板

在基础模板上增加：
```
lighting: warm, soft, golden hour
mood: romantic, gentle
colors: pinks, warm tones, soft lighting
additional_negative: dark, scary, violent
```

---

## 四、模板的使用规范

### 使用流程

```
1. 打开 ComfyUI
2. 菜单 → Workflow → Load → 选择对应模板
3. 上传角色参考图（如已有）
4. 修改提示词中的场景和动作描述
5. 保持其他参数不变
6. Queue Prompt 生成
```

### 模板变更记录

```
版本 1.0（2026-01-15）：
  - 基础动漫模板
  - 悬疑/爱情/喜剧三个风格变体
  
版本 1.1（2026-02-01）：
  - 新增放大后处理模块
  - 优化 IP-Adapter 参数
  
版本 1.2（2026-03-15）：
  - 新增 ControlNet 姿势控制模板
  - 添加 ADetailer 人脸修复
```

---

## 五、本章小结

| 要点 | 说明 |
|------|------|
| 模板分类 | 按用途和系列两个维度组织 |
| 核心模板 | 角色设定、动漫风格、悬疑/爱情/喜剧 |
| 变更管理 | 记录每次修改，方便回退 |
| 使用规范 | 加载模板 → 改提示词 → 生成 |

---

*下个项目：[项目三：批量并行生产](project-3.md)*
