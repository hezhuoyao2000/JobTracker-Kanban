# 项目进度跟踪文档

**项目名称：** Job Tracker (求职申请跟踪器)  
**最后更新：** 2026-02-01  
**当前阶段：** 拖拽完成，待删除确认与交互优化

---

## 📊 整体进度概览

```
[███████████████████░] 95% 完成（MVP 卡片操作 + 拖拽闭环）

✅ 已完成：数据层、Hook、BoardContext、看板展示、添加/编辑/删除卡片、空状态、真数据接入、拖拽功能
⏳ 待开始：删除确认对话框、交互优化（加载/错误/成功反馈）
```

---

## ✅ 已完成模块

### 1. 数据模型层 (100%)
- [x] `JobCard` 类型定义
- [x] `Column` 类型定义
- [x] `BoardData` 类型定义
- [x] 类型文件位置：`src/app/services/types/frontendtypes/frontend.ts`

### 2. 业务逻辑层 (100%)
- [x] `BoardService.addJob()` - 添加工作申请
- [x] `BoardService.moveCard()` - 移动卡片到不同列
- [x] `BoardService.updateCard()` - 更新卡片信息
- [x] `BoardService.deleteCard()` - 删除卡片
- [x] 文件位置：`src/app/components/kanban/services/BoardService.ts`
- [x] 单元测试：`BoardService.test.ts` ✅

### 3. 存储层 (100%)
- [x] `StorageService.saveBoard()` - 保存到 localStorage
- [x] `StorageService.loadBoard()` - 从 localStorage 加载（含 Date 反序列化）
- [x] `StorageService.clearBoard()` - 清空数据（调试用）
- [x] Date 序列化/反序列化已修复（`dateReviver` + `DATE_KEYS`）
- [x] 文件位置：`src/app/components/kanban/services/StorageService.ts`
- [x] 单元测试：`StorageService.test.ts` ✅

### 4. React Hook 层 (100%)
- [x] `useBoard()` - 状态初始化 + 所有操作方法
- [x] `handleAddJob()` - 添加工作申请
- [x] `handleMoveCard()` - 移动卡片
- [x] `handleUpdateCard()` - 更新卡片
- [x] `handleDeleteCard()` - 删除卡片
- [x] `useDragAndDrop()` - 拖拽逻辑封装（sensors、handleDragStart/End、activeCard）
- [x] 文件位置：`src/app/components/kanban/hooks/useBoard.ts`、`useDragAndDrop.ts`

### 5. UI 组件层 (95%) — MVP 闭环完成
- [x] `KanbanBox` - 从 BoardContext 获取 board，动态渲染列
- [x] `KanbanColumn` - 接收 `column`、`cards`，空状态显示「暂无申请」
- [x] `TaskCard` - 从 BoardContext 获取 openCard，点击打开编辑
- [x] `FormEditWindow` - 编辑/新建共用，Save 按钮已修复（form 属性关联）
- [x] `AddNewButton` - 连接 openCard(null)，打开新建表单
- [x] **BoardContext** - useBoard 单点调用，消除 props drilling
- [ ] **待实现：** 删除卡片确认对话框（当前直接删除无二次确认）

### 6. 存储层优化 (100%)
- [x] StorageService 剔除假数据，无缓存时返回空卡片
- [x] initialData 仅保留 INITIAL_DATA（列定义 + 空 cards）
- [x] initialData.ts 中 MOCK_CARDS 等死代码可清理（已不被引用）

### 7. 拖拽功能 (100%)
- [x] 集成 `@dnd-kit/core` 到 `KanbanBox`
- [x] 实现卡片拖拽移动
- [x] 拖拽视觉反馈（原位置占位符 + DragOverlay 高亮）
- [x] 拖拽后自动保存
- [x] DragOverlay：拖拽时卡片始终显示在最上层
- [x] useDragAndDrop Hook：sensors、handleDragStart/handleDragEnd、activeCard 封装
- [x] openCard(cardId)：拖拽后编辑弹窗 Current status 正确显示新列

---
## ⏳ 待开始模块

### 8. 卡片操作 UI 补充 (10%)
- [x] 添加卡片按钮/表单
- [x] 编辑卡片弹窗/表单
- [ ] 删除卡片确认对话框（PRD 要求用户确认后删除）
- [x] 卡片详情展示（点击卡片打开 FormEditWindow）

### 9. 交互优化 (0%)
- [ ] 加载状态处理
- [ ] 错误提示
- [ ] 操作成功反馈

