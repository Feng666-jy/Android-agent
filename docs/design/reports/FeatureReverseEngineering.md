# Feature Reverse Engineering Report

> 基于当前 Android Agent 项目源码，对每个可交互元素进行完整的业务功能逆向推导。
> 参考：ChatGPT、Claude.ai、Codex、Gemini、Cursor、Cherry Studio、Open WebUI 等成熟产品。

---

## 1. AiHomePage（AI 主页）

### 1.1 整体页面生命周期

```
进入页面
  → 加载用户偏好（当前模型、主题、工作模式）
  → 检查 Token 有效性
  → 建立 SSE 连接（未来）
  → 渲染历史消息（未来）
  → 聚焦输入框

离开页面
  → 保存草稿（未发送内容）
  → 断开 SSE 连接
  → 持久化会话状态
```

---

## 2. TopBar（顶部栏）

### 2.1 返回按钮

| 维度 | 推导 |
|------|------|
| **按钮职责** | 退出当前工作区，返回个人中心。语义等价于"离开当前会话"。 |
| **用户行为** | 点击前：用户在对话/工作中。点击后：导航到个人中心。连续点击：幂等，不重复导航。返回键：相同行为。 |
| **业务逻辑** | ① 检查是否有未发送的草稿内容 → 弹出保存确认 ② 清除当前工作区状态 ③ 导航到 /personal-center |
| **数据流** | View(Click) → ViewModel(leaveWorkspace) → UseCase(SaveDraft) → Repository → DataStore |
| **异常处理** | 草稿保存失败 → Toast 提示"草稿保存失败，是否继续？" → 用户选择丢弃或重试 |
| **对标** | ChatGPT 侧栏 "New Chat" 后的个人入口；Codex 顶部 ← 回项目列表 |

### 2.2 SegmentControl（工作/代码模式切换）

| 维度 | 推导 |
|------|------|
| **按钮职责** | 切换 AI 助手的核心工作模式——"工作模式"（通用对话+工具）vs "代码模式"（IDE 协作） |
| **用户行为** | 点击前：当前模式高亮。点击后：切换模式，底部工具栏联动切换，工作区上下文重置。快速切换：防抖 300ms，防止误触。 |
| **业务逻辑** | ① 保存当前模式下的工作区状态 ② 切换模式标识 ③ 加载新模式的工作区布局 ④ 更新底部工具栏 items |
| **数据流** | View(Click) → ViewModel.switchMode(mode) → DataStore.saveMode(mode) → ViewModel.reloadWorkspace() |
| **UI 状态** | Loading: 切换中禁用点击；Success: 新模式高亮；Error: 恢复原模式 + Toast |
| **对标** | Claude.ai "Artifacts / Chat" 切换；ChatGPT "GPTs / 聊天" |

### 2.3 ActionButtons（三 Provider 模型选择器）

| 维度 | 推导 |
|------|------|
| **按钮职责** | 切换当前对话使用的 AI Provider（DeepSeek / Claude / ChatGPT），每个 Provider 有自己的模型列表 |
| **用户行为** | 点击触发器 → 懒加载模型列表 → 选择模型 → 持久化 → 后续对话使用新模型。互斥逻辑：展开一个 Provider 下拉时自动关闭其他。 |
| **业务逻辑** | ① 展开 → 检查缓存，未缓存则 API 请求 ② 选择 → 更新默认模型 ③ 关闭 → 持久化选择到会话 ④ 外部点击 → 关闭所有下拉 |
| **数据流** | View(Click) → ViewModel.toggleProvider(providerId) → UseCase.GetModels → Repository → API/Cache → ViewModel.updateModels() |
| **UI 状态** | Loading: 骨架屏；Success: 渲染模型列表；Empty: "暂无可用模型，请配置 API Key"；Error: "加载失败，点击重试" |
| **异常处理** | API Key 未配置 → 引导配置；Provider 不可用 → 标记灰显 + Tooltip；模型列表为空 → 引导添加模型 |
| **对标** | ChatGPT 顶部 "GPT-4o / o1 / o1-mini" 切换；Claude "Pro / Sonnet / Haiku" |

---

## 3. ModelSelector（单个模型选择器）

