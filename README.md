# Digital Bookshelf 📚

> An interactive information-visualization web app for **COMPX532 — Information Visualization**, University of Waikato.

This project visualises a personal digital bookshelf by organising books across **country**, **time period**, **category**, and **reading status**. Books are rendered as colored spines standing on virtual shelves; switching the grouping dimension reorganises the entire bookshelf in place.

Built with **React 18 + Vite + TypeScript**. All data persists in browser `localStorage` — no backend required.

## ✨ 功能亮点

### 主视觉：虚拟书架
- 每本书渲染为一条**垂直书脊**，标题竖排显示
- 书脊颜色根据**类别哈希**自动分配，便于视觉聚类
- 书脊**厚度反映页数**（28–44 px），呈现真实书架感
- 鼠标悬停时书脊"抽出"，点击打开详情面板

### 4 个分组维度（一键切换）
- 🌍 **按作者国家**
- 📅 **按出版年代**（每 10 年一桶）
- 🏷 **按图书类别**
- 📖 **按阅读状态**（想读 / 在读 / 已读）

### 数据可视化面板（纯手写 SVG / CSS，零依赖）
- 国家分布 · 横向条形图（Top 6）
- 类别数量 · 横向条形图（Top 6）
- 出版年代分布 · 柱状图
- 阅读状态比例 · SVG 环形图 + 图例

### 详情侧拉面板
- 点击书脊从右侧滑入完整信息
- 在面板内直接评分、写笔记，自动保存
- 一键编辑 / 移除

### 顶部 Hero 区
- 项目 Purpose 声明
- 4 个 KPI：总藏书 · 涵盖国家 · 年代跨度 · 已读完成率

### 同时保留
- 全文搜索（书名 / 作者 / 国家 / 类别 / 年份 / 笔记）
- 阅读状态筛选 + 多种排序
- 评分（5 星）和读书笔记
- CRUD + localStorage 持久化
- 响应式布局 + 自动暗色模式

## 🚀 快速开始

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 生产构建
npm run preview  # 预览构建产物
npm run lint     # 类型检查
```

## 🗂 项目结构

```
src/
├── main.tsx
├── App.tsx                       # 顶层布局
├── App.css / index.css           # 温暖图书馆风格主题
├── types/book.ts                 # Book / ReadingStatus / 颜色映射
├── hooks/useBooks.ts             # 状态管理 + localStorage 同步
├── utils/
│   ├── storage.ts                # 读写、迁移、种子数据
│   ├── colors.ts                 # 类别色板 + 书脊厚度
│   ├── grouping.ts               # 4 维度分组算法
│   └── stats.ts                  # 图表数据聚合
└── components/
    ├── Hero.tsx                  # 顶部说明区 + KPI
    ├── InsightsPanel.tsx         # 4 张图表
    ├── GroupingToggle.tsx        # 分组维度切换器
    ├── Bookshelf.tsx             # 书架容器（含搁板）
    ├── BookSpine.tsx             # 单本书脊
    ├── ShelfControls.tsx         # 搜索 / 筛选 / 排序 / 添加
    ├── BookDetailDrawer.tsx      # 右侧详情面板
    ├── BookForm.tsx              # 添加 / 编辑表单
    ├── Modal.tsx                 # 通用模态框
    └── StarRating.tsx            # 5 星评分
```

## 🧠 信息可视化设计要点

| 设计选择 | 信息可视化原则 |
| --- | --- |
| 4 个一键切换的分组维度 | 多视角分析（Multiple Coordinated Views 的简化版） |
| 书脊颜色由类别哈希得到 | Pre-attentive attribute：颜色用于分组识别 |
| 书脊厚度映射页数 | 数据驱动几何（数据→视觉变量） |
| 搜索/筛选时**淡化**而非删除非匹配项 | 保持上下文（context preservation） |
| Hero 顶部 KPI + Insights 4 图 | Overview first, details on demand |
| 点击书脊 → 侧拉详情 | Details on demand |
| Donut + Bar + Column 混合 | 不同形态对应不同数据分布特征 |

## 📌 课程信息

- 课程：**COMPX532 — Information Visualization**
- 学校：University of Waikato
- Assignment 4：Interactive Information Visualization

## 📄 License

仅用于课程作业与学习用途。
