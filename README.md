# DateCalc - 智能日期计算器 📅

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一款轻量、极简且现代的**三参数日期自由计算器**，支持三参数双向自由推算与本地历史记录管理。

---

## ✨ 核心功能

### 1. 🧮 三参数自由推算
支持在 **起始日期**、**相隔天数**、**结束日期** 三者之间自由切换未知项进行推算：
- **计算相隔天数**：选择起始日期与结束日期，精确推算相隔天数（可自由切换“含首尾”或“不含首尾”）。
- **推算结束日期**：选择起始日期与相隔天数，自动推算未来的结束日期。
- **倒推起始日期**：选择结束日期与相隔天数，自动倒推过去的起始日期。
- **快捷天数预设**：提供 7天、30天、90天、100天、180天、365天 等常用按钮快速填入。

### 2. 💾 历史记录与状态推算
- **一键归档保存**：计算结果支持添加自定义标题与备注并保存。
- **实时倒计时标注**：针对每条历史记录，根据当前日期自动实时显示：
- **快速载入回填**：点击任意历史记录，可一键将该计算参数重新载入回主计算器。
- **删除二次确认**：针对单条删除与清空全部操作均具备防误触二次确认弹窗。
- **隐私保护**：所有计算记录仅保存在用户浏览器的本地存储，不经过任何服务端。

### 3. 🌓 主题与界面
- 支持**深色模式 (Dark Mode)** 与**浅色模式**无缝切换，并可随系统自动适配。
- 极简自适应响应式设计，良好兼容桌面端与移动端体验。

---

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI 样式**：Tailwind CSS
- **图标组件**：Lucide React

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Yecraft2025/Date-Calculator.git
cd Date-Calculator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

启动后在浏览器访问 `http://localhost:3000` 即可体验。

### 4. 项目打包

```bash
npm run build
```

打包生成的 `dist` 静态资源目录可部署至 GitHub Pages、Vercel、Netlify 等任何静态托管服务。

---

## 📄 开源协议

[MIT License](LICENSE)
