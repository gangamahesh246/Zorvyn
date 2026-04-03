# FinDash - Finance Dashboard

A clean, interactive finance dashboard built with React for tracking and understanding financial activity.

Designed with a modern UI inspired by the Worklio dashboard aesthetic — dark sidebar, card-based layouts, purple/indigo accents, and polished data visualizations.

---

## Features

### Dashboard Overview

- Summary cards showing Total Balance, Income, Expenses, and Savings Rate
- Trend indicators comparing current vs previous month
- Area chart for balance trend over time (filterable by metric)
- Donut chart for spending breakdown by category
- Recent transactions widget with quick navigation

### Transactions

- Full paginated transaction list with 50 mock entries
- Search by description or category name
- Filter by category, type (income/expense), and date range (7d / 30d / 90d)
- Sort by date, amount, or name in ascending/descending order
- Add, edit, and delete transactions (admin only)
- Export data as CSV or JSON

### Insights & Analytics

- Key metric cards: highest spending category, average transaction, monthly change, income-to-expense ratio
- Monthly income vs expenses bar chart
- Spending by category horizontal bar chart
- Savings trend line chart
- Key observations with actionable recommendations

### Role-Based UI

- Admin/Viewer toggle in the header
- Admin: can add, edit, and delete transactions
- Viewer: read-only access with action buttons hidden
- Role selection persists across sessions

### Additional Enhancements

- Dark mode with persistent preference
- Fully responsive layout (mobile, tablet, desktop)
- Collapsible sidebar with overlay on mobile
- Data persistence via localStorage
- Smooth fade-in and slide-up animations
- Graceful empty state handling

---

## Tech Stack

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| React 18 + Vite  | UI framework and build tool  |
| Tailwind CSS 3   | Utility-first styling        |
| Redux Toolkit    | Global state management      |
| Recharts         | Charts and data visualization|
| Lucide React     | Icon library                 |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
cd finance-dashboard
npm install
npm run dev
```

The app will open at http://localhost:3000

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
finance-dashboard/
│
├── public/
│   └── vite.svg
│
├── src/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── BalanceTrend.jsx
│   │   │   ├── SpendingBreakdown.jsx
│   │   │   └── RecentTransactions.jsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionFilters.jsx
│   │   │   └── AddTransactionModal.jsx
│   │   │
│   │   └── common/
│   │
│   ├── store/
│   │   ├── index.js
│   │   └── slices/
│   │       ├── transactionsSlice.js
│   │       ├── filtersSlice.js
│   │       ├── roleSlice.js
│   │       └── themeSlice.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   └── Insights.jsx
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

---

## Approach and Design Decisions

### 1. Component Architecture

Each feature is broken into focused, reusable components. Pages act as containers that compose these components into complete views. This keeps each file small and easy to maintain.

### 2. State Management

Redux Toolkit manages all shared state across the app. There are four separate slices:

- **transactionsSlice** — CRUD operations on transaction data
- **filtersSlice** — search, category, type, date range, and sort preferences
- **roleSlice** — current user role (admin or viewer)
- **themeSlice** — dark/light mode preference

### 3. Mock Data

The app uses 50 realistic transactions spanning January to April 2026, spread across 12 categories. Monthly aggregated data powers the trend and comparison charts.

### 4. Role Simulation

A simple toggle in the header switches between Admin and Viewer roles. No backend authentication is needed — the UI conditionally renders action buttons (add, edit, delete) based on the selected role.

### 5. Responsive Design

- The sidebar collapses on mobile and shows as an overlay
- Grids adapt from 1 column on mobile to 4 columns on desktop
- The transaction table switches to a card layout on small screens
- The role toggle shows icon-only on mobile for compact display

### 6. Theming

Dark mode is implemented using Tailwind's `darkMode: 'class'` strategy. A single toggle in the header switches the entire UI, and the preference is saved to localStorage.

---
