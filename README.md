# Tarot AI - 塔罗牌AI咨询网站

一个现代化的塔罗牌解读应用，集成AI智能解读功能。

## 功能特性

- 🔮 多种塔罗牌牌阵（单张牌、三张牌、凯尔特十字等）
- 🤖 AI智能解读和对话功能
- 💬 支持上下文对话记忆
- 🎨 精美的用户界面和动画效果
- 📱 响应式设计，支持移动端
- 🌙 深色主题设计
- 💾 本地数据存储

## 环境配置

### AI功能配置

要启用真实的AI解读功能，需要配置OpenAI API：

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的API配置：
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

# Next.js Public Environment Variables
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OPENAI_BASE_URL=https://api.openai.com/v1
NEXT_PUBLIC_OPENAI_MODEL=gpt-3.5-turbo
```

### 获取OpenAI API密钥

1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册并登录账户
3. 前往 API Keys 页面
4. 创建新的API密钥
5. 将密钥复制到 `.env` 文件中

### 兼容其他AI服务

本应用使用标准的OpenAI API格式，也支持其他兼容的AI服务：

- **Azure OpenAI**: 修改 `NEXT_PUBLIC_OPENAI_BASE_URL` 为你的Azure端点
- **其他兼容服务**: 只需修改base URL即可

```bash
# 使用其他 AI 服务（如 Azure OpenAI、Claude 等）
NEXT_PUBLIC_OPENAI_BASE_URL=https://your-ai-service.com/v1
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key
NEXT_PUBLIC_OPENAI_MODEL=gpt-4  # 或其他支持的模型
```

### 支持的模型

- **GPT-4 系列**: `gpt-4`, `gpt-4-turbo`, `gpt-4-turbo-preview`
- **GPT-3.5 系列**: `gpt-3.5-turbo`, `gpt-3.5-turbo-16k`
- **其他兼容模型**: 根据你使用的 AI 服务提供商而定

### 模拟模式

如果未配置API密钥，应用将自动使用模拟数据：
- 提供预设的解读内容
- 模拟AI对话回复
- 所有功能正常工作，但内容为静态模拟

## 开发指南

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
