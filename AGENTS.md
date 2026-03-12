---
alwaysApply: true
---
# JobTrackerFrontend Project Rules

## 项目概述
职位跟踪前端应用，使用 Next.js App Router + gluestack-ui v2 + Tailwind CSS 构建。

## 技术栈
- **框架**: Next.js 16 (App Router) + React 19
- **UI 库**: gluestack-ui v2 + Tailwind CSS
- **状态管理**: @tanstack/react-query
- **HTTP 客户端**: axios + axios-auth-refresh
- **拖拽**: @dnd-kit/core
- **测试**: vitest + jsdom
- **类型检查**: TypeScript 5

## 项目结构
- `/app` - Next.js App Router 页面和布局
- `/components` - 可复用 UI 组件
- `/styles` - 全局样式
- 配置文件: `tailwind.config.ts`, `next.config.ts`

## 开发规范
1. 使用 TypeScript 严格模式
2. 优先使用 gluestack-ui v2 组件
3. 使用 Tailwind CSS 工具类进行样式设计
4. 遵循 Next.js App Router 约定
5. 组件使用命名导出，函数式组件

## 命令
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 运行 ESLint
- `npm test` - 运行测试
- `npm run coverage` - 生成测试覆盖率报告


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 运行测试
npm test

# 测试覆盖率
npm run coverage

# Lint
npm run lint
```

---

## 项目概述

职位跟踪看板应用 (Job Tracker) - 用户可创建看板，在列中管理职位卡片（投递状态：Wish list → Applied → Interviewing → Offered → Rejected）。

---

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16 (App Router) | 应用框架 |
| React 19 | UI 库 |
| TypeScript | 类型系统 |
| gluestack ui v2 | UI 组件库 |
| Tailwind CSS | 样式 |
| @tanstack/react-query | 数据获取与缓存 |
| @dnd-kit/core | 拖拽功能 |
| axios + axios-auth-refresh | HTTP 客户端与自动刷新 Token |
| react-toastify | Toast 通知 |
| vitest | 测试框架 |

---

## 项目结构

```
src/
├── app/                      # Next.js App Router 主目录
│   ├── components/           # 全局共享组件
│   │   ├── auth/             # 认证相关组件
│   │   │   ├── AuthContext.tsx
│   │   │   └── AuthModal/    # 登录/注册弹窗
│   │   ├── kanban/           # 看板核心组件
│   │   │   ├── context/
│   │   │   │   └── BoardContext.tsx    # 看板状态管理
│   │   │   ├── hooks/
│   │   │   │   ├── useBoard.ts         # 看板数据加载
│   │   │   │   └── useDragAndDrop.ts   # 拖拽逻辑
│   │   │   ├── services/
│   │   │   │   ├── BoardService.ts     # 看板业务逻辑
│   │   │   │   └── StorageService.ts   # localStorage 封装
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── ...
│   │   └── theme/            # 主题切换组件
│   ├── job/                  # 职位相关页面
│   │   └── page.tsx
│   ├── services/             # API 服务层
│   │   ├── api/              # API 调用封装
│   │   │   ├── auth.ts
│   │   │   ├── board.ts
│   │   │   ├── card.ts
│   │   │   └── client.ts     # Axios 实例配置
│   │   └── types/            # TypeScript 类型定义
│   │       ├── backendtypes/ # 后端 DTO 类型
│   │       ├── frontendtypes/# 前端专用类型
│   │       ├── transformer/  # 数据转换器
│   │       │   └── boardTransformer.ts
│   │       └── common.ts     # 通用类型 (UUID, ISODateString)
│   ├── grocery/              # Grocery 模块（独立子应用）
│   └── page.tsx              # 首页
```

---

## 核心架构

### 状态管理

- **BoardContext**: 管理看板全局状态（columns、cards、loading 状态等）
- **AuthContext**: 管理用户认证状态
- **ThemeContext**: 管理主题切换
- localStorage 用于持久化用户信息和 Token

### API 层

- 所有 API 调用通过 `src/app/services/api/` 封装
- 使用 axios 实例，自动处理 JWT Token 注入和刷新
- 统一响应格式：`ApiResponse<T>`

```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

### 数据类型

- 所有 ID 字段使用 `UUID` 类型（string 别名）
- 时间字段使用 ISO 8601 格式字符串
- 类型定义位于 `src/app/services/types/`

---

## 后端接口

后端为 Spring Boot 应用，运行在 `http://localhost:8080`

### 认证接口（无需 Token）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/login` | 用户登录（用户名 + 密码） |
| POST | `/auth/register` | 用户注册 |

### 看板接口（需 Token）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/board/load` | 加载看板数据 |
| POST | `/board/create` | 创建看板 |
| POST | `/board/card/create` | 创建卡片 |
| POST | `/board/card/update` | 更新卡片 |
| POST | `/board/card/move` | 移动卡片 |
| POST | `/board/card/delete` | 删除卡片（软删除） |
| POST | `/board/column/update` | 更新列 |

详细接口定义见 [`docs/API_INTEGRATION_GUIDE.md`](./docs/API_INTEGRATION_GUIDE.md)

---

## 开发规范

### 代码风格

- 使用 TypeScript，严格模式
- ESLint + Prettier 格式化
- 使用 gluestack ui v2 组件优先
- Tailwind CSS 实用类命名

### 组件开发

- 使用函数组件 + Hooks
- 使用 `use client` 标记客户端组件
- 登录/注册功能参考 `src/app/components/auth/AuthModal/`
- 看板组件参考 `src/app/components/kanban/`

### 添加新页面

- 页面放在 `src/app/` 目录下，使用 Next.js App Router 约定
- 需要认证的功能使用 `useAuth()` 检查登录状态

---

## 重要注意事项

1. **不要前端生成 ID**：所有 ID 由后端生成（UUID 格式）
2. **Token 处理**：通过 axios 拦截器自动处理，无需手动注入
3. **看板数据**：通过 BoardContext 统一管理，不要直接调用 API
4. **gluestack 组件**：优先使用 gluestack 组件，而不是原生 HTML 标签
5. **UUID 类型**：使用 `src/app/services/types/common.ts` 中定义的 `UUID` 类型

---

## 现有规则

本项目的 Cursor 规则位于 [`.cursor/rules/react-rule.mdc`](./.cursor/rules/react-rule.mdc)，主要规范：

- 使用简体中文交流
- 严格遵循用户指令，不添加未要求的功能
- 优先使用 gluestack ui v2 + Tailwind CSS
- 简洁、现代的 UI 风格

---

## 测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx vitest src/app/components/kanban/services/BoardService.test.ts

# 生成覆盖率报告
npm run coverage
```

---

## 文档

- [`docs/API_INTEGRATION_GUIDE.md`](./docs/API_INTEGRATION_GUIDE.md) - API 接口对接指南
- [`docs/BACKEND_DEVELOPMENT_GUIDE.md`](./docs/BACKEND_DEVELOPMENT_GUIDE.md) - 后端开发指南
- [`docs/FRONTEND_MIGRATION_GUIDE.md`](./docs/FRONTEND_MIGRATION_GUIDE.md) - 前端迁移指南（UUID 修复）
