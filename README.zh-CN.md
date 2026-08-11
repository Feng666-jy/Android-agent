# Android Agent

基于 Vue3 + Express + node:sqlite 构建的企业级 AI 开发平台。

## 技术栈

### 前端
- Vue 3 + Composition API
- TypeScript
- Vite
- Pinia（状态管理）
- Vue Router
- Vant（UI 组件库）
- SCSS

### 后端
- Node.js + Express
- TypeScript
- node:sqlite（SQLite，内置驱动，零原生依赖）
- JWT 认证
- Zod（校验）

## 快速开始

### 环境要求
- Node.js >= 18
- MySQL >= 8.0（可选，默认使用 SQLite）

### 安装

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env .env.local
# 编辑 .env.local 配置数据库连接信息

# 初始化数据库（会清空重建）
npm run db:init
# 填充种子数据（admin/admin123, demo/test123）
npm run db:seed

# 启动开发服务器
npm run dev:all

# 或分别启动
npm run dev      # 前端 Vite (port 5173)
npm run server   # 后端 Express (port 3000)
```

### Docker

```bash
cd docker
docker compose up -d
```

## 项目结构

```
├── src/                  # 前端源码
│   ├── api/              # API 模块
│   ├── components/
│   │   └── ai-home/      # AI 首页组件（TopBar、BottomCard、ChatInput 等）
│   ├── composables/      # 组合式函数
│   ├── layouts/
│   │   └── TabLayout.vue # Tab 页面统一布局
│   ├── router/           # Vue Router 配置
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # SCSS 变量、混入、Design Token
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   └── views/            # 页面视图
│       ├── auth/         # 登录 / 注册
│       ├── home/         # 首页
│       ├── SearchView.vue
│       ├── ImageView.vue
│       ├── FilesView.vue
│       ├── CodeView.vue
│       ├── HistoryView.vue
│       └── SettingsView.vue
├── server/               # 后端源码
│   └── src/
│       ├── controllers/
│       ├── db/            # SQLite 数据层（schema / 字段映射 / 查询构建 / 门面）
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utils/
├── scripts/               # db:init / db:seed 脚本
└── docker/               # Docker 配置
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | LoginView | 用户登录 |
| `/register` | RegisterView | 用户注册 |
| `/home` | AiHomePage | AI 助手首页（Segment 切换、底部卡片） |
| `/workspace/search` | SearchView | 搜索 |
| `/workspace/image` | ImageView | 绘图 |
| `/workspace/files` | FilesView | 文件 |
| `/workspace/code` | CodeView | 代码 |
| `/workspace/history` | HistoryView | 历史 |
| `/workspace/settings` | SettingsView | 设置 |

## API 接口

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | /api/user/register | 否 | 用户注册 |
| POST | /api/user/login | 否 | 用户登录 |
| GET | /api/user/info | 是 | 获取用户信息 |
| PUT | /api/user/profile | 是 | 更新个人资料 |

## 设计规范

项目遵循统一的 Design Token 系统，所有颜色、圆角、阴影、间距均定义在 `src/styles/_ai-tokens.scss` 中，确保页面风格一致。

## 许可

MIT