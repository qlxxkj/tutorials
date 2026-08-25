# 第 10 课：角色一致性——IP-Adapter

> 📌 **学习目标**：掌握 IP-Adapter 的使用方法，实现角色在多图中的形象一致
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：原理理解 → 节点添加 → 参数调整 → 实战演练

---

## 一、什么是 IP-Adapter？

**IP-Adapter**（Image Prompt Adapter）是 ComfyUI 中用于角色一致性的核心插件。

### 原理通俗解释

```
传统方式：
  描述 → AI → 每张图都重新想象角色 → 每次都不一样

IP-Adapter 方式：
  描述 + 参考图 → AI → 根据参考图的特征生成 → 保持一致性
```

IP-Adapter 的工作方式：
1. 你上传一张角色参考图
2. AI 提取参考图中的角色特征（脸型、发型、服装等）
3. 后续生成的每张图片都参考这些特征
4. 结果：同一个角色在不同场景中保持形象一致

---

## 二、安装与准备

### 步骤 1：安装节点

```
1. 打开 ComfyUI Manager
2. 搜索 "IP-Adapter"
3. 点击 Install
4. 重启 ComfyUI
```

### 步骤 2：下载模型

在 Model Manager 中下载以下模型（根据需求选一个或几个）：

| 模型文件 | 用途 | 大小 |
|---------|------|------|
| `ip-adapter-faceid-plusv2` | 人脸参考（最强） | ~1.5GB |
| `ip-adapter-plus` | 整体风格参考 | ~1.1GB |
| `ip-adapter-plus-face` | 人脸+风格混合 | ~1.1GB |
| `ip-adapter-full-body` | 全身参考 | ~1.1GB |

**推荐新手先用 `ip-adapter-faceid-plusv2`**，对脸部的保持效果最好。

模型会自动下载到 `models/ipadapter/` 目录。

---

## 三、搭建 IP-Adapter 工作流

### 基础连接方式

```
[Checkpoint Loader]
  ├── model ──────→ [KSampler]
  └── CLIP ───────→ [CLIP Text Encode] × 2

[IP-Adapter FaceID]  ← 新增的节点
  ├── ipadapter_file ──→ 选择下载的 IP-Adapter 模型
  ├── image ──────────→ 角色参考图
  └── weight ─────────→ 控制强度（0.8-1.0）
  
[KSampler] 的 positive 端口同时接收：
  - CLIP Text Encode 的输出
  - IP-Adapter 的输出
```

### 节点添加步骤

```
1. 按 Tab，搜索 "IPAdapter Apply" → 添加
2. 按 Tab，搜索 "Load Image" → 添加（用于导入参考图）
3. 连接：
   Load Image.image ──────→ IPAdapter Apply.image
   IPAdapter Apply.output ─→ KSampler.positive
```

---

## 四、关键参数说明

### IP-Adapter Apply 参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| **ipadapter_file** | ip-adapter-faceid-plusv2 | 选择下载的模型 |
| **weight** | 0.8-1.0 | 参考强度，越高越像参考图 |
| **start_at / end_at** | 0.0 / 1.0 | 在哪个采样阶段应用参考 |
| **weight_type** | classic | 权重类型 |

### 实操建议

```
角色相似度要求高 → weight = 0.9-1.0
既要像参考图，又要保持创意 → weight = 0.6-0.8
参考图质量一般 → weight = 0.5-0.7（降低权重减少干扰）
```

---

## 五、完整工作流搭建

### 步骤详解

```
1. 添加 Checkpoint Loader，选择动漫模型
2. 添加两个 CLIP Text Encode（正负提示词）
3. 添加 Empty Latent Image（768×1024）
4. 添加 KSampler（steps=28, cfg=7.5, sampler=euler_ancestral）
5. 添加 IPAdapter Apply 节点
6. 添加 Load Image 节点（上传角色参考图）
7. 添加 VAE Decode
8. 添加 Save Image
```

### 连线顺序

```
Checkpoint Loader.model ────────→ KSampler.model
Checkpoint Loader.vae ──────────→ VAE Decode.vae
Checkpoint Loader.CLIP ─────────→ CLIP Text Encode × 2

CLIP(正).output ────────────────┐
                                ↓
IPAdapter.Apply.weighted_clip ──→ KSampler.positive
   ↑
Load Image.image ───────────────→ IPAdapter.Apply.image
   (上传你的角色参考图)

Empty Latent.output ────────────→ KSampler.latent_image
KSampler.output ────────────────→ VAE Decode.samples
VAE Decode.output ──────────────→ Save Image.images
```

---

## 六、实战：生成角色一致的多张图

### 操作流程

```
1. 准备好角色参考图（正面清晰照最佳）
2. 加载 IP-Adapter 工作流
3. 在 Load Image 节点上传参考图
4. 填写正提示词（描述场景和动作）
5. 填写负提示词（排除不想要的元素）
6. 设置 seed 为随机
7. Queue Prompt，等待生成
8. 不满意就换 seed 或调整 weight
```

### 提升一致性的技巧

| 技巧 | 操作 | 效果 |
|------|------|------|
| 参考图质量好 | 选正面、清晰、无遮挡的角色图 | 一致性大幅提升 |
| Weight 调高 | weight 设为 0.9-1.0 | 更像参考图 |
| 固定 Seed | 记录满意的 seed | 可复现相似结果 |
| 多次尝试 | 同一 seed 微调提示词 | 平衡一致性和创意 |

---

## 七、常见问题

**Q: 生成的图和参考图完全不一样？**
A: 1) 检查是否选对了 IP-Adapter 模型；2) 提高 weight 到 0.9-1.0；3) 确认参考图上传正确。

**Q: 生成的图太像参考图，没有变化？**
A: 降低 weight 到 0.6-0.7，给 AI 更多创作空间。

**Q: 脸部变形或不自然？**
A: 1) 参考图质量不好（模糊/遮挡）；2) 搭配 ADetailer 节点进行人脸修复。

---

## 八、本章小结

| 要点 | 说明 |
|------|------|
| 核心功能 | 通过参考图保持角色一致性 |
| 关键节点 | IPAdapter Apply + Load Image |
| 重要参数 | weight（强度）、ipadapter_file（模型选择） |
| 最佳实践 | 高质量正面参考图 + weight 0.8-1.0 |
| 配套工具 | ADetailer 用于人脸修复 |

---

*下节课：[第 11 课：精确控制——ControlNet](lesson-11.md)*
