# 个人记账工具（NestJS + MongoDB）

一个基于 NestJS 和 MongoDB 的简易个人记账后端 API。

## 功能

- 新增收支记录
- 分页查询记录（支持按类型过滤）
- 汇总统计（收入、支出、余额）

## 快速开始

```bash
npm install
cp .env.example .env
npm run start:dev
```

默认端口：`3000`

## 环境变量

见 `.env.example`：

- `PORT`：服务端口
- `MONGO_URI`：MongoDB 连接串

## API

### 1) 新增记录

`POST /transactions`

```json
{
  "type": "income",
  "amount": 1200,
  "category": "工资",
  "note": "2月工资",
  "occurredAt": "2026-03-01T08:00:00.000Z"
}
```

### 2) 分页查询

`GET /transactions?page=1&limit=20&type=expense`

### 3) 汇总

`GET /transactions/summary`
