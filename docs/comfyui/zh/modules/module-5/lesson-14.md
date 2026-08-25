# 第 14 课：批量生成分镜画面

> 📌 **学习目标**：学会批量生成一致性的分镜画面，建立高效的生产流程
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：批量策略 → 批量工作流 → 质量控制 → 效率技巧

---

## 一、批量生成的核心挑战

批量生成最大的挑战是**一致性**——如何让 20 张图里的角色看起来是同一个人。

解决方案：
1. 固定角色参考图（IP-Adapter）
2. 固定 seed 或 seed 递增
3. 固定其他参数（steps/cfg/sampler）
4. 只改提示词中的场景和动作描述

---

## 二、批量工作流搭建

### 方法 1：使用 Batch 节点

```
1. 添加 "Batch" 或 "Iterative Batch" 节点
2. 设置 batch size 为你需要的数量
3. 连接到 KSampler
4. 一次生成多张图片
```

### 方法 2：使用 Seed 递增

```
1. 在 KSampler 的 seed 端口连接一个 "Random" 或 "Seed" 节点
2. 手动调整 seed 值，逐张生成
3. 或者使用 "Seed Increment" 节点自动递增
```

### 方法 3：使用 Queue 批量队列

```
1. 设置好所有参数
2. 连续点击多次 "Queue Prompt"
3. 或者右键画布 → "Queue Selected" → 输入数量
4. ComfyUI 会自动按顺序生成
```

---

## 三、保持一致性的操作规范

### 3.1 固定不变的参数

每次生成时，以下参数**必须保持一致**：

```
✅ 固定：
- Checkpoint 模型（不要换模型）
- IP-Adapter 参考图（同一张角色图）
- Steps（如 28）
- CFG（如 7.5）
- Sampler（如 euler_ancestral）
- Scheduler（如 normal）
- 图片尺寸（如 768×1024）

❌ 可以变化的：
- Seed（建议每次变化）
- 提示词中的场景描述
- 提示词中的动作描述
```

### 3.2 提示词模板法

为每个分镜建立提示词模板：

```
【固定部分 - 每次复制】
anime comic panel, 28-year-old Asian male with messy black hair and 
black glasses, wearing grey hoodie, medium shot, 

【变化部分 - 每个镜头不同】
{sitting at desk looking at computer}, {expression: tired}, 
{lighting: blue monitor glow}, {action: rubbing eyes}

组合后的完整提示词：
anime comic panel, 28-year-old Asian male with messy black hair and 
black glasses, wearing grey hoodie, medium shot, 
sitting at desk looking at computer, tired expression, 
blue monitor glow illuminating his face, cinematic lighting, 
high quality anime illustration, No text, No watermark
```

### 3.3 Seed 管理策略

```
策略 A：随机 seed（推荐新手）
  - 每次生成随机 seed
  - 批量生成后挑选最好的
  - 记录每张图的 seed 和 prompt

策略 B：Seed 递增（适合微调）
  - seed = 基准值 + 镜头编号
  - 如基准 seed = 12345
  - 镜头1: seed=12345, 镜头2: seed=12346...
  - 相邻镜头之间有一些相似性

策略 C：固定 seed + 微调（适合精修）
  - 选定一张满意的 seed
  - 用 Inpainting 修改细节
  - 不改变 seed，只改局部
```

---

## 四、批量生成操作流程

### 步骤 1：准备素材

```
1. 确认角色参考图已准备好
2. 确认剧本已解析为分镜列表
3. 确认每个分镜的提示词模板已写好
```

### 步骤 2：批量生成

```
方法：
1. 加载包含 IP-Adapter 的完整工作流
2. 上传角色参考图
3. 设置好固定参数
4. 在 Queue 中输入要生成的数量（如 20）
5. 等待批量生成完成
```

### 步骤 3：筛选与命名

```
1. 查看所有生成结果
2. 挑出满意的图片
3. 按剧本顺序命名为 shot_001.png, shot_002.png...
4. 不满意的图片：记录 seed，单独重新生成
```

---

## 五、质量控制

### 批量生成后的检查清单

```
□ 所有图片的角色形象是否一致？
□ 是否有明显的脸部或手部变形？
□ 光线和色调是否统一？
□ 构图是否符合分镜要求？
□ 分辨率是否足够（建议 768×1024 以上）？
```

### 不合格图片的处理

| 问题 | 处理方法 |
|------|---------|
| 角色不像 | 提高 IP-Adapter weight |
| 手部畸形 | 用 Inpainting 修复手部 |
| 脸部畸形 | 用 ADetailer 修复 |
| 构图不对 | 用 ControlNet 调整 |
| 整体不满意 | 换 seed 重新生成 |

---

## 六、效率技巧

### 技巧 1：先出预览再精修

```
第一轮：快速预览
  - Steps: 20（快速）
  - 尺寸: 512×768（小图）
  - 目的：快速确认构图和角色方向

第二轮：高清精修
  - Steps: 28-35
  - 尺寸: 768×1024
  - 目的：产出最终可用图片
```

### 技巧 2：利用等待时间

```
生成过程中可以做：
- 准备下一个镜头的提示词
- 检查已生成的图片
- 调整后续镜头的 ControlNet 参考图
```

### 技巧 3：建立种子库

```
将满意的 seed 记录下来：
shot_001_seed: 48291
shot_005_seed: 73821
shot_012_seed: 19283

下次做类似场景时，可以直接复用或微调这些 seed
```

---

## 七、本章小结

| 要点 | 说明 |
|------|------|
| 一致性关键 | 固定模型+参考图+参数，只变场景描述 |
| 批量方法 | Batch节点 / Seed递增 / Queue队列 |
| 质量控制 | 生成后逐张检查，不满意的单独修复 |
| 效率提升 | 先低分辨率预览，满意后再高清精修 |
| 种子管理 | 记录满意的 seed，建立个人种子库 |

---

*下节课：[第 15 课：画质修复与放大](lesson-15.md)*
