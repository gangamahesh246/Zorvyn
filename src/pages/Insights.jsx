import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import { categories, monthlyData } from '../data/mockData'
import { formatCurrency, getCategoryName, getCategoryColor } from '../utils/helpers'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Target,
  Calendar,
} from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 border border-gray-100 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-gray-600 dark:text-gray-300 capitalize">{entry.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Insights() {
  const transactions = useSelector((state) => state.transactions.items)

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const incomes = transactions.filter((t) => t.type === 'income')

    const categoryTotals = {}
    expenses.forEach((t) => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0
      categoryTotals[t.category] += t.amount
    })

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => ({
        id: cat,
        name: getCategoryName(categories, cat),
        amount,
        color: getCategoryColor(categories, cat),
      }))

    const highestCategory = sortedCategories[0] || null
    const lowestCategory = sortedCategories[sortedCategories.length - 1] || null

    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0)
    const avgTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const curMonthExpenses = expenses
      .filter((t) => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .reduce((s, t) => s + t.amount, 0)

    const prevMonthExpenses = expenses
      .filter((t) => {
        const d = new Date(t.date)
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
      })
      .reduce((s, t) => s + t.amount, 0)

    const expenseChangePercent = prevMonthExpenses
      ? (((curMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100).toFixed(1)
      : 0

    const dailySpending = {}
    expenses.forEach((t) => {
      if (!dailySpending[t.date]) dailySpending[t.date] = 0
      dailySpending[t.date] += t.amount
    })
    const sortedDaily = Object.entries(dailySpending).sort((a, b) => b[1] - a[1])
    const highestSpendingDay = sortedDaily[0] || null

    const categoryBarData = sortedCategories.slice(0, 8).map((c) => ({
      name: c.name,
      amount: Math.round(c.amount * 100) / 100,
      fill: c.color,
    }))

    return {
      highestCategory,
      lowestCategory,
      totalExpenses,
      totalIncome,
      avgTransaction: Math.round(avgTransaction * 100) / 100,
      curMonthExpenses,
      prevMonthExpenses,
      expenseChangePercent: Number(expenseChangePercent),
      highestSpendingDay,
      categoryBarData,
      sortedCategories,
      transactionCount: transactions.length,
      incomeCount: incomes.length,
      expenseCount: expenses.length,
    }
  }, [transactions])

  const insightCards = [
    {
      title: 'Highest Spending Category',
      value: insights.highestCategory?.name || 'N/A',
      detail: insights.highestCategory ? formatCurrency(insights.highestCategory.amount) : '',
      icon: TrendingUp,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: 'Average Transaction',
      value: formatCurrency(insights.avgTransaction),
      detail: `Across ${insights.expenseCount} expenses`,
      icon: Target,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      title: 'Monthly Expense Change',
      value: `${insights.expenseChangePercent > 0 ? '+' : ''}${insights.expenseChangePercent}%`,
      detail: `${formatCurrency(insights.curMonthExpenses)} this month`,
      icon: insights.expenseChangePercent <= 0 ? TrendingDown : TrendingUp,
      color: insights.expenseChangePercent <= 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-600 dark:text-red-400',
      bgColor: insights.expenseChangePercent <= 0
        ? 'bg-emerald-100 dark:bg-emerald-900/30'
        : 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: 'Income vs Expense Ratio',
      value: insights.totalExpenses > 0
        ? `${(insights.totalIncome / insights.totalExpenses).toFixed(2)}x`
        : 'N/A',
      detail: 'Income to expense ratio',
      icon: Sparkles,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insightCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bgColor} mb-4`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {card.title}
              </p>
              {card.detail && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {card.detail}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
            Monthly Income vs Expenses
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
            Spending by Category
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insights.categoryBarData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 5, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={20}>
                  {insights.categoryBarData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Savings Trend */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
          Savings Trend (Balance Over Time)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#7c5cfc"
                strokeWidth={3}
                dot={{ fill: '#7c5cfc', strokeWidth: 2, stroke: '#fff', r: 5 }}
                activeDot={{ r: 7, fill: '#7c5cfc', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Observations */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Key Observations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.highestCategory && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Highest Spending: {insights.highestCategory.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  You spent {formatCurrency(insights.highestCategory.amount)} on {insights.highestCategory.name}.
                  This accounts for {((insights.highestCategory.amount / insights.totalExpenses) * 100).toFixed(1)}% of total spending.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Savings Performance
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your income to expense ratio is {(insights.totalIncome / insights.totalExpenses).toFixed(2)}x.
                {insights.totalIncome > insights.totalExpenses * 1.5
                  ? ' Great job! You\'re saving well above average.'
                  : ' Consider reducing discretionary spending to improve savings.'}
              </p>
            </div>
          </div>

          {insights.highestSpendingDay && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Highest Spending Day
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  On {new Date(insights.highestSpendingDay[0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })},
                  you spent {formatCurrency(insights.highestSpendingDay[1])}.
                  Plan for high-expense days to stay within budget.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl">
            <Target className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Monthly Trend
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {insights.expenseChangePercent <= 0
                  ? `Expenses decreased by ${Math.abs(insights.expenseChangePercent)}% compared to last month. Keep it up!`
                  : `Expenses increased by ${insights.expenseChangePercent}% compared to last month. Consider reviewing your spending.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
