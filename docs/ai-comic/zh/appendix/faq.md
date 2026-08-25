# 常见问题 FAQ

## 环境相关

**Q: FFmpeg 安装后还是提示找不到命令？**
A: 需要重启终端让 PATH 生效，或者使用 FFmpeg 的完整路径。

**Q: Python 虚拟环境怎么激活？**
A: Windows: `venv\Scripts\activate`，macOS/Linux: `source venv/bin/activate`

---

## API 相关

**Q: API Key 从哪里获取？**
A: 注册 OpenAI 平台或 Agnes AI，在控制台创建 API Key。

**Q: 为什么报错 "InvalidAuthentication"？**
A: 检查 `.env` 文件中的 Key 是否正确复制（没有多余空格），且 Key 未过期。

**Q: 为什么报错 "InsufficientQuota"？**
A: 账户余额不足，需要充值。OpenAI 最低充值 $5。

**Q: 请求太频繁被限流怎么办？**
A: 在每次请求间添加 `time.sleep(1)` 延迟，或升级 API 套餐。

---

## 图像生成相关

**Q: GPT-Image-2 和 Flux 选哪个？**
A: 快速出稿用 GPT-Image-2（接入简单），批量生产用 Flux + ComfyUI（零边际成本，角色一致性最强）。

**Q: Nano-Banana 好用吗？**
A: 国内访问稳定，价格比 GPT-Image 低，但生态较小，适合预算有限的国内项目。

**Q: 角色在画面中总是不一致怎么办？**
A: 这是 AI 漫剧的最大难题。最佳实践：1) 使用角色参考图（IP-Adapter）；2) 每次 Prompt 中重复角色核心特征；3) 固定 seed 值；4) 条件允许时上 ComfyUI + Flux。

**Q: 图片里总出现文字或水印？**
A: 在 Prompt 末尾加强负面提示：`No text, no watermark, no subtitles, no logos`。

---

## 配音相关

**Q: TTS 声音太机械？**
A: 尝试调整 speed 参数（0.9-1.1 更自然）；使用 `tts-1-hd` 模型。

**Q: 如何控制 TTS 的情绪？**
A: 通过标点符号和语气词引导：`"什么……？"`、`"你到底是谁！！！"`。

**Q: 多个角色对话时如何区分？**
A: 为每个角色分配固定音色（通过 VOICE_MAP），并在 Prompt 中标记说话者。

---

## 视频生成相关

**Q: Seedance 2.0 和 MiniMax H3 怎么选？**
A: Seedance 多图参考能力更强，画面质量更稳定，推荐首选。MiniMax 生成速度更快但质量波动大。

**Q: 本地部署 MiniMax H3 需要什么配置？**
A: 推荐 RTX 4090 24GB，显存低于 16GB 可能OOM。首次部署约需下载 10-20GB 模型文件。

**Q: 每个分镜都要生成视频吗？**
A: 不需要。建议 40-60% 的分镜生成视频片段（特写表情、对话场景），其余用静态图+Ken Burns 缩放效果。

**Q: 视频片段拼接后画面跳跃怎么办？**
A: 相邻镜头之间添加交叉溶解转场（FFmpeg `xfade` 滤镜），或确保运动描述一致。

## 剧本相关

**Q: 剧本写多长合适？**
A: 单集建议 15-25 个镜头，总时长 60-90 秒。太长观众容易疲劳，太短故事讲不完整。

**Q: 如何让 LLM 生成的剧本质量更高？**
A: 分两步：先生成大纲确认故事走向，再生成详细剧本。在 Prompt 中加入具体示例格式，限制对话长度。

---

## 流程相关

**Q: 整个流程大概需要多久？**
A: 一部 20 镜头、1 分钟的漫剧，首次运行约 10-30 分钟（取决于网络和 API 速度）。

**Q: 如何提高批量生成速度？**
A: 使用并发请求（asyncio）；增加 API 配额；本地部署 Stable Diffusion。

**Q: 想做系列剧（同一世界观多集）？**
A: 第一集生成好角色参考图后，后续集数复用；建立风格指南文档保持统一。
