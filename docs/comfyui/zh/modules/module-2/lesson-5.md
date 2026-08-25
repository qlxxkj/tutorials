# 第 5 课：模型下载与管理

> 📌 **学习目标**：了解 ComfyUI 各类模型的用途，学会选择和下载模型
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：模型分类 → 推荐清单 → 下载方法 → 管理技巧

---

## 一、ComfyUI 的模型类型

ComfyUI 需要多种模型协同工作，每种模型负责不同的任务：

### 1. Checkpoint（主模型）⭐ 最重要

决定画面的整体风格和质量。这是你需要优先下载的模型。

```
位置：models/checkpoints/
格式：.safetensors
大小：2GB - 7GB 每个
```

### 2. VAE（变分自编码器）

负责将 AI 生成的"潜在空间"数据解码为可见图片。

```
位置：models/vae/
格式：.safetensors 或 .ckpt
作用：影响色彩的饱和度和细节表现
注意：很多 Checkpoint 已经内置了 VAE，不需要单独下载
```

### 3. CLIP（文本编码器）

负责理解你的文字提示词。

```
位置：models/clip/
格式：.safetensors
注意：通常随 Checkpoint 一起使用，不需要单独管理
```

### 4. LoRA（低秩适配器）

轻量级模型，用于微调特定风格或角色。

```
位置：models/loras/
格式：.safetensors
大小：50MB - 300MB 每个
作用：在不完全替换主模型的情况下，改变画风或添加特定角色
```

### 5. ControlNet（控制网络）

用于精确控制画面的构图、姿势、深度等信息。

```
位置：models/controlnet/
格式：.safetensors
作用：输入参考图，控制生成图的姿势/构图/边缘
```

---

## 二、模型下载站点推荐

### CivitAI ⭐ 首选

```
https://civitai.com
```

- 全球最大的 Stable Diffusion 模型社区
- 支持在线预览效果
- 有评分和评论，方便筛选
- 按风格/人物/场景分类

**使用技巧：**
1. 注册账号（免费）
2. 用关键词搜索（如 "anime", "realistic", "portrait"）
3. 点击模型查看预览图，确认风格满意再下载
4. 选择版本（通常选 latest 或推荐版本）
5. 下载 .safetensors 文件

### HuggingFace

```
https://huggingface.co
```

- 官方模型的主要发布平台
- 搜索时加 `stable-diffusion` 关键词
- 适合找基础模型和官方版本

### 国内镜像（备用）

```
https://modelscope.cn          # 阿里云模型库
https://hf-mirror.com         # HuggingFace 国内镜像
```

---

## 三、新手推荐模型清单

### 动漫风格（AI 漫剧首选）

| 模型名 | 风格特点 | 文件大小 | 推荐度 |
|--------|---------|---------|--------|
| **RevAnimated** | 通用动漫，质量稳定 | ~4.5GB | ⭐⭐⭐⭐⭐ |
| **Counterfeit-V3** | 鲜艳色彩，适合人物 | ~4GB | ⭐⭐⭐⭐ |
| **Anything-V5** | 经典动漫风 | ~2GB | ⭐⭐⭐⭐ |
| **MeinaMix** | 柔和日系动漫 | ~4GB | ⭐⭐⭐⭐ |

### 写实风格

| 模型名 | 风格特点 | 文件大小 | 推荐度 |
|--------|---------|---------|--------|
| **RealisticVision** | 真实人像，质量高 | ~4GB | ⭐⭐⭐⭐⭐ |
| **AbsoluteReality** | 超写实，细节丰富 | ~4GB | ⭐⭐⭐⭐ |
| **BeautifulRealistic** | 美观写实人像 | ~4GB | ⭐⭐⭐⭐ |

### 建议起步方案

**先用 RevAnimated**（动漫均衡），满足 80% 的漫剧需求。
有需要时再下载其他风格补充。

---

## 四、如何高效管理模型

### 4.1 模型命名规范

给下载的文件起个好名字，方便后续识别：

```
❌ bad: v1-5-pruned.emaonly.safetensors
✅ good: RevAnimated_v3.safetensors

❌ bad: realistic_v1.pth
✅ good: RealisticVision_v14.safetensors
```

命名规则：`模型名_版本号.扩展名`

### 4.2 模型组织

按用途分类存放：

```
models/
├── checkpoints/
│   ├── anime/          ← 动漫风格
│   │   ├── RevAnimated_v3.safetensors
│   │   └── MeinaMix.safetensors
│   └── realistic/      ← 写实风格
│       └── RealisticVision_v14.safetensors
├── loras/
│   ├── style/          ← 风格类 LoRA
│   └── character/      ← 角色类 LoRA
└── controlnet/
    ├── openpose/       ← 姿势控制
    ├── canny/          ← 边缘控制
    └── depth/          ← 深度控制
```

### 4.3 磁盘空间管理

模型文件较大，合理管理很重要：

```
估算方法：
- 1 个 Checkpoint ≈ 4GB
- 10 个 Checkpoint ≈ 40GB
- 建议预留 50GB+ 给模型

节省空间技巧：
- 不用的模型移动到外部硬盘
- 用模型管理器批量清理
- 优先保留常用的 3-5 个模型
```

---

## 五、在 ComfyUI 中加载模型

### 方法 A：Checkpoint Loader 节点（最简单）

```
1. 右键画布 → 搜索 "Checkpoint Loader" → 添加
2. 点击节点上的模型下拉菜单
3. 选择你下载的模型
4. 如果没有出现，点击节点旁的刷新按钮
```

### 方法 B：Extra Models Loader 插件（推荐）

```
1. 安装 Custom Nodes Manager（见第 6 课）
2. 添加 "ExtraModelsLoader" 节点
3. 它可以自动扫描所有模型并分类显示
4. 支持一键切换模型，无需重启 ComfyUI
```

---

## 六、本章小结

| 要点 | 说明 |
|------|------|
| 核心模型 | Checkpoint 最重要，先下一个动漫风格的 |
| 下载站点 | CivitAI 首选，HuggingFace 备用 |
| 新手推荐 | RevAnimated（动漫通用） |
| 管理技巧 | 按风格分类命名，预留足够磁盘空间 |
| 加载方式 | Checkpoint Loader 节点或直接拖入 |

---

*下节课：[第 6 课：自定义节点安装](lesson-6.md)*
