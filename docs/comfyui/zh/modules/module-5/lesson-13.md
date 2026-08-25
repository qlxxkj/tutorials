# 第 13 课：生成角色参考图

> 📌 **学习目标**：用 ComfyUI + IP-Adapter 生成高质量的角色参考图
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：参考图要求 → 工作流搭建 → 生成技巧 → 角色卡片

---

## 一、什么是好的角色参考图？

角色参考图的质量直接影响后续所有分镜的画面一致性。

### 参考图的标准

```
✅ 好的参考图：
- 正面或 3/4 侧面角度
- 全身或大半身（能看到服装）
- 白色或纯色背景
- 表情中性（不要夸张情绪）
- 光线均匀，没有强烈阴影
- 分辨率 512×512 以上
- 面部清晰，无遮挡

❌ 差的参考图：
- 侧面超过 45 度
- 脸部被头发/口罩/手遮挡
- 背景杂乱
- 表情过于夸张
- 分辨率太低（模糊）
```

---

## 二、生成参考图的工作流

### 基础工作流（仅用 Checkpoint）

```
1. 选择动漫风格模型（如 RevAnimated）
2. 写好角色描述提示词
3. 设置尺寸为 512×768（半身像）或 768×1024（全身）
4. 生成 4-8 张，挑选最满意的
5. 如有需要，用 Inpainting 微调细节
```

### 角色描述模板

```
正提示词模板：
character design sheet, 
{外貌描述},
{发型}, {发色}, {眼睛颜色和形状},
{服装描述},
white background,
full body front view and side view,
anime style, cel shaded,
high quality, detailed,
No text, no watermark

负提示词模板：
low quality, blurry, bad anatomy,
watermark, text, logo,
bad hands, extra fingers,
deformed, ugly, duplicate
```

### 示例：程序员陈默

```
正提示词：
character design sheet,
28-year-old Asian male programmer,
short messy black hair, black rectangular glasses,
grey hooded sweatshirt with small logo, 
dark jeans, slim build,
tired eyes with slight dark circles,
neutral expression facing forward,
white background,
full body front view and 3/4 side view,
anime style, cel shaded, vibrant colors,
high quality detailed illustration,
No text, no watermark
```

---

## 三、迭代优化

### 第一轮：基础生成

```
1. 用上述提示词生成 4 张
2. 观察结果，记录哪些满意、哪些不满意
```

### 第二轮：针对性调整

```
不满意的地方 → 修改提示词 → 重新生成

常见调整：
- 脸型不对 → 添加 "sharp jawline" 或 "softer features"
- 发型不对 → 修改发型描述，如 "spiky hair" 或 "slicked back"
- 衣服不对 → 具体描述颜色、款式、图案
- 表情不对 → 明确写 "serious expression" 或 "calm face"
```

### 第三轮：Inpainting 微调

```
如果整体满意但局部有问题：
- 眼镜形状不对 → inpaint 面部区域
- 衣服颜色不对 → inpaint 身体区域
- 比例不对 → 使用 ADetailer
```

---

## 四、建立角色卡片

每张满意的参考图都应该配上角色卡片，记录关键信息：

```markdown
## 角色卡片：陈默

### 外貌特征
- 年龄：28 岁
- 身高：175cm
- 发型：黑色短发，略显凌乱
- 眼睛：黑色，戴黑框眼镜
- 服装：灰色连帽卫衣 + 深色牛仔裤
- 体型：偏瘦
- 标志性特征：眼下有淡淡黑眼圈

### 性格关键词
内向、细心、焦虑、善良

### TTS 音色
alloy（稳重男声）

### 参考图路径
assets/characters/chenmo_ref.png
```

---

## 五、多角色管理

一部作品通常有多个角色，建议：

```
1. 先确定主要角色数量（建议 2-4 个）
2. 每个角色单独生成参考图
3. 做好角色卡片，记录特征
4. 将所有参考图保存在统一目录
5. 后续生成分镜时复用这些参考图
```

### 角色之间的区分技巧

确保每个角色的参考图有明显区别：

| 角色 | 区分特征 |
|------|---------|
| 陈默（主角） | 黑框眼镜 + 灰色卫衣 + 黑眼圈 |
| 林夏（女配） | 棕色卷发 + 白色 T 恤 + 酒窝 |
| 神秘人 | 黑色长风衣 + 脸部阴影 + 看不清五官 |

---

## 六、本章小结

| 要点 | 说明 |
|------|------|
| 参考图质量 | 正面/半侧面、纯色背景、表情中性 |
| 提示词重点 | 详细外貌描述 + 固定服装 + 中性表情 |
| 迭代优化 | 生成 → 挑选 → 调整 → 再生成 |
| 角色卡片 | 记录特征，方便后续复用 |
| 多角色管理 | 每个角色有明确的区分特征 |

---

*下节课：[第 14 课：批量生成分镜画面](lesson-14.md)*
