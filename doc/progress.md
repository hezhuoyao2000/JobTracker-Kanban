# 项目进度跟踪文档

**项目名称：** Job Tracker (求职申请跟踪器)  
**最后更新：** 2026-01-26  
**当前阶段：** 数据层与 Hook 已完成，开始 UI 层集成

---

## 📊 整体进度概览

```
[████████████████░░░░] 75% 完成（数据层 + Hook）

✅ 已完成：数据模型、业务逻辑、存储层（含 Date 反序列化）、useBoard Hook
🔄 进行中：UI 组件集成（优先级 3）
⏳ 待开始：拖拽功能、卡片操作 UI、交互优化
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
- [x] 文件位置：`src/app/components/kanban/hooks/useBoard.ts`

---

## 🔄 进行中模块

### 5. UI 组件层 (20%) — 当前任务
- [x] `KanbanBox` - 看板容器组件（结构已创建）
- [x] `KanbanColumn` - 列组件（结构已创建）
- [x] `TaskCard` - 卡片组件（结构已创建）
- [ ] **待实现：** 在 `KanbanBox` 中使用 `useBoard`，把 `board` 与操作方法传给子组件
- [ ] **待实现：** `KanbanColumn` 接收 `column`、`cards` props，动态渲染列名和卡片列表
- [ ] **待实现：** `TaskCard` 接收 `card` prop，展示职位名、公司名等
- [ ] **待实现：** 空状态展示（某列无卡片时显示「暂无申请」等）

---

## ⏳ 待开始模块

### 6. 拖拽功能 (0%)
- [ ] 集成 `@dnd-kit/core` 到 `KanbanBox`
- [ ] 实现卡片拖拽移动
- [ ] 拖拽视觉反馈
- [ ] 拖拽后自动保存

### 7. 卡片操作 UI (0%)
- [ ] 添加卡片按钮/表单
- [ ] 编辑卡片弹窗/表单
- [ ] 删除卡片确认对话框
- [ ] 卡片详情展示

### 8. 交互优化 (0%)
- [ ] 加载状态处理
- [ ] 错误提示
- [ ] 操作成功反馈

---

## 🎯 下一步行动计划

### ~~优先级 1：完善 Hook 层~~ ✅ 已完成

### ~~优先级 2：修复 Date 序列化~~ ✅ 已完成

---

### 优先级 3：集成 Hook 到 UI（当前任务，预计 1–2 小时）
**目标：** 让看板能够显示真实数据（先「能看到数据」，再做拖拽和操作 UI）

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

### 优先级 4：实现拖拽功能（预计 2-3 小时）
**目标：** 实现卡片拖拽移动

**任务清单：**
1. 在 `KanbanBox` 中配置 `DndContext`
   - 设置 `onDragEnd` 处理器
   - 调用 `handleMoveCard` 方法
2. 为 `TaskCard` 添加拖拽能力
   - 使用 `useDraggable` Hook
3. 为 `KanbanColumn` 添加放置区域
   - 使用 `useDroppable` Hook
4. 添加拖拽视觉反馈
   - 拖拽时的样式变化
   - 放置区域的视觉提示

**思考点：**
- `@dnd-kit` 的 `id` 如何与我们的 `cardId` 和 `columnId` 对应？
- 如何防止卡片被拖到无效的列？

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

## 📝 技术债务与注意事项

1. **组件未集成**
   - 当前：UI 组件是静态的，没有使用真实数据
   - 影响：无法看到实际效果
   - 优先级：高（本阶段解决）

2. **错误处理**
   - 当前：StorageService 有 try-catch，但 UI 层没有错误提示
   - 影响：用户操作失败时无反馈
   - 优先级：中

3. **类型安全**
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
3. **集成 Hook 到 UI（优先级 3）** ← 当前
4. 实现拖拽（优先级 4）
5. 添加操作 UI（优先级 5）

**为什么先做 UI 集成？**
- 先让「数据 → 视图」这条链路跑通，能看到真实列和卡片。
- 再做拖拽、添加/编辑/删除时，可以直接在现有组件上接 `handleMoveCard`、`handleAddJob` 等，更直观、也便于自测。

---

## 📅 里程碑记录

- **2026-01-26**：业务逻辑层、存储层（含 Date 反序列化）、useBoard Hook 完成
- **2026-01-26**：开始 UI 层集成（优先级 3）
- 待补充...

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