---

## 🎯 下一步行动计划

### ~~优先级 1：完善 Hook 层~~ ✅ 已完成

### ~~优先级 2：修复 Date 序列化~~ ✅ 已完成

---

### ~~优先级 3：集成 Hook 到 UI~~ ✅ 已完成
**目标：** 让看板能够显示真实数据

**任务清单：**
1. 在 `KanbanBox` 中使用 `useBoard` Hook
   - 调用 `useBoard()` 获取 `board`、`handleAddJob`、`handleMoveCard`、`handleUpdateCard`、`handleDeleteCard`
   - 暂时只需把 `board` 和列/卡片渲染用到的数据传给子组件，操作方法可在后续步骤再往下传
2. 修改 `KanbanColumn` 组件
   - 增加 props：`column: Column`、`cards: JobCard[]`
   - 列标题用 `column.name`
   - 用 `cards.map(card => <TaskCard key={card.id} card={card} />)` 渲染卡片列表
   - 当 `cards.length === 0` 时显示空状态（如「暂无申请」）
3. 在 `KanbanBox` 中动态渲染列
   - 用 `board.columns` 替代写死的三份 `<KanbanColumn />`
   - 对每一列，用 `board.cards.filter(card => card.statusId === column.id)` 得到该列卡片，传给 `KanbanColumn`
4. 修改 `TaskCard` 组件
   - 增加 prop：`card: JobCard`
   - 至少显示 `card.jobTitle`、`card.companyName`（样式可后续再调）

**思考点：**
- 过滤卡片是否要包一层 `useMemo(board.cards, columns)`？数据量小可先不做，后面再优化。
- 空状态放在列内（`KanbanColumn` 内判断 `cards.length === 0`）即可，便于每列独立展示。

---

## 🛠 UI 层开发指导（优先级 3 实施要点）

下面按「先数据、再结构、再展示」的顺序，方便你手写实现。

### 第一步：KanbanBox 接上 useBoard

- 在 `KanbanBox` 里调用 `useBoard()`，解构出 `board` 以及后续会用到的方法（本阶段可只解构 `board`）。
- 若 `KanbanBox` 里还没有 `'use client'`，需要加上，因为用了 React Hook。
- **验证方式：** 在 JSX 里临时写 `{JSON.stringify(board.columns.length)}`，刷新页面应看到数字（例如 5），说明数据已从 storage 进到组件。

### 第二步：KanbanColumn 改为受控

- 给 `KanbanColumn` 定义 props 类型（或 interface）：`column: Column`、`cards: JobCard[]`。可从 `frontend.ts` 导入 `Column`、`JobCard`。
- 列标题改为渲染 `column.name`，不再写死 `"text"`。
- 卡片列表：`cards.map(card => <TaskCard key={card.id} card={card} />)`。  
  **注意：** `key` 必须用稳定唯一值（如 `card.id`），否则 React 会警告且可能状态错乱。
- 当 `cards.length === 0` 时，不渲染 `TaskCard`，改显示一段提示文案（如「暂无申请」），放在同一列内、卡片列表区域即可。

### 第三步：KanbanBox 按数据渲染列

- 把原来写死的三份 `<KanbanColumn />` 改成：  
  `board.columns.map(column => (...))`  
  每个 `column` 对应一个 `<KanbanColumn column={column} cards={...} />`。
- 「该列下的卡片」用：  
  `board.cards.filter(card => card.statusId === column.id)`  
  把这个数组当作 `cards` 传给 `KanbanColumn`。
- 列的顺序若需按 `column.order` 排序，可在 `map` 前对 `board.columns` 做一次 `slice().sort((a, b) => a.order - b.order)`，避免直接改动原数组。

### 第四步：TaskCard 显示单张卡片

- 给 `TaskCard` 增加 prop：`card: JobCard`。
- 在组件内至少显示：`card.jobTitle`、`card.companyName`。  
  样式可继续用现有 `Box` 或 className，保证先「能看到内容」再迭代样式。
- `TaskCard` 若在被 `KanbanColumn` 的 `map` 里使用，不要在这里再包一层列表，保持「一个 TaskCard 只对应一张卡片」。

### 第五步：跑通与自测

1. **无数据时：** 清空 localStorage（或用应用里的清空逻辑），刷新页面，应看到 5 列、每列空状态文案。
2. **有数据时：** 在浏览器控制台执行若干次 `StorageService` / 或将来在 UI 里加「添加卡片」后，刷新，应看到对应列下有卡片，且标题、公司名正确。
3. **类型：** 保存文件后，确认无 TypeScript 报错；`Column`、`JobCard` 的导入和使用保持一致。

