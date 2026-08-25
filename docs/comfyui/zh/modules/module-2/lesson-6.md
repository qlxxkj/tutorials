# 第 6 课：自定义节点安装

> 📌 **学习目标**：学会安装 ComfyUI 自定义节点，解锁更多功能
> ⏱️ **预计时长**：15 分钟
> 🎯 **本节节奏**：为什么需要 → 安装方法 → 常用节点推荐 → 工作流管理

---

## 一、什么是自定义节点？

ComfyUI 的核心功能有限，但有一个庞大的插件生态系统。

**自定义节点** = 其他开发者写的额外功能模块，安装后可以在 ComfyUI 中使用。

```
类似手机装 App：
- ComfyUI 核心 = 手机系统
- 自定义节点 = 各种 App
- 装得越多，功能越强
```

---

## 二、安装方法：使用 ComfyUI Manager

最简单的方式是安装 **ComfyUI Manager**（管理器），它提供了一个图形化的节点安装界面。

### 步骤 1：下载 ComfyUI Manager

```
1. 打开终端，进入 ComfyUI 目录
2. 执行以下命令克隆 Manager 仓库：

git clone https://github.com/ltdrdata/ComfyUI-Manager.git custom_nodes/ComfyUI-Manager
```

或者手动下载：
- 访问 https://github.com/ltdrdata/ComfyUI-Manager
- 点击 Code → Download ZIP
- 解压到 ComfyUI 目录下的 `custom_nodes/` 文件夹

### 步骤 2：重启 ComfyUI

重启后你会注意到界面多了几个变化：
- 左上角出现 `Manager` 菜单
- 右键菜单中多了 Manager 相关选项

### 步骤 3：使用 Manager 安装其他节点

```
1. 点击顶部菜单 Manager → Open Manager
2. 在搜索框输入节点名称
3. 点击 Install 按钮
4. 安装完成后点击 Restart
```

---

## 三、必装的节点套件

### 3.1 ComfyUI-Manager（管理器）

已经安装了，提供所有节点的安装和管理界面。

### 3.2 ComfyUI-Impact-Pack（影响包）⭐ 必备

```
功能：
- 人脸检测与修复（ImpactDetector）
- 人物分割（Segment Anything）
- 批量处理（Batch）
- 多种实用工具节点

安装：Manager → 搜索 Impact Pack → Install
```

### 3.3 ComfyUI-Ip-Adapter（角色一致性）⭐ 必备

```
功能：
- IP-Adapter FaceID（人脸参考）
- IP-Adapter Style（风格参考）
- IP-Adapter Full（完整参考）

安装：Manager → 搜索 Ip-Adapter → Install
还需要下载对应的 models：
- 在 Manager 中点击 Model Manager
- 搜索 ip-adapter 并下载
```

### 3.4 ComfyUI-ControlNet (官方)

```
功能：
- ControlNet 各种预处理器
- OpenPose（姿势控制）
- Canny（边缘控制）
- Depth（深度控制）

安装：Manager → 搜索 ControlNet → Install
还需要下载 ControlNet 模型：
- https://huggingface.co/lllyasviel/sd_controlnet
```

### 3.5 ComfyUI-Custom-Scripts（自定义脚本）

```
功能：
- 快捷操作菜单
- 批量节点操作
- 界面增强

安装：Manager → 搜索 Custom Scripts → Install
```

---

## 四、按用途分类的节点推荐

### 画质提升类

| 节点名 | 功能 | 安装方式 |
|--------|------|---------|
| **Ultimate SD Upscale** | 超分辨率放大 | Manager 搜索 |
| **ADetailer** | 自动人脸修复 | Manager 搜索 |
| **Regional Prompter** | 区域提示词控制 | Manager 搜索 |

### 效率工具类

| 节点名 | 功能 | 安装方式 |
|--------|------|---------|
| **ComfyUI-Manager** | 节点管理 | 已安装 |
| **Queue Manager** | 批量队列管理 | Manager 搜索 |
| **Conditioning Max** | 提示词合并工具 | Manager 搜索 |

### 高级功能类

| 节点名 | 功能 | 安装方式 |
|--------|------|---------|
| **IP-Adapter** | 角色/风格参考 | Manager 搜索 |
| **ControlNet** | 构图/姿势控制 | Manager 搜索 |
| **AnimateDiff** | 简单动画生成 | Manager 搜索 |

---

## 五、模型下载（通过 Manager）

安装节点后，很多还需要下载对应的模型文件：

```
方法：Manager → Model Manager

在 Model Manager 中：
1. 可以看到所有已安装和可下载的模型
2. 搜索模型名（如 "ip-adapter"）
3. 点击 Download 按钮
4. 模型自动下载到正确目录
```

**推荐优先下载的模型：**

| 模型 | 用途 | 大小 |
|------|------|------|
| ip-adapter-faceid-plusv2 | 人脸参考 | ~1.5GB |
| controlnet-openpose | 姿势控制 | ~700MB |
| controlnet-canny | 边缘控制 | ~700MB |
| controlnet-depth | 深度控制 | ~700MB |

---

## 六、本章小结

| 步骤 | 操作 |
|------|------|
| 1 | 安装 ComfyUI-Manager（一键管理工具） |
| 2 | 通过 Manager 安装 Impact Pack、IP-Adapter、ControlNet |
| 3 | 通过 Model Manager 下载对应模型 |
| 4 | 重启 ComfyUI 使所有更改生效 |

**记住**：不用一次性装所有节点，边学边装，遇到需要的功能再装对应的节点。

---

*下节课进入[模块三：基础操作](../module-3/lesson-7.md)*
