# 第 4 课：安装与启动

> 📌 **学习目标**：在本地安装并成功启动 ComfyUI
> ⏱️ **预计时长**：20 分钟
> 🎯 **本节节奏**：下载 → 安装 → 首次启动 → 验证

---

## 一、前置条件

确保你的电脑满足以下要求：

| 项目 | 要求 |
|------|------|
| 操作系统 | Windows 10/11（本教程基于 Windows） |
| GPU | NVIDIA 显卡，显存 6GB+（推荐 8GB+） |
| 磁盘空间 | 至少 20GB 可用空间 |
| 网络 | 能访问 GitHub 和 HuggingFace |

> 本课使用环境：Windows Server，RTX A4000 16GB

---

## 二、下载安装

### 步骤 1：下载 ComfyUI

访问官方仓库下载：

```
https://github.com/comfyanonymous/ComfyUI/releases
```

下载最新的 **Windows portable version**（便携版，不需要额外安装 Python）。

### 步骤 2：解压

将下载的压缩包解压到你想要的目录，例如：

```
E:\ComfyUI\
```

解压后你会看到以下结构：

```
ComfyUI/
├── main.py              ← 启动文件
├── requirements.txt
├── models/              ← 模型存放目录
│   ├── checkpoints/     ← 主模型
│   ├── vae/             ← VAE 解码器
│   ├── loras/           ← LoRA 适配器
│   └── controlnet/      ← ControlNet 控制器
├── output/              ← 生成图片的默认输出目录
├── input/               ← 放入需要处理的图片
└── workflows/           ← 工作流保存目录
```

### 步骤 3：启动 ComfyUI

进入 ComfyUI 目录，双击运行启动脚本：

```
方式 A：双击 run_nvidia_gpu.bat（推荐，使用 GPU 加速）
方式 B：双击 run_cpu.bat（无 GPU 时使用，速度较慢）
```

首次启动会提示更新依赖，点击 **Update and Run** 等待完成。

### 步骤 4：打开界面

启动成功后，浏览器会自动打开：

```
http://127.0.0.1:8188
```

看到这个界面就说明安装成功了：

```
┌──────────────────────────────────────┐
│  ComfyUI                             │
│                                      │
│    ┌──────────────────────────┐     │
│    │                          │     │
│    │      [空画布]            │     │
│    │                          │     │
│    └──────────────────────────┘     │
│                                      │
│  [Queue Prompt]  [Extra Models]     │
└──────────────────────────────────────┘
```

---

## 三、配置模型路径（重要）

ComfyUI 默认模型目录可能和你想存放的位置不一样。可以通过配置文件修改：

### 方法：编辑 extra_model_paths.yaml

1. 找到 `extra_model_paths.yaml.example` 文件
2. 复制为 `extra_model_paths.yaml`
3. 用记事本打开，填入你的模型路径

```yaml
# 示例配置
comfyui:
  base_path: E:/ComfyUI
  checkpoints: models/checkpoints/
  clip: models/clip/
  vae: models/vae/
  loras: models/loras/
  controlnet: models/controlnet/
```

---

## 四、第一个模型：Checkpoint

要让 ComfyUI 能出图，至少需要一个 **Checkpoint 模型**（主模型）。

### 下载模型

推荐从以下站点下载：

| 站点 | 特点 | 地址 |
|------|------|------|
| **CivitAI** | 模型最全，社区活跃 | https://civitai.com |
| **HuggingFace** | 官方模型源 | https://huggingface.co |

### 推荐的入门模型

| 模型名 | 风格 | 适合用途 |
|--------|------|---------|
| **Realistic Vision** | 写实人像 | 真实感强的画面 |
| **Rev Animated** | 动漫风格 | AI 图像作品首选 |
| **Absolute Reality** | 超写实 | 高质量照片级 |
| **DreamShaper** | 通用均衡 | 新手友好 |

### 下载步骤

1. 打开 [CivitAI](https://civitai.com)
2. 搜索模型名（如 "Rev Animated"）
3. 选择版本（推荐 V3 或更新）
4. 点击 Download，下载 `.safetensors` 文件
5. 将文件放入 `models/checkpoints/` 目录

### 加载模型到 ComfyUI

启动 ComfyUI 后：

1. 右键画布空白处
2. 搜索 `Checkpoint Loader` 并添加
3. 点击模型下拉菜单，选择已下载的模型
4. 如果没出现，点击顶部菜单 `Extra Models Loader` → `Refresh`

---

## 五、验证安装

创建一个最简单的文生图工作流来验证：

```
1. 添加节点：
   - Checkpoint Loader
   - CLIP Text Encode × 2
   - Empty Latent Image
   - KSampler
   - VAE Decode
   - Save Image

2. 按以下顺序连接：
   Checkpoint Loader → KSampler（model端口）
   正提示词CLIP → KSampler（positive端口）
   负提示词CLIP → KSampler（negative端口）
   Empty Latent → KSampler（seed等参数）
   KSampler → VAE Decode（latent端口）
   Checkpoint Loader → VAE Decode（vae端口）
   VAE Decode → Save Image

3. 在正提示词框输入：a beautiful anime girl, detailed
4. 点击 Queue Prompt
5. 等待生成，查看输出图片
```

如果成功看到生成的图片，说明安装一切正常！🎉

---

## 六、常见问题

**Q: 启动报错 "CUDA out of memory"？**
A: 显存不足。尝试：1) 降低图片分辨率；2) 关闭其他占用显存的程序；3) 使用 `--lowvram` 参数启动。

**Q: 生成图片很慢？**
A: 正常情况，一张 512x512 图片约需 5-15 秒。如果超过 1 分钟，检查是否在用 CPU 模式。

**Q: 模型加载后下拉列表是空的？**
A: 检查模型文件是否在正确的目录（`models/checkpoints/`），且文件格式为 `.safetensors`。

**Q: 浏览器打不开 http://127.0.0.1:8188？**
A: 检查 ComfyUI 是否还在运行（终端窗口不要关闭）。可以手动在浏览器输入地址。

---

## 七、本章小结

| 步骤 | 操作 |
|------|------|
| 1 | 从 GitHub 下载 ComfyUI portable 版本 |
| 2 | 解压到目标目录 |
| 3 | 双击 `run_nvidia_gpu.bat` 启动 |
| 4 | 下载一个 Checkpoint 模型放入 `models/checkpoints/` |
| 5 | 搭建最简单的文生图工作流并测试 |

---

*下节课：[第 5 课：模型下载与管理](lesson-5.md)*
