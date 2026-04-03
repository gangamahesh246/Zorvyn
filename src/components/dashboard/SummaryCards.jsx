import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
} from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'

export default function SummaryCards() {
  const transactions = useSelector((state) => state.transactions.items)

  const summary = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthTxns = transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const lastMonthTxns = transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const balance = totalIncome - totalExpenses

    const curIncome = currentMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const prevIncome = lastMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const curExpenses = currentMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const prevExpenses = lastMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    const incomeChange = prevIncome ? (((curIncome - prevIncome) / prevIncome) * 100).toFixed(1) : 0
    const expenseChange = prevExpenses ? (((curExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1) : 0
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

    return {
      balance,
      totalIncome,
      totalExpenses,
      incomeChange: Number(incomeChange),
      expenseChange: Number(expenseChange),
      savingsRate: Number(savingsRate),
    }
  }, [transactions])

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.balance),
      icon: Wallet,
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
      iconColor: 'text-primary-600 dark:text-primary-400',
      trend: null,
    },
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: TrendingUp,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      trend: summary.incomeChange,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: TrendingDown,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      trend: summary.expenseChange,
      trendLabel: 'vs last month',
      invertTrend: true,
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      icon: PiggyBank,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: null,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositive = card.invertTrend ? card.trend < 0 : card.trend > 0
        return (
          <div
            key={card.title}
            className="card animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              {card.trend !== null && (
                <div className={`flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg ${
                  isPositive
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30'
                    : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(card.trend)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {card.title}
            </p>
          </div>
        )
      })}
    </div>
  )
}
