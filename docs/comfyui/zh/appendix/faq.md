# 常见问题 FAQ

## 安装相关

**Q: ComfyUI 启动后浏览器打不开？**
A: 检查终端是否有报错。可以尝试手动访问 http://127.0.0.1:8188。如果端口被占用，可以编辑 run_nvidia_gpu.bat 修改端口号。

**Q: 显存不足报错？**
A: 1) 关闭其他占用 GPU 的程序；2) 降低图片尺寸；3) 使用 --lowvram 参数启动。

---

## 模型相关

**Q: 模型下载到哪里？**
A: 根据模型类型放到对应目录：
- Checkpoint → models/checkpoints/
- LoRA → models/loras/
- ControlNet → models/controlnet/
- VAE → models/vae/

**Q: 模型不显示在列表中？**
A: 1) 检查文件扩展名是否为 .safetensors；2) 检查文件名是否包含中文或特殊字符；3) 点击刷新按钮。

---

## 使用相关

**Q: 生成的图脸部总是畸形？**
A: 1) 添加 ADetailer 节点自动修复；2) 在负提示词中加入 bad anatomy, bad face；3) 提高分辨率。

**Q: 角色一致性不够好？**
A: 1) 提高 IP-Adapter weight 到 0.9-1.0；2) 使用更清晰的参考图；3) 固定 seed 值。

**Q: 生成速度很慢？**
A: 1) 检查是否在用 GPU 模式；2) 降低 steps；3) 降低分辨率。

**Q: 工作流保存后重新加载报错？**
A: 可能是缺少自定义节点。使用 Manager 安装缺失的节点，或重新下载完整的工作流文件。
