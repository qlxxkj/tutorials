# 常见问题 FAQ

## 环境相关

**Q: 如何获取 Palantir Foundry 的使用权限？**
A: 联系 Palantir 销售或客户经理申请试用/企业账号。也可通过 Palantir Academy 申请学习环境。

**Q: 开发需要哪些软件？**
A: Node.js 18+, VS Code, Palantir CLI。所有开发都在浏览器中完成，不需要本地部署。

---

## 开发相关

**Q: Template Builder 和 TypeScript Templates 怎么选？**
A: 简单面板用 Template Builder，复杂交互和定制 UI 用 TypeScript。建议先用 Builder 快速原型，再迁移到代码。

**Q: 如何处理大数据量？**
A: 使用分页、虚拟滚动、服务端过滤。避免一次性加载超过 1000 条记录。

**Q: Ontology Action 执行失败怎么办？**
A: 检查 1) 用户权限 2) 对象状态是否允许操作 3) 参数是否正确。查看 Audit Log 定位问题。

---

## AIP 相关

**Q: AIP Agent 准确率不高怎么办？**
A: 1) 优化 System Prompt 2) 添加 Few-shot 示例 3) 完善 Tool 描述 4) 考虑更换更强的模型。

**Q: Agent 可以访问所有数据吗？**
A: 不能。Agent 的权限继承自调用它的用户，受 Foundry 权限系统控制。

---

## 职业相关

**Q: FDE 需要多强的编程能力？**
A: 需要扎实的 TypeScript + React 基础，但不需要算法竞赛水平。更注重工程实践和产品思维。

**Q: FDE 和传统前端工程师有什么区别？**
A: FDE 更深地参与业务逻辑和数据建模，需要理解 Ontology 和企业数据架构，而不只是做 UI。