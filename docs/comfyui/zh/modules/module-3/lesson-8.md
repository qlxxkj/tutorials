# 第 8 课：理解节点与连线

> 📌 **学习目标**：深入理解 ComfyUI 的数据流原理，能够读懂和调试工作流
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：数据流原理 → 端口类型 → 常见连线错误 → 调试技巧

---

## 一、ComfyUI 的数据流模型

ComfyUI 的核心思想是**数据流**：每个节点接收输入数据，处理后输出新数据。

```
输入数据 ──→ [节点A] ──→ 中间数据 ──→ [节点B] ──→ 输出数据
   │                               │
   └────────── 连线 ───────────────┘
```

### 数据的四种类型

| 类型 | 颜色 | 含义 | 示例 |
|------|------|------|------|
| **MODEL** | 蓝色 | AI 模型 | Checkpoint、LoRA |
| **CLIP** | 浅蓝 | 文本编码器 | CLIP Text Encode 输出 |
| **LATENT** | 黄色 | 潜在空间数据 | KSampler 输出、Empty Latent |
| **IMAGE** | 绿色 | 像素图像 | VAE Decode 输出、Save Image |

**理解这一点很重要**：不同类型的线不能乱连，连错了节点不会报错但会静默失败。

---

## 二、常见节点详解

### 2.1 Checkpoint Loader

```
输入：无
输出：MODEL, CLIP, VAE

作用：加载主模型，提供模型、文本编码器和解码器
```

### 2.2 CLIP Text Encode

```
输入：clip（来自 Checkpoint Loader）
输出：conditioning（条件数据）

作用：将文字提示词编码为 AI 能理解的特征向量
有两个实例：一个填正提示词，一个填负提示词
```

### 2.3 Empty Latent Image

```
输入：无
输出：latent（潜在空间）

作用：创建一个空白的"画布"，设定图片的尺寸
Width/Height: 图片分辨率
Batch Size: 一次生成几张
```

### 2.4 KSampler（核心节点）

```
输入：
  model         ← Checkpoint Loader
  positive      ← 正提示词 CLIP
  negative      ← 负提示词 CLIP
  latent_image  ← Empty Latent Image

输出：latent（去噪后的潜在空间数据）

作用：执行去噪过程，从随机噪声逐步生成图片特征
```

**KSampler 内部流程：**
```
随机噪声(latent) 
  → 根据提示词条件不断去噪(steps次)
  → 得到包含图片信息的latent
```

### 2.5 VAE Decode

```
输入：
  samples   ← KSampler 输出的 latent
  vae       ← Checkpoint Loader 提供的 VAE

输出：IMAGE（实际的像素图片）

作用：将潜在空间数据解码为人类可见的图片
```

### 2.6 Save Image

```
输入：IMAGE
输出：无

作用：将图片保存到硬盘
```

---

## 三、连线的正确方式

### 正确连线示例

```
[Checkpoint Loader]
  ├── model ──────→ [KSampler] .model
  ├── CLIP ───────→ [CLIP Text Encode] × 2
  └── VAE ────────→ [VAE Decode] .vae

[CLIP Text Encode - 正]
  └── output ─────→ [KSampler] .positive

[CLIP Text Encode - 负]
  └── output ─────→ [KSampler] .negative

[Empty Latent Image]
  └── output ─────→ [KSampler] .latent_image

[KSampler]
  └── output ─────→ [VAE Decode] .samples

[VAE Decode]
  └── output ─────→ [Save Image] .images
```

### 常见连线错误

| 错误 | 现象 | 原因 |
|------|------|------|
| IMAGE 接到 MODEL 端口 | 无报错但不出图 | 数据类型不匹配 |
| 漏掉负提示词连线 | 生成质量差 | 缺少约束条件 |
| VAE 连错端口 | 颜色异常或报错 | 接了错误的输入 |
| seed 固定不变 | 每次生成一模一样 | 应该设为随机 |

---

## 四、调试技巧

### 4.1 检查连线颜色

```
正确的连线应该显示颜色：
- 蓝色线 = MODEL 数据 ✓
- 绿色线 = IMAGE 数据 ✓
- 黄色线 = LATENT 数据 ✓
- 橙色线 = CONDITIONING 数据 ✓

灰色线 = 未连接（需要处理）
```

### 4.2 悬停查看端口类型

将鼠标悬停在节点的输入/输出端口上，会显示：
- 端口名称
- 数据类型（MODEL/IMAGE/LATENT/CLIP）
- 当前连接状态

### 4.3 使用快捷操作

```
右键节点 → Connect All / Disconnect All
  - 一键连接所有兼容的端口
  - 一键断开所有连线

Ctrl+Z：撤销上一步操作
Ctrl+A：全选节点
Delete：删除选中的节点
```

### 4.4 保存和加载工作流

```
保存：菜单 → Workflow → Save
  → 导出为 .json 文件，包含完整的节点配置和参数

加载：菜单 → Workflow → Load
  → 导入之前保存的工作流

分享：将 .json 文件发给别人，对方导入后可以直接使用
```

---

## 五、读取别人分享的工作流

ComfyUI 最大的优势之一是工作流可以共享：

```
步骤：
1. 从 CivitAI 或其他地方下载 .json 工作流文件
2. 在 ComfyUI 中：菜单 → Workflow → Load
3. 选择下载的 .json 文件
4. 工作流会自动加载，所有节点和连线都会还原
5. 如果有缺失的模型，ComfyUI 会提示你下载
```

**注意：** 别人的工作流可能需要特定的模型或节点，如果运行报错：
- 检查是否安装了所需的自定义节点
- 检查是否有缺失的模型文件
- 根据提示安装缺失项

---

## 六、本章小结

| 要点 | 说明 |
|------|------|
| 数据类型 | MODEL(蓝)/CLIP(浅蓝)/LATENT(黄)/IMAGE(绿)，不能混连 |
| 核心流程 | 提示词 → CLIP → KSampler → VAE Decode → 图片 |
| KSampler | 最关键节点，控制采样步数、CFG、种子等 |
| 连线检查 | 颜色对应数据类型，灰色表示未连接 |
| 工作流共享 | 保存为 .json，别人可以直接加载使用 |

---

*下节课：[第 9 课：常用参数详解](lesson-9.md)*
