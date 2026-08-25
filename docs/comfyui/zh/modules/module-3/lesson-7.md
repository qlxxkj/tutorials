# 第 7 课：第一个工作流——文生图

> 📌 **学习目标**：搭建并运行第一个完整的文生图工作流
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：节点搭建 → 参数理解 → 首次生成 → 结果调整

---

## 一、搭建第一步：加载模型

### 添加 Checkpoint Loader

```
1. 按 Tab 键，搜索 "Checkpoint Loader"
2. 点击添加到画布
3. 点击模型下拉菜单，选择你下载的模型
   （如果没有显示，点击节点旁的刷新按钮）
```

### 查看节点信息

点击 Checkpoint Loader 节点后，右侧面板会显示：

```
Model Path: models/checkpoints/RevAnimated_v3.safetensors
CLIP: [自动加载]
VAE: [自动加载]
```

> 提示：Checkpoint Loader 是一个"一站式"节点，同时加载了模型、CLIP 和 VAE，不用分别添加。

---

## 二、添加提示词输入

### 正提示词（Positive Prompt）

```
1. 按 Tab，搜索 "CLIP Text Encode"
2. 添加两个（正提示词和负提示词各一个）
3. 第一个是正提示词（想要什么），第二个是负提示词（不想要什么）
```

**正提示词示例：**
```
1girl, long black hair, school uniform, sitting at desk,
looking at computer screen, tired expression,
anime style, detailed face, cinematic lighting
```

**负提示词示例：**
```
low quality, blurry, bad anatomy, watermark, text,
bad hands, extra fingers, mutated hands
```

---

## 三、设置图片尺寸

### 添加 Empty Latent Image

```
1. 按 Tab，搜索 "Empty Latent Image"
2. 添加到画布
3. 调整参数：
   - Width: 512（或 768）
   - Height: 768（或 1024）
   - Batch Size: 1
```

**尺寸建议：**
| 用途 | 宽度 | 高度 |
|------|------|------|
| 手机端预览 | 512 | 768 |
| 标准漫剧分镜 | 768 | 1024 |
| 高清输出 | 1024 | 1024 |
| 宽屏海报 | 1024 | 768 |

---

## 四、核心：KSampler 节点

### 添加 KSampler

```
1. 按 Tab，搜索 "KSampler"
2. 添加到画布
3. 连接各个输入端口
```

### 连接方式

```
Checkpoint Loader.model ──────→ KSampler.model
CLIP Text Encode(正).output ──→ KSampler.positive
CLIP Text Encode(负).output ──→ KSampler.negative
Empty Latent Image.output ────→ KSampler.latent_image
```

### KSampler 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| **seed** | 随机数 | 控制生成结果的随机性，相同 seed 产生相同结果 |
| **steps** | 20-30 | 采样步数，越多越精细但越慢 |
| **cfg** | 7-8 | 提示词遵循度，越高越贴合提示词 |
| **sampler_name** | euler_ancestral | 采样算法，euler_ancestral 质量最好 |
| **scheduler** | normal | 调度器，一般用 normal 即可 |
| **denoise** | 1.0 | 去噪强度，1.0 表示从纯噪声开始 |

**新手建议配置：**
```
steps: 28
cfg: 7.5
sampler: euler_ancestral
scheduler: normal
seed: 随机（每次自动生成不同的）
```

---

## 五、解码与保存

### 添加 VAE Decode

```
1. 按 Tab，搜索 "VAE Decode"
2. 连接：
   KSampler.output ────────→ VAE Decode.latent
   Checkpoint Loader.vae ──→ VAE Decode.vae
```

### 添加 Save Image

```
1. 按 Tab，搜索 "Save Image"
2. 连接：
   VAE Decode.output ─────→ Save Image.image
```

---

## 六、完整连线图

```
┌─────────────────┐     ┌──────────────┐
│ CLIP Text Encode│────→│              │
│   (正提示词)     │     │              │
└─────────────────┘     │              │
                        │   KSampler   │
┌─────────────────┐     │              │
│ CLIP Text Encode│────→│              │
│   (负提示词)     │     │              │
└─────────────────┘     │              │
                        │              │
┌─────────────────┐     │              │
│   Empty Latent  │────→│              │
│    Image       │     │              │
└─────────────────┘     └──────┬───────┘
                               │
                       ┌───────▼────────┐
                       │  VAE Decode    │
                       └───────┬────────┘
                               │
                       ┌───────▼────────┐
                       │  Save Image    │
                       └────────────────┘
                               
  (Checkpoint Loader 的 model/vae 端口分别连接到 KSampler 和 VAE Decode)
```

---

## 七、开始生成

```
1. 确认所有节点已正确连接（端口颜色不为灰色）
2. 在正提示词框输入你的描述
3. 点击顶部菜单 "Queue Prompt"
4. 或按快捷键 Ctrl+Enter
5. 等待生成（右侧显示进度条）
6. 生成的图片出现在 Save Image 节点的输出端口
7. 右键图片 → "Save Image" 保存到本地
```

---

## 八、调整技巧

### 8.1 不满意怎么办？

**方案 A：换个种子**
```
把 KSampler 的 seed 改为一个随机数，重新生成
```

**方案 B：改提示词**
```
在正/负提示词中调整描述，比如：
- 不满意表情 → 修改 emotion 关键词
- 不满意构图 → 修改 camera angle 关键词
- 不满意画质 → 添加 quality keywords
```

**方案 C：调整参数**
```
- 画面太乱 → 提高 cfg 到 9-10
- 画面太死板 → 降低 cfg 到 5-6
- 细节不够 → 提高 steps 到 35-40
- 生成太慢 → 降低 steps 到 20
```

### 8.2 常用提示词关键词库

**人物相关：**
```
1girl / 1boy / 2girls, long hair, short hair,
brown hair, black hair, blue eyes, green eyes,
school uniform, casual clothes, formal wear
```

**场景相关：**
```
indoors, outdoors, bedroom, classroom,
night, sunset, rain, cherry blossoms
```

**风格相关：**
```
anime style, detailed face, cinematic lighting,
dramatic angle, lens flare, bokeh
```

**质量相关：**
```
high quality, masterpiece, best quality,
detailed, sharp focus, 8k
```

**需要避免的（放入负提示词）：**
```
low quality, worst quality, blurry,
bad anatomy, bad hands, watermark, text,
deformed, ugly, duplicate
```

---

## 九、本章小结

| 步骤 | 操作 |
|------|------|
| 1 | 添加 Checkpoint Loader 并选择模型 |
| 2 | 添加两个 CLIP Text Encode（正负提示词） |
| 3 | 添加 Empty Latent Image 设置尺寸 |
| 4 | 添加 KSampler 并连接各输入 |
| 5 | 添加 VAE Decode 解码潜在空间 |
| 6 | 添加 Save Image 保存输出 |
| 7 | 输入提示词，Queue Prompt 生成 |
| 8 | 不满意就改 seed 或提示词重试 |

---

*下节课：[第 8 课：理解节点与连线](lesson-8.md)*
