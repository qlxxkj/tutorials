# 第 11 课：精确控制——ControlNet

> 📌 **学习目标**：学会用 ControlNet 精确控制画面构图和人物姿势
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：ControlNet 原理 → 常用预处理器 → 实战操作

---

## 一、ControlNet 是什么？

ControlNet 是一种技术，让你**不只靠文字描述**来控制 AI 生成什么画面。

```
传统方式：
  "一个女孩坐在书桌前看电脑"
  → AI 自由发挥 → 可能是任何角度、任何姿势

ControlNet 方式：
  文字描述 + 姿势参考图
  → AI 按照参考图的姿势生成 → 精确控制
```

简单说：**ControlNet = 给 AI 一张"草稿"，让它照着画。**

---

## 二、常用的 ControlNet 预处理器

Preprocessor（预处理器）的作用是将参考图转化为 AI 能理解的"控制信号"。

### 2.1 OpenPose（姿势控制）⭐ 最常用

```
作用：识别人物姿势，生成骨架图作为控制信号
输入：任意人物照片或手绘草图
输出：火柴人骨架图

使用场景：
- 想要特定姿势的人物
- 控制人物动作和肢体语言
```

**操作步骤：**
```
1. 找一张姿势参考图（可以是照片、手绘、或从其他 AI 图截取）
2. 添加 "OpenPose Preprocessor" 节点
3. 连接参考图 → OpenPose → ControlNet Apply
```

### 2.2 Canny（边缘控制）

```
作用：识别图像边缘，生成线条图
输入：任意图片
输出：黑白边缘线稿

使用场景：
- 想要保持特定的构图和轮廓
- 控制画面结构
```

### 2.3 Depth（深度控制）

```
作用：识别画面深度信息
输入：任意图片
输出：深度图（近处白色，远处黑色）

使用场景：
- 控制画面的空间层次感
- 保持前后景关系
```

### 2.4 Lineart（线稿控制）

```
作用：提取清晰的线条
输入：任意图片
输出：干净的手绘风格线稿

使用场景：
- 漫剧分镜的线稿风格
- 保持画面简洁
```

---

## 三、ControlNet 工作流搭建

### 添加 ControlNet 节点

```
1. 按 Tab，搜索 "ControlNet Apply" → 添加
2. 按 Tab，搜索 "Load ControlNet Model" → 添加
3. 选择对应的 ControlNet 模型文件
```

### 连接方式

```
[正提示词CLIP] ──→ [KSampler] .positive
                                   ↓
[ControlNet Apply] ←──────────────┘
     ↑
[ControlNet Model] ──→ 选择 controlnet-openpose 等
     ↑
[Preprocessor] ────→ 选择 OpenPose/Canny/Depth
     ↑
[Load Image] ──────→ 上传参考图
```

### 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| **strength** | 0.6-0.8 | 控制强度，越高越遵循参考图 |
| **start_percent** | 0.0 | 从哪个采样阶段开始应用 |
| **end_percent** | 1.0 | 到哪个采样阶段结束 |

---

## 四、实战：控制人物姿势

### 场景：生成一个"坐着的程序员"

```
步骤 1：准备参考图
  - 找一张 people sitting at desk 的照片
  - 或手绘一个火柴人姿势

步骤 2：添加 OpenPose 预处理
  - Load Image → OpenPose Preprocessor → ControlNet Apply
  - strength 设为 0.75

步骤 3：编写提示词
  正提示词：
  "1boy, sitting at desk, looking at computer, 
   programmer, tired expression, anime style,
   dimly lit room, rain outside window"
  
  负提示词：
  "standing, walking, bad anatomy, extra limbs"

步骤 4：生成并调整
  - 如果姿势不够准确 → strength 提高到 0.85
  - 如果姿势太僵硬 → strength 降低到 0.6
  - 如果人物走样 → 同时使用 IP-Adapter 保持角色
```

---

## 五、组合使用：IP-Adapter + ControlNet

这是 AI 漫剧的最佳组合：

```
                    ┌──→ IP-Adapter（保持角色）
参考图A(角色) ──────┤
                    └──→ IP-Adapter
                    
                    ┌──→ ControlNet（控制姿势）
参考图B(姿势) ──────┤
                    └──→ ControlNet

两者同时作用于 KSampler：
  KSampler 同时接收：
  - IP-Adapter 的角色特征
  - ControlNet 的姿势约束
  - 提示词的语义信息
```

### 工作流程

```
1. 添加 IPAdapter Apply 节点，上传角色参考图
2. 添加 ControlNet Apply 节点，上传姿势参考图
3. 两个节点的输出都连接到 KSampler 的 positive 端口
4. 设置合适的 weight 和 strength
5. 生成并微调
```

### 参数建议

```
IP-Adapter weight: 0.85（角色相似度优先）
ControlNet strength: 0.7（姿势参考，留一些自由度）
CFG: 7.5
Steps: 28
```

---

## 六、本章小结

| 工具 | 用途 | 推荐强度 |
|------|------|---------|
| OpenPose | 控制人物姿势 | 0.6-0.8 |
| Canny | 控制边缘构图 | 0.5-0.7 |
| Depth | 控制空间层次 | 0.5-0.7 |
| Lineart | 控制线稿风格 | 0.6-0.8 |

**最佳实践**：IP-Adapter（保角色）+ ControlNet（控姿势）组合使用。

---

*下节课：[第 12 课：局部重绘——Inpainting](lesson-12.md)*
