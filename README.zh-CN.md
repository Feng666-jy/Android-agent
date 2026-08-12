# 🤖 Android Agent

> 基于 Vue3 + Express 构建的企业级 AI Agent 开发平台
> 在 Android 环境中运行的智能代理系统，支持模型管理、AI 对话、任务执行与扩展能力。

<p align="center">
  <img src="./docs/banner.png" width="800">
</p>

<p align="center">
  <b>让 AI Agent 真正运行在你的设备上</b>
</p>


---

## ✨ 项目介绍

Android Agent 是一个面向移动端的 AI Agent 平台。

项目采用现代化前后端分离架构：

- 前端基于 **Vue3 + TypeScript**
- 后端基于 **Node.js + Express**
- 数据层使用 **SQLite + Custom Migration Runner + Typed Query Compatibility Layer**
- 支持接入不同 LLM 模型
- 支持模型管理、用户系统、任务执行等能力


目标：

> 打造一个可以运行在 Android 手机上的个人 AI 助手框架。


---

# 🚀 核心功能

## 🤖 AI Agent 能力

- 多模型接入
- 上游模型管理
- AI 对话
- Agent Loop 执行机制
- 工具调用扩展
- 上下文管理


## 🔌 模型管理

支持：

- 从上游 API 获取模型列表
- 模型分类管理
- 模型状态管理
- 用户自定义模型配置


示例：

```
DeepSeek
Claude
ChatGPT
Gemini
```

---

## 👤 用户系统

已支持：

- 用户注册
- 用户登录
- JWT 身份认证
- 用户信息管理
- 用户资料修改


---

## 📱 移动端适配

针对 Android 环境优化：

- 移动端 UI
- Touch 交互
- 响应式布局
- 后续支持 APK 打包


---

# 🏗️ 技术架构


```
                Android Client

                     │

                Vue3 Frontend

                     │

              Express API Server

                     │

          SQLite + Query Compatibility Layer

                     │

              AI Model Providers

```


---

# 🛠️ 技术栈


## 前端

| 技术 | 用途 |
|-|-|
| Vue 3 | 前端框架 |
| TypeScript | 类型系统 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| Vue Router | 路由管理 |
| Vant | 移动端 UI |
| SCSS | 样式系统 |


---

## 后端

| 技术 | 用途 |
|-|-|
| Node.js | 服务运行环境 |
| Express | API 服务 |
| TypeScript | 类型系统 |
| SQLite | 数据库 |
| SQLite | 数据库 |
| JWT | 用户认证 |
| Zod | 数据校验 |


---

# 📦 快速开始


## 环境要求


```
Node.js >= 18
MySQL >= 8.0
```


---

## 安装依赖


```bash
npm install
```


---

## 配置环境变量


复制环境文件：


```bash
cp .env .env.local
```


修改：

```
DATABASE_URL=
JWT_SECRET=
API_KEY=
```


---

## 初始化数据库


```bash
npm run db:init     # 初始化 schema + 应用全部迁移（自动备份，幂等）
npm run db:migrate  # 仅应用未执行的增量迁移
npm run db:inspect  # 查看表 / 列 / 索引 / 迁移状态
```


---

## 启动项目


启动前端：

```bash
npm run dev
```


启动后端：

```bash
npm run server
```


默认：

```
Frontend:
http://localhost:5173


Backend:
http://localhost:3000
```


---

# 🐳 Docker 部署


进入 docker 目录：


```bash
cd docker
```


启动服务：


```bash
docker compose up -d
```


---

# 📁 项目结构


```
Android-Agent

├── src/
│
│   ├── api/              # API接口
│   ├── components/       # 公共组件
│   ├── composables/      # Vue组合逻辑
│   ├── layouts/          # 页面布局
│   ├── router/           # 路由
│   ├── stores/           # Pinia状态
│   ├── styles/           # SCSS样式
│   ├── types/            # 类型定义
│   ├── utils/            # 工具函数
│   └── views/            # 页面
│
├── server/
│
│   └── src/
│       ├── controllers/  # 控制器
│       ├── middleware/   # 中间件
│       ├── routes/       # API路由
│       ├── services/     # 业务逻辑
│       ├── types/        # 类型
│       └── utils/        # 工具
│
├── server/src/db/
│       ├── schema.ts        # SQLite 基线 DDL
│       ├── migrations/      # 增量迁移（0001_init ~ 0008_ai_resource）
│       ├── query.ts         # Prisma 风格查询构建器（兼容层）
│       ├── fieldmaps.ts     # 表/字段映射
│       └── migrate.ts       # 幂等迁移运行器
│
└── docker/
        └── docker-compose.yml

```


---

# 🔌 API 接口


| 方法 | 地址 | 权限 | 描述 |
|-|-|-|-|
| POST | `/api/user/register` | ❌ | 用户注册 |
| POST | `/api/user/login` | ❌ | 用户登录 |
| GET | `/api/user/info` | ✅ | 获取用户信息 |
| PUT | `/api/user/profile` | ✅ | 修改用户资料 |


---

# 🖼️ 项目展示


<p align="center">
  <img src="./docs/home.png" width="250">
  <img src="./docs/chat.png" width="250">
  <img src="./docs/model.png" width="250">
</p>


---

# 🗺️ 开发路线


## Phase 1

✅ 用户系统

✅ 基础架构

✅ 模型管理


## Phase 2

🚧 AI 对话能力

🚧 Agent Loop

🚧 工具调用


## Phase 3

计划：

- Android APK 打包
- 本地模型支持
- 插件系统
- 多 Agent 协作


---

# 🤝 贡献


欢迎提交：

- Issue
- Pull Request
- Feature Request


---

# 📄 License


MIT License
