# 前端功能构建与接口对接指南（React + ECharts）

本文档用于指导前端页面的功能实现与后端接口对接，目标是：
- 用 React 构建 UI
- 用 ECharts 展示实时曲线
- 用 SSE（Server-Sent Events）接收实时数据
- 用 ECharts `appendData` 做局部刷新，避免全量重绘

## 1. 当前后端接口现状

### 1.1 SSE 实时流（已实现）
- URL：`GET http://localhost:8080/api/iot/stream`
- Content-Type：`text/event-stream`
- 事件名：`device-data`
- 数据：`data:` 为 `DeviceReading` 的 JSON 字符串

示例 payload（字段以实际后端 `DeviceReading` 为准）：
```json
{
  "deviceId": "device-001",
  "temperature": 84.8,
  "rpm": 2710,
  "timestamp": "2026-04-12T12:00:00Z",
  "rawTemperature": 848,
  "rawRpm": 2710
}
```

重要行为约束（来自后端实现）：
- 只有当至少存在一个 SSE 客户端连接时，后端才会向 Redis Pub/Sub 发布“推送出口”消息并触发广播。
- 没有前端连接时，Redis `device:latest:*` 缓存仍会持续刷新（用于“最新值缓存”和后续 REST 查询）。

### 1.2 REST 查询接口（未实现）
Phase 6 规划中会提供：
- `GET /api/iot/latest/{deviceId}`（从 Redis 读最新值）
- `GET /api/iot/history/{deviceId}?minutes=5`（从 InfluxDB 查历史）

因此当前前端“首次打开页面”的初始化数据可以先不强依赖 REST：
- 直接等待 SSE 第一条数据到达后开始渲染
- 或临时用固定占位（Loading/No data）

## 2. 前端对接 SSE（EventSource）

### 2.1 基本用法
```js
const es = new EventSource('http://localhost:8080/api/iot/stream');

es.addEventListener('device-data', (e) => {
  const reading = JSON.parse(e.data);
  console.log('reading', reading);
});

es.onerror = (err) => {
  // 浏览器会自动重连；这里通常只做提示/统计
  console.warn('SSE error', err);
};
```

建议：
- 页面卸载时调用 `es.close()`，避免后台仍然保持连接。
- 事件名使用 `device-data`，不要用默认 `message` 事件（避免后端未来扩展多事件时冲突）。

### 2.2 React Hook 封装建议
推荐把 SSE 连接封装成 hook，统一处理连接、断开、解析与节流。

接口建议（仅示意）：
- `useDeviceStream({ url, onReading, enabled })`
- `enabled=false` 时不建立连接（符合“不触发就不发”的需求）

## 3. ECharts 实时曲线：用 appendData 局部刷新

### 3.1 为什么用 appendData
实时数据流如果每条都 `setOption({ series: [{ data: bigArray }] })` 会导致：
- 频繁 diff + 重绘
- 大数组重复传输
- 页面卡顿、内存增长

`appendData` 适合“持续追加新点”的场景：
- 不需要每次把历史数据整包塞回去
- 能够显著降低 UI 线程压力

### 3.2 数据建模（推荐）
将每条 reading 映射成两个时间点：
- 温度点：`[timestampMs, temperature]`
- 转速点：`[timestampMs, rpm]`

约定：
- `timestamp` 为空时，前端用 `Date.now()` 兜底
- 时间轴用 `type: 'time'`

### 3.3 图表 option（建议的最小配置）
建议拆成 2 条 line：
- series[0]：temperature（yAxisIndex=0）
- series[1]：rpm（yAxisIndex=1）

示例（伪代码，关键字段展示）：
```js
const option = {
  animation: false,
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'time' },
  yAxis: [
    { type: 'value', name: '°C' },
    { type: 'value', name: 'RPM' }
  ],
  series: [
    { name: 'Temperature', type: 'line', showSymbol: false, yAxisIndex: 0, data: [] },
    { name: 'RPM', type: 'line', showSymbol: false, yAxisIndex: 1, data: [] }
  ]
};
```

### 3.4 追加数据（appendData）
ECharts `appendData` 需要：
- `seriesIndex`：要追加的序列索引
- `data`：要追加的点数组

示意：
```js
chart.appendData({ seriesIndex: 0, data: [[t, temperature]] });
chart.appendData({ seriesIndex: 1, data: [[t, rpm]] });
```

建议做“批量追加”而不是每条 reading 都立即 append（更稳）：
- 用一个 buffer（数组）暂存最近 N 条数据
- 用 `requestAnimationFrame` 或 `setInterval(100~250ms)` 批量 flush

### 3.5 控制窗口长度（避免无限增长）
`appendData` 只会追加，不会自动裁剪历史点。建议：
- 只保留最近 `N` 个点（例如 600 点 = 10 分钟 * 1Hz）
- 超过 N 时：
  - 最稳妥做法：触发一次轻量“重建”数据窗口（把窗口数组重新 `setOption` 一次）
  - 或结合 `dataZoom` 只看最近窗口（但底层数据仍增长，不推荐长期运行）

推荐策略（实用优先）：
- 平时用 `appendData`
- 每累计例如 1000 点做一次“窗口重置”（`setOption` 替换为截断后的 data）

## 4. React 组件结构建议

### 4.1 页面结构
- `IotDashboardPage`
  - `ConnectionStatus`（SSE 连接状态）
  - `LatestCard`（显示最新 temperature/rpm/timestamp）
  - `RealtimeChart`（ECharts 折线图）

### 4.2 RealtimeChart 关键实现点
建议使用：
- `useRef` 保存 DOM 容器与 ECharts 实例
- `useEffect` 初始化/销毁 chart
- `useEffect` 订阅 SSE，并把 reading 写入 buffer
- flush 时执行 `appendData`

注意事项：
- 图表容器 resize：用 `ResizeObserver` 或窗口 `resize` 事件调用 `chart.resize()`
- 切换页面时：记得 `es.close()` + `chart.dispose()`

## 5. 本地开发联调注意事项

### 5.1 CORS
如果前端 dev server 不是 `localhost:8080`（例如 `5173`），需要后端允许跨域：
- 开发期可以在后端加 CORS 配置（Spring MVC）
- 或前端用 dev proxy（推荐，避免 CORS 复杂性）

### 5.2 验证链路是否在推送
1. 前端/终端先连 SSE：
   - `curl -N http://localhost:8080/api/iot/stream`
2. 再向 Kafka 写入测试消息（或让上游 MQTT/网关持续产生消息）
3. 观察：
   - SSE 端是否持续输出 JSON
   - Redis `device:latest:device-001` 是否持续刷新（TTL 递减再被重置）

## 6. “接口管推送”与“Redis 管缓存”的职责讨论（结论）

建议职责边界如下：
- **SSE 接口只决定“是否推送”**：前端不连就不推送，连了就推送实时数据。
- **Redis latest 缓存照常更新**：它是系统的“最新值缓存”，不应依赖前端是否在线。
- 如果担心“无前端时仍一刻不停刷新 Redis”带来资源浪费：
  - 可以增加可选的“降频”策略（例如按设备维度 1s 内只写一次 Redis）
  - 或在 `DeviceDataConsumer` 增加“内容不变不写入”的去重（需要缓存上次值，权衡一致性）

