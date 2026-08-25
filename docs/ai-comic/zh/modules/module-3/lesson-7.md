# 第 7 课：生成分镜画面

> 📌 **学习目标**：掌握用 AI 图像工具产出高质量分镜画面的方法
> ⏱️ **预计时长**：25 分钟
> 🎯 **本节节奏**：操作流程 → Prompt 编写 → 审核筛选 → 批量生产

---

## 一、操作流程总览

```
剧本分镜 → 构建描述 → 工具生成 → 审核筛选 → 保存使用
   │         │          │         │         │
   ▼         ▼          ▼         ▼         ▼
 20个镜头  逐镜头写   AI出图    挑最好的  命名保存
           Prompt    30-60秒   一张下载  shot_NNN.png
```

---

## 二、如何构建生图描述

### Prompt 公式

```
[画风] + [场景环境] + [角色描述] + [镜头角度] + [情绪表情] + [光影氛围]
```

### 逐段拆解

**① 画风**（放在最前面）
```
anime style, cel shaded, vibrant colors
或 watercolor painting style, soft edges
或 film noir, high contrast black and white
```

**② 场景环境**
```
A dimly lit apartment at night, rain against the window,
empty instant noodle cups on the desk, blue glow from computer
```

**③ 角色描述**（每次都带上，保证一致性）
```
28-year-old Asian male with messy black hair and black glasses,
wearing grey hoodie
```

**④ 镜头角度**
```
medium shot / close-up / wide shot / overhead
```

**⑤ 情绪表情**
```
exhausted expression, tired eyes（疲惫）
shocked expression, wide eyes（震惊）
terrified, trembling（恐惧）
```

**⑥ 光影氛围**
```
Blue monitor glow on his face, deep shadows（蓝光+阴影）
warm desk lamp in background（暖光背景）
```

### 完整示例

```
anime comic panel,
A dimly lit apartment at night, rain streaking against the window,
28-year-old Asian male with messy black hair and black glasses,
wearing grey hoodie, sitting at desk looking at glowing computer screen,
medium shot, exhausted expression with dark circles under eyes,
Blue monitor glow illuminating his face, warm desk lamp in background,
high quality, detailed anime illustration, cinematic composition,
No text, no watermark
```

---

## 三、使用即梦/可灵的操作步骤

### Step 1：打开工具

- **即梦**：访问 jimeng.jianying.com 或打开 App
- **可灵**：访问 kiln.kuaishou.com 或打开 App

### Step 2：上传参考图

在"参考图"位置上传之前生成的角色参考图。

### Step 3：输入描述

将上面写好的 Prompt 粘贴到输入框。

### Step 4：设置参数

| 参数 | 推荐值 |
|------|--------|
| 比例 | 9:16（竖屏短视频）|
| 风格 | 动漫 / 写实（根据项目选择）|
| 数量 | 先选 1 张测试，满意后再批量 |

### Step 5：生成并筛选

生成 1-4 张，挑选最满意的一张下载。

---

## 四、批量生成的技巧

### 技巧 1：先试一张，确认效果再批量

不要一次生成 20 张。先用第一张测试 Prompt 效果：
- 角色像不像？
- 构图对不对？
- 光影是否满意？

不满意就改 Prompt，满意了再批量复制执行。

### 技巧 2：建立 Prompt 模板

把验证过的描述保存下来，后续镜头只需微调：

```
模板：【中景·陈默在电脑前】
anime comic panel,
{环境描述},
28-year-old Asian male with messy black hair and black glasses, wearing grey hoodie,
{动作描述},
medium shot, {情绪},
{光影},
high quality anime illustration, No text, no watermark
```

### 技巧 3：按顺序生成

按照剧本顺序逐镜头生成：
- 方便对照剧本检查
- 如果某张不满意，前后的图可以互相参考保持一致性

---

## 五、审核筛选标准

每张图片生成后，检查：

- [ ] 角色一致性：脸、发型、眼镜、衣服和参考图一致
- [ ] 画面清晰度：没有模糊、变形、拉伸
- [ ] 构图合理：主体在合适位置
- [ ] 情绪传达：表情符合剧本要求
- [ ] 无异常元素：没有多余的手、奇怪的文字、水印
- [ ] 比例正确：竖屏 9:16

不合格的处理：微调描述重新生成，直到满意为止。

---

## 六、常见问题

**Q: 生成的图和参考图长得不一样？**
A: 1) 确认参考图已正确上传；2) 在描述中重复关键特征；3) 每次只生成 1 张仔细挑选。

**Q: 画面太暗看不清人物？**
A: 在描述中加入 `character clearly visible` 或 `well-lit face`。

**Q: 同一张图多次生成差异很大？**
A: 正常现象。选定一张后固定 seed 值（如果工具支持）。

---

*下节课：[第 8 课：视频生成（多图参考）](../module-4/lesson-8.md)*
