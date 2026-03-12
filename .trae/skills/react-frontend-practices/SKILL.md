---
name: react-frontend-practices
description: 综合 React/Next.js 性能最佳实践与高质感前端设计指南。在编写或评审 React/Next.js 组件与页面、实现数据获取与打包优化、或设计/实现具有辨识度的前端界面时使用本技能。
---

# React 与前端设计实践

本技能整合两类指南：**React/Next.js 性能最佳实践**（Vercel 工程经验）与**高质感、有辨识度的前端设计**（避免通用 AI 审美）。在相关任务中优先查阅对应参考文档。

## 何时使用

- **性能与实现**：编写或重构 React/Next.js 组件与页面、数据获取、打包与加载优化、代码评审中的性能问题。
- **设计与界面**：搭建组件、页面或完整前端应用，需要独特审美、排版、动效与整体视觉一致性时。

## 快速参考

### 性能（详见 [react-best-practices.md](react-best-practices.md)）

- **关键**：消除瀑布请求（延后 await、Promise.all、Suspense）；控制包体积（避免 barrel 导入、next/dynamic、按需加载）。
- **高影响**：服务端用 React.cache/LRU、减少 RSC 序列化、并行请求；客户端用 SWR、惰性状态、startTransition。
- **渲染**：content-visibility、避免水合不一致、显式条件渲染。

### 设计（详见 [frontend-design.md](frontend-design.md)）

- **设计思路**：明确用途与受众；选定鲜明风格（极简/极繁/复古/有机/奢华/趣味/编辑感/粗野/装饰艺术等）；技术约束与差异化记忆点。
- **执行要点**：排版独特、配色统一、动效有重点、布局非常规、背景与细节营造氛围；避免 Inter/Roboto、紫白渐变等通用 AI 审美。

## 参考文档

- **[react-best-practices.md](react-best-practices.md)**：React/Next.js 性能优化完整规则与优先级。
- **[frontend-design.md](frontend-design.md)**：前端美学与差异化界面设计指南。

两篇文档均保留原文件名，便于直接引用与检索。