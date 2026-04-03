import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { categories } from '../../data/mockData'
import { formatCurrency, getCategoryName, getCategoryColor } from '../../utils/helpers'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const data = payload[0]
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 border border-gray-100 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {formatCurrency(data.value)} ({data.payload.percentage}%)
      </p>
    </div>
  )
}

export default function SpendingBreakdown() {
  const transactions = useSelector((state) => state.transactions.items)

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0)

    const grouped = {}
    expenses.forEach((t) => {
      if (!grouped[t.category]) grouped[t.category] = 0
      grouped[t.category] += t.amount
    })

    return Object.entries(grouped)
      .map(([cat, amount]) => ({
        name: getCategoryName(categories, cat),
        value: Math.round(amount * 100) / 100,
        color: getCategoryColor(categories, cat),
        percentage: ((amount / totalExpenses) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const totalExpenses = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
        Spending Breakdown
      </h3>

      <div className="flex flex-col items-center">
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {data.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600 dark:text-gray-300 truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-xs w-12 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