完成以上五步后，看板即实现「从 useBoard 取数 → 按列渲染 → 每列展示卡片与空状态」。  
下一步再在此基础上做拖拽和「添加/编辑/删除」等操作 UI。

---

### ~~优先级 4：实现拖拽功能~~ ✅ 已完成
**目标：** 实现卡片拖拽移动

**已实现：**
- DndContext + useDragAndDrop Hook 封装（`hooks/useDragAndDrop.ts`）
- TaskCard 使用 useDraggable，KanbanColumn 使用 useDroppable
- DragOverlay 确保拖拽时卡片始终在最上层
- 拖拽后 openCard(cardId) 从 board 取最新数据，Current status 正确更新

---

### 优先级 5：添加卡片操作 UI（预计 2-3 小时）
**目标：** 实现添加、编辑、删除卡片的用户界面

**任务清单：**
1. 添加卡片功能
   - 在某个位置（比如列底部或顶部）添加"添加卡片"按钮
   - 创建表单组件或使用弹窗
   - 表单提交时调用 `handleAddJob`
2. 编辑卡片功能
   - 点击卡片时打开编辑表单
   - 表单预填充现有数据
   - 提交时调用 `handleUpdateCard`
3. 删除卡片功能
   - 添加删除按钮（可能在卡片上或编辑表单中）
   - 显示确认对话框
   - 确认后调用 `handleDeleteCard`

**思考点：**
- 表单应该用弹窗（Modal）还是内联表单？
- 如何管理表单的状态（打开/关闭）？

---

## 📐 架构指导（2026-02-01 补充）

### 问题 1：opencard 等动作透传靠 props，中间层要层层传递，用 Context 能简化吗？推荐吗？

**能简化。** 将 `onOpenCard`、`handleAddJob`、`handleUpdateCard`、`handleDeleteCard`、`handleMoveCard` 等放入 `BoardContext`，子组件通过 `useBoardContext()` 直接消费，可消除 page → KanbanBox → KanbanColumn → TaskCard 的 props drilling。

**推荐使用 Context，理由：**
- 看板级操作天然适合 Context（多个层级都需要）
- 后续拖拽、添加列等会引入更多方法，props 会继续膨胀
- 符合 React 常见模式（如 ThemeContext）
- `BoardContext.tsx` 已预留，可直接实现

**注意：** Context 会导致订阅该 Context 的组件在任意 context 值变化时重渲染。可考虑拆成 `BoardDataContext`（board）与 `BoardActionsContext`（方法，引用稳定），或使用 `useMemo` 稳定方法引用。

---

### 问题 2：page 的 useBoard 方法传 vs Box 再次引用 useBoard，选哪个？

**当前存在严重问题：** page 与 KanbanBox **都**调用了 `useBoard()`。`useBoard` 内部用 `useState`，每次调用都是独立状态，导致：
- page 的 `board` 与 KanbanBox 的 `board` 是两份不同数据
- FormEditWindow 调用 `handleUpdateCard` 只更新 page 的 board，KanbanBox 的 board 不会同步
- 反之亦然

**正确做法：只在一个地方调用 `useBoard()`**，然后通过 props 或 Context 共享。

**推荐方案：BoardContext 统一管理**
- 在 `BoardProvider` 中调用一次 `useBoard()`
- 将 `board` 及所有方法放入 Context
- page、KanbanBox、FormEditWindow、AddNewButton 等均从 Context 消费
- 这样既解决数据重复问题，也消除 props drilling

**不推荐：** KanbanBox 再次调用 useBoard。会导致数据源分裂，难以维护。

---

### 问题 3：下一步架构建议

1. **实现 BoardContext**：`BoardProvider` 内调用 `useBoard()`，提供 `board`、`handleAddJob`、`handleUpdateCard`、`handleDeleteCard`、`handleMoveCard`，以及 `openCard(card?)`、`closeCard()` 等 UI 状态（或继续由 page 管理 FormEditWindow 的开关，仅把 board 方法放入 Context）
2. **移除重复调用**：page 与 KanbanBox 不再直接调用 `useBoard()`，改为 `useBoardContext()`
3. **连接 AddNewButton**：通过 Context 的 `openCard(null)` 或类似方式打开「添加新卡片」表单

---

## 📝 技术债务与注意事项