### 3.1 触发按钮

| 维度 | 推导 |
|------|------|
| **按钮职责** | 展示当前选中模型名称，点击展开模型下拉列表 |
| **用户行为** | hover 浮起（ translateY(-1px) ）、active 缩放（ 0.97 ）、箭头旋转指示开合 |
| **数据流** | 当前模型来自 DataStore → ViewModel 暴露 StateFlow → Compose collectAsState → 渲染 displayLabel |
| **UI 状态** | 正常：显示模型名 + 下拉箭头；展开中：箭头旋转 180° + 按钮高亮边框 |

### 3.2 下拉面板

| 维度 | 推导 |
|------|------|
| **按钮职责** | 展示该 Provider 下的所有可用模型，支持选择 |
| **交互行为** | 进入动画（opacity + translate + scale），最大高度 60vh 内滚动，点击外部关闭 |
| **UI 状态** | Loading: 骨架屏（3-5 个占位项）；Success: 模型列表；Empty: "暂无模型" + 配置引导；Error: 重试按钮 |

### 3.3 模型项（ModelItem）

| 维度 | 推导 |
|------|------|
| **按钮职责** | 展示单个模型信息，点击选中 |
| **显示内容** | displayName + 能力标签（Vision/Reasoning/Coding）+ 选中勾选标记 |
| **点击行为** | → handleSelect → 更新 selectedModel → 关闭下拉 → 持久化到会话 → 通知父组件 |

---

## 4. ChatInput（消息输入区）

### 4.1 文本输入框

| 维度 | 推导 |
|------|------|
| **按钮职责** | 多行文本输入，AI 对话的核心入口 |
| **交互行为** | Enter 发送，Shift+Enter 换行，自动高度增长，粘贴图片（Vision），@引用（未来） |
| **业务逻辑** | ① 输入内容实时校验（空内容禁用发送） ② 草稿自动保存（debounce 500ms） ③ 历史命令 ↑↓ 切换（未来） |
| **数据流** | 用户输入 → v-model → inputValue ref → 发送时 emit('send') |
| **UI 状态** | 正常：可编辑；流式输出中：禁用输入或显示"停止生成"；禁用：opacity 0.3 |

### 4.2 发送按钮

| 维度 | 推导 |
|------|------|
| **按钮职责** | 提交消息到 AI API，触发流式响应 |
| **交互行为** | 空内容禁用，hover 放大 1.05，active 缩小 0.95 |
| **完整发送链路** | 用户输入 → [Enter/点击] → handleSend → emit('send') → 父组件构建消息 → 调用 AI API → 流式渲染 → 清空输入 → 按钮变 Stop → 完成后恢复 |
| **UI 状态** | 可发送：正常样式；空内容：禁用 + opacity 0.3；发送中：切换为停止按钮（⏹）；流式输出中：禁用发送或切换为 Stop |
| **异常处理** | 网络错误 → Toast + 重试按钮；Provider 超时 → "请求超时，请重试"；Token 超限 → 引导压缩上下文；API 500 → "服务暂不可用" |
| **未来扩展** | 语音输入、@文件引用、图片粘贴、Slash 命令 |

---

## 5. BottomToolbar（底部工具栏）

### 5.1 工作模式按钮

| 按钮 | 功能推导 |
|------|----------|
| **搜索 (web-search)** | 联网搜索增强（RAG），实时信息获取，搜索结果引用到对话，来源链接展示。对标 ChatGPT Search、Perplexity |
| **绘图 (image-gen)** | 文本→图像生成（DALL·E 集成），图像编辑，历史生成画廊。对标 ChatGPT DALL·E、Midjourney |
| **文件 (files)** | 上传/管理文档（PDF/Word/Code），文件作为上下文引用，文件预览与分片。对标 ChatGPT 文件上传、Claude Projects |
| **代码 (code)** | 代码片段执行/预览，语言选择，沙箱运行环境。对标 Codex、Cursor |
| **历史 (history)** | 历史会话列表，按时间/主题分组，恢复/删除/重命名会话。对标 ChatGPT 侧栏 |
| **设置 (settings)** | API Key 管理，主题/语言/字体，模型参数（temperature/top_p），数据导出/删除 |

