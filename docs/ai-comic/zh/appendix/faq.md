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

**Q: 生成的图片质量不稳定？**
A: 优化 Prompt，增加细节描述；尝试不同的 temperature 值（0.7-0.9）。

**Q: 角色在不同画面中不一致？**
A: 确保每次生成都传入角色参考图；在 Prompt 中重复关键特征描述；使用固定 seed。

**Q: 图片中出现文字或水印？**
A: 在 Prompt 末尾添加 "No text, no watermark, no subtitles"。

**Q: 如何降低生成成本？**
A: 先生成 512x512 预览确认效果，满意后再高清生成；批量请求（如果 API 支持）。

---

## 配音相关

**Q: TTS 声音太机械？**
A: 尝试调整 speed 参数（0.9-1.1 更自然）；使用 `tts-1-hd` 模型。

**Q: 如何控制 TTS 的情绪？**
A: 通过标点符号和语气词引导：`"什么……？"`、`"你到底是谁！！！"`。

**Q: 多个角色对话时如何区分？**
A: 为每个角色分配固定音色（通过 VOICE_MAP），并在 Prompt 中标记说话者。

---

## 视频合成相关

**Q: FFmpeg 拼接视频时黑屏/无声音？**
A: 检查所有输入文件的编码是否一致；使用 `-c copy` 避免重新编码。

**Q: 视频文件中文字幕显示乱码？**
A: 确保 SRT 文件使用 UTF-8 编码保存；在 FFmpeg 中指定字体。

**Q: 视频太大，不适合发短视频平台？**
A: 降低码率：`-b:v 2000k`；压缩到 720p：`scale=720:1280`。

---

## 流程相关

**Q: 整个流程大概需要多久？**
A: 一部 20 镜头、1 分钟的漫剧，首次运行约 10-30 分钟（取决于网络和 API 速度）。

**Q: 如何提高批量生成速度？**
A: 使用并发请求（asyncio）；增加 API 配额；本地部署 Stable Diffusion。

**Q: 想做系列剧（同一世界观多集）？**
A: 第一集生成好角色参考图后，后续集数复用；建立风格指南文档保持统一。
