# 第 12 课：局部重绘——Inpainting

> 📌 **学习目标**：学会对画面局部进行修改，修复问题和调整细节
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：Inpainting 原理 → 操作方式 → 常见问题修复

---

## 一、什么是 Inpainting？

Inpainting（局部重绘）= 只对图片的某个区域重新生成，其他部分保持不变。

```
完整图生图：
  输入：提示词 → 输出：全新图片

Inpainting：
  输入：原图 + 蒙版（标记区域）+ 新提示词 → 输出：修改后的图
```

### 典型应用场景

| 场景 | 操作 |
|------|------|
| 手部畸形 | 框选手部，输入"good hands"重新生成 |
| 表情不满意 | 框选面部，输入"smiling"替换表情 |
| 背景杂乱 | 框选背景区域，简化或替换 |
| 添加物品 | 框选空白区域，输入"cup of coffee"添加 |
| 修复穿帮 | 框选错误区域，重新生成 |

---

## 二、ComfyUI 中的 Inpainting 方法

### 方法 1：VAE Inpaint（最简单）

```
步骤：
1. 在画布上右键 → 选择已有的图片节点
2. 找到 VAE Encode（Inpaint）节点
3. 添加 Mask（蒙版）节点
4. 用蒙版框选要修改的区域
5. 在 prompt 中描述修改内容
6. 设置 denoise 为 0.4-0.7（不要太高）
```

### 方法 2：Impact Pack Inpaint（推荐）

```
Impact Pack 提供了更强大的 inpainting 工具：

1. 添加 "Conditioning (Set Latent Noise Mask)" 节点
2. 添加 "VAE Encode (for Inpaint)" 节点
3. 创建蒙版选择区域
4. 连接到 KSampler
5. denoise 建议 0.4-0.6
```

---

## 三、实战：修复手部问题

手部问题是 AI 生图最常见的毛病，用 Inpainting 可以快速修复。

### 步骤

```
1. 先生成一张满意的图，但手部有问题
2. 添加 "Mask" 节点，用画笔工具框选手部区域
3. 添加 "VAE Encode (for Inpaint)"，连接蒙版
4. 提示词填写：
   正：good hands, detailed fingers, natural pose
   负：bad hands, extra fingers, mutated hands
5. KSampler 设置：
   - denoise: 0.5（只修改手，不影响其他部分）
   - steps: 20
   - cfg: 7
6. 生成，查看效果
7. 不满意可以继续 inpaint，直到满意
```

---

## 四、ADetailer 自动修复

ADetailer 是一个自动检测并重绘人脸和手部的插件。

### 安装与使用

```
1. 在 Manager 中搜索并安装 "ADetailer"
2. 重启 ComfyUI
3. 添加 "ADetailer" 节点到你的工作流
4. 设置：
   - ad_model: face_yolov8（人脸修复）
   - ad_model: hand_yolov8（手部修复）
   - denoise: 0.4-0.5
   - DPOE (Denoise Strength): 0.4-0.5
5. 连接后正常运行即可
```

### 效果对比

```
不使用 ADetailer：
  人物脸部可能歪斜，手指可能多余或缺失

使用 ADetailer 后：
  脸部自动修复为正常比例
  手部自动修正为正确的手指数量
```

---

## 五、本章小结

| 工具 | 适用场景 | 难度 |
|------|---------|------|
| VAE Inpaint | 小范围局部修改 | 中 |
| Impact Inpaint | 精确区域重绘 | 中 |
| ADetailer | 人脸/手部自动修复 | 低 ⭐推荐 |

**记住**：Inpainting 的核心是控制 `denoise` 值——值越高改得越多，值越低改得越少。新手建议从 0.4-0.5 开始尝试。

---

*下节课进入[模块五：漫剧实战](../module-5/lesson-13.md)*