1. **删除无确认**
   - 当前：FormEditWindow 中删除按钮直接调用 handleDelete，无二次确认
   - PRD 要求：用户确认后可永久删除
   - 优先级：中

2. **initialData 死代码**
   - 当前：MOCK_CARDS、getBoardWithMockCards、MOCK_CARD_IDS 已不被引用
   - 建议：清理以保持代码整洁
   - 优先级：低

3. **错误处理**
   - 当前：StorageService 有 try-catch，但 UI 层没有错误提示
   - 影响：用户操作失败时无反馈
   - 优先级：中

4. **类型安全**
   - 当前：大部分类型已定义，组件 props 需在本阶段补齐
   - 影响：开发时类型提示更完整
   - 优先级：中

---

## 🧪 测试状态

- [x] `BoardService` 单元测试已编写
- [x] `StorageService` 单元测试已编写（含 Date 反序列化）
- [ ] Hook 层测试（可选）
- [ ] 组件集成测试（可选）
- [ ] E2E 测试（可选）

---

## 📚 学习要点记录

### 已掌握的工程思维
1. ✅ **分层架构**：Storage → Service → Hook → Component
2. ✅ **纯函数设计**：BoardService 无副作用，易于测试
3. ✅ **类型安全**：TypeScript 类型定义完整
4. ✅ **关注点分离**：业务逻辑与 UI 分离

### 待学习的工程思维
1. 🔄 **状态管理**：如何在组件间共享状态
2. 🔄 **副作用处理**：useEffect 的使用场景
3. ⏳ **错误边界**：如何处理和展示错误
4. ⏳ **性能优化**：useMemo, useCallback 的使用

---

## 💡 下一步建议

**当前建议：**
1. ~~完善 `useBoard` Hook~~ ✅
2. ~~修复 Date 序列化~~ ✅
3. ~~集成 Hook 到 UI（优先级 3）~~ ✅
4. ~~BoardContext + useBoard 单点调用~~ ✅
5. ~~AddNewButton + 空状态 + FormEditWindow Save 修复~~ ✅
6. ~~实现拖拽（优先级 4）~~ ✅
7. **删除确认对话框**（PRD 要求用户确认后删除） ← 当前
8. 交互优化（加载/错误/成功提示）

---

### 📋 接下来未完成任务清单

| 优先级 | 任务 | 状态 |
|--------|------|------|
| ~~高~~ | ~~拖拽功能（@dnd-kit 集成）~~ | ✅ 已完成 |
| 中 | 删除卡片确认对话框 | ⏳ 待开始 |
| 中 | 交互优化（错误提示、成功反馈） | ⏳ 待开始 |
| 低 | initialData.ts 死代码清理（MOCK_CARDS 等） | ⏳ 可选 |
| 低 | 列排序、自定义列（PRD 非 MVP） | ⏳ 后期 |

**为什么先做 UI 集成？**
- 先让「数据 → 视图」这条链路跑通，能看到真实列和卡片。
- 再做拖拽、添加/编辑/删除时，可以直接在现有组件上接 `handleMoveCard`、`handleAddJob` 等，更直观、也便于自测。

---

## 📅 里程碑记录

- **2026-01-26**：业务逻辑层、存储层（含 Date 反序列化）、useBoard Hook 完成
- **2026-01-26**：开始 UI 层集成（优先级 3）
- **2026-02-01**：KanbanBox/KanbanColumn/TaskCard 接上真实数据；FormEditWindow 编辑/删除完成；AddNewButton 组件创建；进度文档更新，补充架构指导
- **2026-02-01**：BoardContext 完整接入；AddNewButton 连接 openCard(null)；空状态「暂无申请」；FormEditWindow Save 修复（form 属性 + formInstanceId）；StorageService 剔除假数据；MVP 卡片增删改查闭环完成
- **2026-02-01**：拖拽完成；useDragAndDrop Hook 封装；DragOverlay 确保拖拽卡片在最上层；openCard(cardId) 修复拖拽后 Current status 显示

---

## 🔍 代码审查检查点

在完成每个优先级后，问自己：

1. **功能是否完整？** 是否覆盖了所有用例？
2. **代码是否清晰？** 命名、结构是否易懂？
3. **类型是否安全？** TypeScript 是否报错？
4. **测试是否通过？** 现有测试是否仍然通过？
5. **是否有副作用？** 是否意外修改了其他模块？

---

**提示：** 每完成一个优先级，更新本文档的进度，并记录遇到的问题和解决方案。
