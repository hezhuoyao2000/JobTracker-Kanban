<div align="center">

# ✨ 求职申请跟踪器 ✨

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

简体中文 | [English](./README.en-US.md)

</div>

## 📋 项目概述

求职申请跟踪器是一个基于 Next.js 和 TypeScript 构建的现代化看板式工作申请管理工具。它通过可视化看板界面帮助求职者组织和跟踪工作申请流程，展示求职过程的不同阶段（例如：准备中、已投递、面试中、收到Offer、已拒绝）。

## ✨ 核心功能

- **可视化看板**: 拖拽式界面，可在自定义列（功能未实现）之间管理工作申请
- **本地存储**: 所有数据保存在浏览器 localStorage 中（无需后端），暂时没写
- **拖拽功能**: 使用 @dnd-kit 实现的流畅拖拽体验
- **深色/浅色模式**: 内置主题切换

## 🛠 技术栈

### 前端框架
- **Next.js 16.1.1** - 使用 App Router 的 React 框架
- **React 19.2.3** - UI 库
- **TypeScript** - 类型安全和更好的开发体验

### UI 和样式
- **gluestack-ui**
- **NativeWind** - React Native/Web 的 Tailwind CSS
- **Tailwind CSS 3.4.17**
- **@dnd-kit/core** - 拖拽功能
- **lucide-react** - 图标库


```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 和 npm/yarn/pnpm/bun

### 安装步骤

1. 克隆仓库：
```bash
git clone <仓库地址>
cd jobtrackerfrontend
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

3. 启动开发服务器：
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 📖 使用指南

### 添加工作申请
1. 点击"添加新申请"按钮或点击任何列中的空白区域
2. 填写职位名称和公司名称（必填）
3. 可选添加职位链接、工作地点、标签和备注
4. 选择当前状态（列）
5. 点击"保存"将申请添加到看板

### 管理申请
- **拖拽**: 点击并拖拽卡片在列之间移动以更新状态
- **编辑**: 点击任何卡片打开编辑表单
- **删除**: 点击编辑表单中的垃圾桶图标（即将添加确认对话框）
- **筛选**: 卡片根据状态列自动筛选

### 数据持久化
所有数据自动保存到浏览器的 localStorage 中。无需账户或网络连接。您的数据将在浏览器会话之间持续保存。


```
## 📈 项目状态

**当前版本**: MVP（最小可行产品）- 96% 完成

### ✅ 已完成功能
- 数据模型和 TypeScript 类型
- 具有完整测试覆盖的业务逻辑层
- 与 localStorage 集成的存储层
- 状态管理的 React 钩子
- 完整的 UI 组件（看板、列、卡片、表单）
- 拖拽功能
- 主题切换（深色/浅色模式）
- 响应式设计
- 来源平台选择
- 动态悬停样式和视觉反馈

### 🔄 进行中/计划中
- 删除确认对话框
- 增强的错误处理和用户反馈
- 加载状态和成功通知
- 列自定义（添加/重命名/重新排序）
- 搜索和筛选功能
- 统计和分析仪表板

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证开源。
