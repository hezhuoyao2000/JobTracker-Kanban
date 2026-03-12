<div align="center">

# ✨ 求职申请跟踪器 ✨

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**[🌐 在线体验](https://jobtrackerkanban.vercel.app)**

简体中文 | [English](./README.en-US.md)

</div>

## 📋 项目概述

求职申请跟踪器是一个基于 Next.js 和 TypeScript 构建的现代化看板式工作申请管理工具。它通过可视化看板界面帮助求职者组织和跟踪工作申请流程，展示求职过程的不同阶段（例如：待投递、已投递、面试中、收到Offer、已拒绝）。

## ✨ 核心功能

- **可视化看板**: 拖拽式界面，可在列之间管理工作申请
- **用户认证**: 支持登录/注册，数据存储在云端
- **拖拽功能**: 使用 @dnd-kit 实现的流畅拖拽体验
- **深色/浅色模式**: 内置主题切换
- **数据持久化**: 所有数据通过 REST API 存储在后端

## 🛠 技术栈

### 前端框架
- **Next.js 16.1.1** - 使用 App Router 的 React 框架
- **React 19.2.3** - UI 库
- **TypeScript** - 类型安全和更好的开发体验

### UI 和样式
- **gluestack-ui v2** - React Native 风格的 UI 组件库
- **Tailwind CSS 3.4.17** - 原子化 CSS 框架
- **@dnd-kit/core** - 拖拽功能
- **lucide-react** - 图标库

### 状态管理与网络
- **@tanstack/react-query** - 数据获取与缓存
- **axios + axios-auth-refresh** - HTTP 客户端与自动刷新 Token
- **react-toastify** - Toast 通知

### 测试
- **vitest** - 单元测试框架
- **jsdom** - 浏览器环境模拟

## 🚀 快速开始

### 环境要求
- Node.js 18+ 和 npm/yarn/pnpm/bun
- 后端服务运行在 http://localhost:8080（可选，本地存储模式可用）

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

### 用户认证
1. 点击页面顶部的"登录"或"注册"按钮
2. 注册新账户或使用已有账户登录
3. 登录后您的数据将同步到云端

### 添加工作申请
1. 点击"添加新申请"按钮
2. 填写职位名称和公司名称（必填）
3. 可选添加职位链接、工作地点、标签和备注
4. 选择当前状态（列）
5. 点击"保存"将申请添加到看板

### 管理申请
- **拖拽**: 点击并拖拽卡片在列之间移动以更新状态
- **编辑**: 点击任何卡片打开编辑表单
- **删除**: 点击编辑表单中的垃圾桶图标

### 数据持久化
登录后，所有数据自动保存到后端数据库。可以在不同设备间同步访问。

## 📈 项目状态

**当前版本**: MVP（最小可行产品）

### ✅ 已完成功能
- 数据模型和 TypeScript 类型定义
- 业务逻辑层及完整测试覆盖
- 用户认证系统（登录/注册）
- REST API 集成
- JWT Token 自动刷新
- 状态管理的 React 上下文和 Hooks
- 完整的 UI 组件（看板、列、卡片、表单）
- 拖拽功能
- 主题切换（深色/浅色模式）
- 响应式设计
- 来源平台选择
- Toast 通知反馈

### 🔄 进行中/计划中
- 列自定义（添加/重命名/重新排序）
- 搜索和筛选功能
- 统计和分析仪表板

## 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证开源。