### 5.2 代码模式按钮

| 按钮 | 功能推导 |
|------|----------|
| **GitHub** | 仓库列表/切换，PR 创建/查看，Issues 引用。对标 Codex、Cursor Git 集成 |
| **调试 (debug)** | 断点设置，变量监视，单步执行/跳过。对标 VS Code Debugger |
| **终端 (terminal)** | Shell 命令执行，安装依赖/运行测试，输出实时流式显示。对标 Codex Terminal、Cursor Terminal |
| **审查 (review)** | PR diff 审查，安全/性能/风格建议，一键修复 suggestions。对标 GitHub Copilot Review |
| **部署 (deploy)** | 一键部署到云，部署日志，预览 URL 生成。对标 Vercel/Netlify |
| **文档 (docs)** | 项目文档撰写/预览，Markdown 实时渲染。对标 Claude Artifacts |

---

## 6. HomeView（首页/个人中心）

### 6.1 登出按钮

| 维度 | 推导 |
|------|------|
| **按钮职责** | 安全退出当前账号 |
| **交互行为** | 点击 → Vant showDialog 确认 → 确认后清除 Token + 跳转登录页 → 取消关闭 dialog |
| **数据流** | View(Click) → ViewModel.logout() → UseCase.Logout → Repository.clearSession() → DataStore.clearToken() → Navigate to /login |
| **UI 状态** | Loading: 旋转图标；Success: 跳转登录页；Error: Toast + 留在当前页 |

### 6.2 统计卡片 / 快速操作

| 元素 | 功能推导 |
|------|----------|
| **Projects 卡片** | 展示项目总数，点击跳转到项目详情（当前仅展示，未来需实现项目管理系统） |
| **New Project** | 创建新项目 → 项目命名/模板选择/AI 辅助初始化 → 跳转到新项目工作区 |
| **AI Chat** | 跳转到主对话界面（/ai-home），携带当前选中的模型上下文 |
| **Settings** | 跳转到全局配置页面，管理 Provider/Model/主题/快捷键 |
| **Recent Activity** | 时间线展示系统事件和用户操作，点击跳转到对应实体 |

---

## 7. 全局交互设计（跨组件）

| 维度 | 对标产品 | 应有功能 |
|------|----------|----------|
| **会话管理** | ChatGPT 侧栏 / Codex 任务列表 | 新建/恢复/删除/归档/搜索/重命名会话 |
| **流式输出** | 所有产品 | SSE/WebSocket 逐字渲染 + Markdown 解析 + 代码高亮 |
| **多模态** | ChatGPT Voice / Vision | 语音输入转文字、图片上传分析、图片生成 |
| **工具调用** | ChatGPT Advanced Data Analysis | 代码执行沙箱、联网搜索、文件读取、函数调用 |
| **上下文记忆** | Memory (ChatGPT) / CLAUDE.md | 持久化用户偏好、项目上下文、系统提示词 |
| **键盘快捷键** | Cmd+K 命令面板 | 新会话 Ctrl+N、聚焦输入 Ctrl+L、设置 Ctrl+, |
| **深色模式** | 所有现代产品 | 跟随系统 + 手动切换 + token 化变量 |
| **响应式** | 移动端 App | 底部工具栏 + 全屏输入适配移动端 |
| **分享与导出** | ChatGPT Share Link | 对话分享链接、导出 Markdown/PDF |

---

## 8. 总结

该组件库构成了一个**双态 AI 助手应用**（对话/代码）的完整骨架：

- **TopBar + SegmentControl** = 导航层（返回 + 模式切换）
- **ActionButtons + ModelSelector** = 模型层（多 Provider 多 Model 选择）
- **ChatInput** = 输入层（消息发送核心交互）
- **BottomToolbar** = 工具层（模式相关的快捷功能入口）
- **HomeView** = 首页层（个人中心 + 快速入口 + 活动流）

整体对标 **ChatGPT + Codex + Claude.ai** 的混合架构，交互范式成熟但当前实现停留在 UI 骨架阶段——业务逻辑（对话、流式调用、文件处理、代码执行等）尚待对接后端服务填充。