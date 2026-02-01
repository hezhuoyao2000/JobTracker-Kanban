# 求职申请跟踪器 - 看板式工作申请管理工具

[English Version](README.md)

## 📋 项目概述

求职申请跟踪器是一个基于 Next.js 和 TypeScript 构建的现代化看板式工作申请管理工具。它通过可视化看板界面帮助求职者组织和跟踪工作申请流程，展示求职过程的不同阶段（例如：准备中、已投递、面试中、收到Offer、已拒绝）。

## ✨ 核心功能

- **可视化看板**: 拖拽式界面，可在自定义列之间管理工作申请
- **本地存储**: 所有数据保存在浏览器 localStorage 中（无需后端）
- **完整CRUD操作**: 通过直观的表单创建、读取、更新和删除工作申请
- **拖拽功能**: 使用 @dnd-kit 实现的流畅拖拽体验
- **现代化UI**: 基于 gluestack-ui 和 NativeWind (Tailwind CSS) 构建的简洁、响应式界面
- **深色/浅色模式**: 内置主题切换
- **类型安全**: 完整的 TypeScript 支持，包含全面的类型定义
- **单元测试**: 业务逻辑层和存储层的全面测试覆盖

## 🛠 技术栈

### 前端框架
- **Next.js 16.1.1** - 使用 App Router 的 React 框架
- **React 19.2.3** - UI 库
- **TypeScript** - 类型安全和更好的开发体验

### UI 和样式
- **gluestack-ui** - 一致性设计系统的组件库
- **NativeWind** - React Native/Web 的 Tailwind CSS
- **Tailwind CSS 3.4.17** - 实用优先的 CSS 框架
- **@dnd-kit/core** - 拖拽功能
- **lucide-react** - 图标库

### 状态和数据管理
- **React Context API** - 看板数据的状态管理
- **浏览器 localStorage** - 客户端数据持久化
- **自定义 Hooks** - `useBoard`、`useDragAndDrop`、`useSourcePlatform`

### 开发工具
- **Vitest** - 测试框架
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

## 📁 项目结构

```
jobtrackerfrontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── kanban/
│   │   │   │   ├── context/           # BoardContext 状态管理
│   │   │   │   ├── hooks/             # 自定义钩子 (useBoard, useDragAndDrop 等)
│   │   │   │   ├── services/          # 业务逻辑和存储服务
│   │   │   │   ├── KanbanBox.tsx      # 主看板组件
│   │   │   │   ├── KanbanColumn.tsx   # 单列组件
│   │   │   │   ├── TaskCard.tsx       # 工作卡片组件
│   │   │   │   ├── FormEditWindow.tsx # 编辑/创建表单弹窗
│   │   │   │   ├── AddNewButton.tsx   # 添加新工作按钮
│   │   │   │   └── PreviewWindow.tsx  # 预览组件
│   │   │   └── theme/                 # 主题上下文和令牌
│   │   ├── services/
│   │   │   ├── api/                   # API 客户端设置
│   │   │   └── types/                 # TypeScript 类型定义
│   │   ├── layout.tsx                 # 根布局
│   │   ├── page.tsx                   # 首页
│   │   └── globals.css                # 全局样式
├── components/ui/                     # gluestack-ui 组件包装器
├── doc/                              # 文档
│   ├── requirement.md                 # 产品需求文档
│   ├── progress.md                    # 开发进度跟踪
│   └── README.md                      # 本文档
├── public/                           # 静态资源
└── package.json                      # 依赖和脚本
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

## 🧪 测试

运行测试套件：
```bash
npm test
# 或
yarn test
# 或
pnpm test
# 或
bun test
```

运行带覆盖率的测试：
```bash
npm run coverage
# 或
yarn coverage
# 或
pnpm coverage
# 或
bun coverage
```

## 🏗 架构设计

应用采用分层架构：

1. **存储层** (`StorageService.ts`): 处理 localStorage 读写操作，包含错误处理和日期序列化
2. **业务逻辑层** (`BoardService.ts`): 添加、移动、更新和删除工作卡片的纯函数。完全可测试，与框架无关
3. **钩子层** (`useBoard.ts`, `useDragAndDrop.ts`): 将业务逻辑连接到 UI 状态的 React 钩子
4. **UI层**: 渲染看板和处理用户交互的 React 组件
5. **上下文层** (`BoardContext.tsx`): 提供全局状态管理，避免属性传递

## 🔧 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm test` - 运行测试
- `npm run coverage` - 运行带覆盖率报告的测试

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

## 🙏 致谢

- 基于 [Next.js](https://nextjs.org) 构建
- UI 组件来自 [gluestack-ui](https://ui.gluestack.io/)
- 图标来自 [lucide-react](https://lucide.dev/)
- 拖拽功能来自 [@dnd-kit](https://dndkit.com/)